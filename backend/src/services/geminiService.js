const OpenAI = require('openai');
const PDFExtract = require('pdf.js-extract').PDFExtract;

const MODEL_NAME = process.env.OPENAI_MODEL_NAME || 'gpt-4o-mini';

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  return new OpenAI({ apiKey });
}

function buildSystemPrompt(tagList) {
  return `
You are a financial statement parser. The user will provide a bank statement (PDF text).
Extract the data and return STRICT JSON with this exact structure and keys:

{
  "account_number": "string",
  "account_name": "string",
  "bank_name": "string",
  "branch": "string",
  "currency": "INR",
  "closing_balance": 0,
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "string",
      "debit": 0,
      "credit": 0,
      "balance": 0,
      "tags": ["string"],
      "details": {}
    }
  ]
}

Rules:
- Always return valid JSON, no comments, no trailing commas.
- If a numeric field is missing, use 0.
- Dates must be in ISO format YYYY-MM-DD.
- debit is positive for money going out, credit is positive for money coming in.
- For each transaction, set "details" to a JSON object: include at least "description" with the raw narration text; optionally "balance_after", "reference", "merchant" if inferrable.

TAGGING (IMPORTANT):
- Read each transaction's description/narration carefully and infer what the transaction is for.
- You MUST assign at least 1 tag to every transaction. Use 2-3 tags when the description clearly fits multiple categories.
- For DEBIT (money out): choose from expense tags such as bill.*, food.*, transport.*, shopping.*, grocery.*, subscription, emi, credit.*, investment, insurance, tax, medical.*, etc.
- For CREDIT (money in): choose from income tags such as credit_salary.*, credit_earnings.*, credit_refund.*, credit_gift.*, credit_interest.*, credit_self_transfer.*, credit_cashback.*, etc.
- Match the description to the tag key that best fits (e.g. "SWIGGY" or "ZOMATO" -> food.swiggy or food.zomato; "SALARY" -> credit_salary.monthly; "UBER" -> transport.uber; "ELECTRICITY" -> bill.electricity; "NETFLIX" -> sub.netflix). When unsure, pick the closest match or use the "*.*others" or "credit_misc.others" / "misc.others" for that category.
- Use ONLY exact tag keys from the ALLOWED list below. Do not invent keys.

ALLOWED TAG KEYS (use only these exact strings in "tags"):
${tagList}
`;
}

async function extractBankStatementFromPdf(buffer) {
  const pdfExtract = new PDFExtract();

  const data = await new Promise((resolve, reject) => {
    pdfExtract.extractBuffer(buffer, {}, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });

  const text = data.pages
    .map((page) =>
      page.content
        .map((item) => item.str || '')
        .join(' '),
    )
    .join('\n\n');

  return extractBankStatementFromText(text);
}

async function extractBankStatementFromText(text) {
  const client = getClient();
  const { getTagListForPrompt } = require('./tagTaxonomyService');
  const tagList = await getTagListForPrompt();

  const messages = [
    {
      role: 'system',
      content: buildSystemPrompt(tagList),
    },
    {
      role: 'user',
      content: `Here is the bank statement text:\n\n${text}`,
    },
  ];

  const response = await client.chat.completions.create({
    model: MODEL_NAME,
    messages,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI did not return any content');
  }

  const raw = JSON.parse(content);
  const { parseBankStatement } = require('../schemas/bankStatementSchema');
  return parseBankStatement(raw);
}

module.exports = {
  extractBankStatementFromPdf,
  extractBankStatementFromText,
};


