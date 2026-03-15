/**
 * Processes a single statement job (PDF parse, bank upsert, transaction dedup + insert).
 * Used by Vercel Cron so work runs in a separate invocation from the upload request.
 */
const Bank = require('../models/Bank');
const Transaction = require('../models/Transaction');
const StatementJob = require('../models/StatementJob');
const StatementPassword = require('../models/StatementPassword');
const { encrypt: encryptStatementPassword } = require('../utils/statementPasswordCrypto');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const {
  extractBankStatementFromPdf,
  extractBankStatementFromText,
} = require('./geminiService');
const { getFileBuffer, deleteObject } = require('./s3Service');

function startOfDay(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function upsertStatementPassword(userId, parsed, password) {
  if (!password || typeof password !== 'string' || password.trim().length === 0) return;

  const bankName = parsed?.bank_name?.trim() || 'Unknown Bank';
  const accountNumber = parsed?.account_number ? String(parsed.account_number).trim() || null : null;
  const normalizedPassword = password.trim();

  const query = accountNumber
    ? { userId, accountNumber }
    : { userId, bankName, accountNumber: null };

  const passwordToStore = encryptStatementPassword(normalizedPassword);

  await StatementPassword.findOneAndUpdate(
    query,
    {
      $set: {
        bankName,
        accountNumber,
        password: passwordToStore,
        lastUsedAt: new Date(),
      },
      $setOnInsert: { userId },
    },
    { upsert: true, new: true, runValidators: true }
  );
}

async function upsertBankFromParsed(userId, parsed) {
  const accountNumber = parsed.account_number ? String(parsed.account_number).trim() || null : null;
  const bankName = parsed.bank_name || 'Primary Account';
  const accountName = parsed.account_name || 'Account Holder';
  const branch = parsed.branch || null;
  const currency = parsed.currency || 'INR';
  const closingBalance = typeof parsed.closing_balance === 'number' ? parsed.closing_balance : 0;

  const payload = {
    name: bankName,
    accountHolderName: accountName,
    accountNumber: accountNumber || undefined,
    branch: branch || undefined,
    balance: closingBalance,
    currency: currency || 'INR',
  };

  if (accountNumber) {
    const existing = await Bank.findOne({
      userId,
      accountNumber,
      isDeleted: { $ne: true },
    });

    if (existing) {
      const updated = await Bank.findOneAndUpdate(
        { _id: existing._id },
        { $set: payload },
        { new: true, runValidators: true }
      );
      return { bank: updated, isNew: false };
    }
  }

  const bank = await Bank.create({
    userId,
    ...payload,
  });
  return { bank, isNew: true };
}

async function filterDuplicateTransactions(userId, bankId, txDocs) {
  if (!txDocs.length) return [];
  const orConditions = txDocs.map((tx) => ({
    amount: tx.amount,
    type: tx.type,
    transactionDate: {
      $gte: startOfDay(tx.transactionDate),
      $lt: endOfDay(tx.transactionDate),
    },
  }));
  const existing = await Transaction.find({
    userId,
    bankId,
    $or: orConditions,
  })
    .lean()
    .select('amount type transactionDate');

  const existingKeys = new Set(
    existing.map((e) => `${e.amount}-${e.type}-${startOfDay(e.transactionDate).getTime()}`)
  );

  return txDocs.filter(
    (tx) => !existingKeys.has(`${tx.amount}-${tx.type}-${startOfDay(tx.transactionDate).getTime()}`)
  );
}

/**
 * Get PDF buffer and parsed statement from job payload (s3 or base64).
 */
async function getBufferAndParsed(job) {
  const { type, payload } = job;
  let buffer;

  if (type === 'base64') {
    const { pdfBase64, password } = payload || {};
    if (!pdfBase64) throw new Error('Missing pdfBase64 in job payload');
    buffer = Buffer.from(pdfBase64, 'base64');
  } else if (type === 's3') {
    const { key, password } = payload || {};
    if (!key) throw new Error('Missing key in job payload');
    buffer = await getFileBuffer(key);
  } else {
    throw new Error(`Unknown job type: ${type}`);
  }

  const password = payload?.password;
  let parsed;

  if (password && typeof password === 'string' && password.trim().length > 0) {
    const pdfExtract = new PDFExtract();
    const text = await new Promise((resolve, reject) => {
      pdfExtract.extractBuffer(buffer, { password: password.trim() }, (err, data) => {
        if (err) return reject(err);
        const allText = data.pages
          .map((page) =>
            page.content
              .map((item) => item.str || '')
              .join(' ')
          )
          .join('\n\n');
        resolve(allText);
      });
    });
    parsed = await extractBankStatementFromText(text);
  } else {
    parsed = await extractBankStatementFromPdf(buffer);
  }

  return { parsed, s3Key: type === 's3' ? payload.key : null, pdfSizeBytes: buffer.length };
}

/**
 * Process one statement job by id. Updates job status and result/error.
 * @param {string} jobId - StatementJob _id
 * @returns {Promise<{ success: boolean, job?: object }>}
 */
async function processStatementJob(jobId) {
  const job = await StatementJob.findOne({
    _id: jobId,
    status: 'pending',
  });

  if (!job) {
    return { success: false, reason: 'job_not_found_or_not_pending' };
  }

  const startedAt = new Date();
  await StatementJob.updateOne(
    { _id: jobId },
    { $set: { status: 'processing', startedAt } }
  );

  try {
    const { parsed, s3Key, pdfSizeBytes } = await getBufferAndParsed(job);
    const statementPassword = job?.payload?.password;
    await upsertStatementPassword(job.userId, parsed, statementPassword);

    await StatementJob.updateOne(
      { _id: jobId },
      { $set: { pdfSizeBytes: pdfSizeBytes ?? null } }
    );
    const { transactions = [], ...restParsed } = parsed || {};
    const { bank } = await upsertBankFromParsed(job.userId, {
      ...restParsed,
      currency: restParsed.currency || 'INR',
      closing_balance: restParsed.closing_balance ?? 0,
    });

    const accountIn = bank.accountNumber || bank.name || 'Account';
    const txDocs = [];
    const currency = restParsed.currency || 'INR';

    if (Array.isArray(transactions)) {
      for (const tx of transactions) {
        if (!tx) continue;
        const debit = Number(tx.debit) || 0;
        const credit = Number(tx.credit) || 0;
        const amount = debit > 0 ? debit : credit;
        const type = debit > 0 ? 'debit' : 'credit';
        if (amount <= 0) continue;
        let tagKeys = Array.isArray(tx.tags) ? tx.tags.filter(Boolean) : [];
        if (tagKeys.length === 0) {
          tagKeys = [type === 'credit' ? 'credit_misc.others' : 'misc.others'];
        }
        const otherDetails =
          tx.details && typeof tx.details === 'object'
            ? { ...tx.details, description: tx.details.description ?? tx.description }
            : { description: tx.description || '' };
        txDocs.push({
          userId: job.userId,
          bankId: bank._id,
          amount,
          type,
          transactionDate: tx.date ? new Date(tx.date) : new Date(),
          currency,
          accountIn,
          notes: null,
          otherDetails,
          tagKeys,
        });
      }
    }

    const toInsert = await filterDuplicateTransactions(job.userId, bank._id, txDocs);
    let createdTransactions = [];
    if (toInsert.length > 0) {
      createdTransactions = await Transaction.insertMany(toInsert);
    }

    if (s3Key) {
      try {
        await deleteObject(s3Key);
      } catch (cleanupError) {
        console.warn('Failed to delete S3 object after job', cleanupError);
      }
    }

    const completedAt = new Date();
    const durationMs = completedAt - startedAt;
    const transactionCount = createdTransactions.length;

    const result = {
      bank: {
        _id: bank._id,
        name: bank.name,
        accountNumber: bank.accountNumber,
        balance: bank.balance,
      },
      transactionsCreated: transactionCount,
      transactionsSkippedDuplicate: txDocs.length - toInsert.length,
    };

    await StatementJob.updateOne(
      { _id: jobId },
      {
        $set: {
          status: 'completed',
          result,
          completedAt,
          error: null,
          durationMs,
          transactionCount,
        },
      }
    );

    return { success: true, job: { _id: jobId, status: 'completed', result } };
  } catch (err) {
    const errorMessage = err.message || String(err);
    await StatementJob.updateOne(
      { _id: jobId },
      {
        $set: {
          status: 'failed',
          error: errorMessage,
          completedAt: new Date(),
        },
      }
    );
    throw err;
  }
}

module.exports = {
  processStatementJob,
};
