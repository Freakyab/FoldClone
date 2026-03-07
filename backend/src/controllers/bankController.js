const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const Bank = require('../models/Bank');
const Transaction = require('../models/Transaction');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const {
  extractBankStatementFromPdf,
  extractBankStatementFromText,
} = require('../services/geminiService');
const { getFileBuffer, deleteObject } = require('../services/s3Service');

const createBank = async (req, res, next) => {
  try {
    const { isPrimary } = req.body;

    if (isPrimary) {
      await Bank.updateMany(
        { userId: req.user.id, isDeleted: false },
        { $set: { isPrimary: false } }
      );
    }

    const bank = await Bank.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Bank account added successfully',
      data: bank,
    });
  } catch (error) {
    next(error);
  }
};

const getBanks = async (req, res, next) => {
  try {
    const banks = await Bank.find({
      userId: req.user.id,
      isDeleted: false,
    })
      .sort({ isPrimary: -1, createdAt: -1 })
      .lean();

    const totalBalance = banks.reduce((sum, bank) => sum + (bank.balance || 0), 0);

    res.status(StatusCodes.OK).json({
      success: true,
      data: banks,
      meta: {
        count: banks.length,
        totalBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBankById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank ID',
        errorCode: 'INVALID_ID',
      });
    }

    const bank = await Bank.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: false,
    }).lean();

    if (!bank) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Bank account not found',
        errorCode: 'BANK_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: bank,
    });
  } catch (error) {
    next(error);
  }
};

const updateBank = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank ID',
        errorCode: 'INVALID_ID',
      });
    }

    const allowedFields = [
      'name', 'accountHolderName', 'accountNumber', 'ifscCode',
      'accountType', 'balance', 'currency', 'color', 'icon',
      'isPrimary', 'isActive',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (updates.isPrimary === true) {
      await Bank.updateMany(
        { userId: req.user.id, _id: { $ne: id }, isDeleted: false },
        { $set: { isPrimary: false } }
      );
    }

    const bank = await Bank.findOneAndUpdate(
      { _id: id, userId: req.user.id, isDeleted: false },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!bank) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Bank account not found',
        errorCode: 'BANK_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Bank account updated successfully',
      data: bank,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBank = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank ID',
        errorCode: 'INVALID_ID',
      });
    }

    const bank = await Bank.findOneAndUpdate(
      { _id: id, userId: req.user.id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), isActive: false } },
      { new: true }
    );

    if (!bank) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Bank account not found',
        errorCode: 'BANK_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Bank account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const setPrimaryBank = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank ID',
        errorCode: 'INVALID_ID',
      });
    }

    await Bank.updateMany(
      { userId: req.user.id, isDeleted: false },
      { $set: { isPrimary: false } }
    );

    const bank = await Bank.findOneAndUpdate(
      { _id: id, userId: req.user.id, isDeleted: false },
      { $set: { isPrimary: true } },
      { new: true }
    ).lean();

    if (!bank) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Bank account not found',
        errorCode: 'BANK_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Primary bank account set successfully',
      data: bank,
    });
  } catch (error) {
    next(error);
  }
};

