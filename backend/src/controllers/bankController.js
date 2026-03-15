const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const Bank = require('../models/Bank');
const StatementJob = require('../models/StatementJob');
const StatementPassword = require('../models/StatementPassword');
const { decrypt: decryptStatementPassword } = require('../utils/statementPasswordCrypto');

const createBank = async (req, res, next) => {
  try {
    const { isPrimary } = req.body;
    const ownedBankFilter = Bank.buildOwnedBankFilter(req.user.id);

    if (isPrimary) {
      await Bank.updateMany(
        ownedBankFilter,
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
    const linkedBankFilter = Bank.buildLinkedBankFilter(req.user.id);
    const banks = await Bank.find(linkedBankFilter)
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
    const ownedBankFilter = Bank.buildOwnedBankFilter(req.user.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank ID',
        errorCode: 'INVALID_ID',
      });
    }

    const bank = await Bank.findOne({
      ...ownedBankFilter,
      _id: id,
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
    const ownedBankFilter = Bank.buildOwnedBankFilter(req.user.id);

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
        { ...ownedBankFilter, _id: { $ne: id } },
        { $set: { isPrimary: false } }
      );
    }

    const bank = await Bank.findOneAndUpdate(
      { ...ownedBankFilter, _id: id },
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
    const ownedBankFilter = Bank.buildOwnedBankFilter(req.user.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank ID',
        errorCode: 'INVALID_ID',
      });
    }

    const bank = await Bank.findOneAndUpdate(
      { ...ownedBankFilter, _id: id },
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
    const ownedBankFilter = Bank.buildOwnedBankFilter(req.user.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank ID',
        errorCode: 'INVALID_ID',
      });
    }

    await Bank.updateMany(
      ownedBankFilter,
      { $set: { isPrimary: false } }
    );

    const bank = await Bank.findOneAndUpdate(
      { ...ownedBankFilter, _id: id },
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
    if (!pdfBase64) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Missing pdfBase64 in request body',
        errorCode: 'NO_PDF_DATA',
      });
    }

    const pdfSizeBytes = Buffer.byteLength(Buffer.from(pdfBase64, 'base64'));
    const job = await StatementJob.create({
      userId: req.user.id,
      type: 'base64',
      payload: { pdfBase64, password: password || null },
      status: 'pending',
      pdfSizeBytes,
    });

    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: 'Statement upload queued. Poll GET /api/jobs/:jobId for status.',
      data: { jobId: job._id.toString() },
    });
  } catch (error) {
    next(error);
  }
};

const uploadBankStatementFromS3 = async (req, res, next) => {
  try {
    const { key, password } = req.body;
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

    const job = await StatementJob.create({
      userId: req.user.id,
      type: 's3',
      payload: { key, password },
      status: 'pending',
    });

    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: 'Statement upload queued. Poll GET /api/jobs/:jobId for status.',
      data: { jobId: job._id.toString() },
    });
  } catch (error) {
    next(error);
  }
};

const getSavedStatementPasswords = async (req, res, next) => {
  try {
    const rows = await StatementPassword.find({ userId: req.user.id })
      .sort({ lastUsedAt: -1 })
      .limit(20)
      .select('bankName accountNumber password lastUsedAt _id')
      .lean();

    const data = [];
    for (const row of rows) {
      const password = decryptStatementPassword(row.password);
      if (password == null) continue;
      data.push({
        _id: row._id,
        bankName: row.bankName,
        accountNumber: row.accountNumber,
        password,
        lastUsedAt: row.lastUsedAt,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data,
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
  getSavedStatementPasswords,
};
