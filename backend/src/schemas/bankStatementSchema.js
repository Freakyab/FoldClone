const { z } = require('zod');

const transactionItemSchema = z.object({
  date: z.string(),
  description: z.string().optional().default(''),
  debit: z.number().default(0),
  credit: z.number().default(0),
  balance: z.number().default(0),
  tags: z.array(z.string()).default([]),
  details: z.record(z.unknown()).default({}),
});

const bankStatementSchema = z.object({
  account_number: z.string().optional().nullable(),
  account_name: z.string().optional().nullable(),
  bank_name: z.string().optional().nullable(),
  branch: z.string().optional().nullable(),
  currency: z.string().default('INR'),
  closing_balance: z.number().default(0),
  transactions: z.array(transactionItemSchema).default([]),
});

function parseBankStatement(raw) {
  return bankStatementSchema.parse(raw);
}

function safeParseBankStatement(raw) {
  return bankStatementSchema.safeParse(raw);
}

module.exports = {
  bankStatementSchema,
  transactionItemSchema,
  parseBankStatement,
  safeParseBankStatement,
};