const uploadBankStatement = async (req, res, next) => {
  try {
    const { pdfBase64, password } = req.body;
    console.log( 'password', password);
    if (!pdfBase64) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Missing pdfBase64 in request body',
        errorCode: 'NO_PDF_DATA',
      });
    }

    const buffer = Buffer.from(pdfBase64, 'base64');

    let parsed;

    if (password && typeof password === 'string' && password.trim().length > 0) {
      const pdfExtract = new PDFExtract();

      const text = await new Promise((resolve, reject) => {
        pdfExtract.extractBuffer(
          buffer,
          { password: password.trim() },
          (err, data) => {
            if (err) {
              return reject(err);
            }

            const allText = data.pages
              .map((page) =>
                page.content
                  .map((item) => item.str || '')
                  .join(' ')
              )
              .join('\n\n');

            resolve(allText);
          },
        );
      });

      parsed = await extractBankStatementFromText(text);
      console.log(parsed);
      console.log(text);
    } else {
      parsed = await extractBankStatementFromPdf(buffer);
    }

    const {
      account_number: accountNumber,
      account_name: accountName,
      bank_name: bankName,
      branch,
      currency = 'INR',
      closing_balance: closingBalance = 0,
      transactions = [],
    } = parsed || {};

    const bank = await Bank.create({
      userId: req.user.id,
      name: bankName || 'Primary Account',
      accountHolderName: accountName || 'Account Holder',
      accountNumber: accountNumber || null,
      branch: branch || null,
      balance: typeof closingBalance === 'number' ? closingBalance : 0,
      currency: currency || 'INR',
    });

    const txDocs = Array.isArray(transactions)
      ? transactions
          .filter((tx) => tx)
          .map((tx) => {
            const debit = Number(tx.debit) || 0;
            const credit = Number(tx.credit) || 0;
            const amount = debit > 0 ? debit : credit;
            const type = debit > 0 ? 'debit' : 'credit';

            return {
              userId: req.user.id,
              bankId: bank._id,
              amount,
              type,
              transactionDate: tx.date ? new Date(tx.date) : new Date(),
              currency: currency || 'INR',
              accountIn: accountName || bankName || 'Account',
              notes: tx.description || '',
            };
          })
          .filter((doc) => doc.amount > 0)
      : [];

    let createdTransactions = [];
    if (txDocs.length > 0) {
      createdTransactions = await Transaction.insertMany(txDocs);
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Bank statement processed successfully',
      data: {
        bank,
        transactionsCreated: createdTransactions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadBankStatementFromS3 = async (req, res, next) => {
  try {
    const { key, password } = req.body;
    console.log( key, 'password', password);
    if (!key) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Missing key in request body',
        errorCode: 'NO_S3_KEY',
      });
    }

    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Missing password in request body',
        errorCode: 'NO_PASSWORD',
      });
    }

    const buffer = await getFileBuffer(key);
    console.log( 'buffer', buffer);
    let parsed;

    if (password && typeof password === 'string' && password.trim().length > 0) {
      const pdfExtract = new PDFExtract();
      console.log( 'pdfExtract', pdfExtract);
      const text = await new Promise((resolve, reject) => {
        pdfExtract.extractBuffer(
          buffer,
          { password: password.trim() },
          (err, data) => {
            if (err) {
              return reject(err);
            }

            const allText = data.pages
              .map((page) =>
                page.content
                  .map((item) => item.str || '')
                  .join(' ')
              )
              .join('\n\n');

            resolve(allText);
          },
        );
      });

      parsed = await extractBankStatementFromText(text);
    } else {
      parsed = await extractBankStatementFromPdf(buffer);
    }

    const {
      account_number: accountNumber,
      account_name: accountName,
      bank_name: bankName,
      branch,
      currency = 'INR',
      closing_balance: closingBalance = 0,
      transactions = [],
    } = parsed || {};

    console.log( 'parsed', parsed);
    console.log( 'accountNumber', accountNumber);
    console.log( 'accountName', accountName);
    console.log( 'bankName', bankName);
    console.log( 'branch', branch);
    console.log( 'currency', currency);
    console.log( 'closingBalance', closingBalance);
    console.log( 'transactions', transactions);
    const bank = await Bank.create({
      userId: req.user.id,
      name: bankName || 'Primary Account',
      accountHolderName: accountName || 'Account Holder',
      accountNumber: accountNumber || null,
      branch: branch || null,
      balance: typeof closingBalance === 'number' ? closingBalance : 0,
      currency: currency || 'INR',
    });

    const txDocs = Array.isArray(transactions)
      ? transactions
          .filter((tx) => tx)
          .map((tx) => {
            const debit = Number(tx.debit) || 0;
            const credit = Number(tx.credit) || 0;
            const amount = debit > 0 ? debit : credit;
            const type = debit > 0 ? 'debit' : 'credit';

            return {
              userId: req.user.id,
              bankId: bank._id,
              amount,
              type,
              transactionDate: tx.date ? new Date(tx.date) : new Date(),
              currency: currency || 'INR',
              accountIn: accountName || bankName || 'Account',
              notes: tx.description || '',
            };
          })
          .filter((doc) => doc.amount > 0)
      : [];

    let createdTransactions = [];
    if (txDocs.length > 0) {
      createdTransactions = await Transaction.insertMany(txDocs);
    }

    try {
      await deleteObject(key);
    } catch (cleanupError) {
      // eslint-disable-next-line no-console
      console.warn('Failed to delete S3 object', cleanupError);
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Bank statement processed successfully',
      data: {
        bank,
        transactionsCreated: createdTransactions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBank,
  getBanks,
  getBankById,
  updateBank,
  deleteBank,
  setPrimaryBank,
  uploadBankStatement,
  uploadBankStatementFromS3,
};
