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

const BASE_PROMPT = `
You are a financial statement parser. The user will provide a bank statement PDF.
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
      "balance": 0
    }
  ]
}

Rules:
- Always return valid JSON, no comments, no trailing commas.
- If a numeric field is missing, use 0.
- Dates must be in ISO format YYYY-MM-DD.
- debit is positive for money going out, credit is positive for money coming in.
`;

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

  const messages = [
    {
      role: 'system',
      content: BASE_PROMPT,
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

  return JSON.parse(content);
}

module.exports = {
  extractBankStatementFromPdf,
  extractBankStatementFromText,
};


