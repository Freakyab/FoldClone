const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const Transaction = require('../models/Transaction');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    console.log( 'getTransactions', req.query);
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      type,
      category,
      status,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      tags,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const matchStage = {
      userId: new mongoose.Types.ObjectId(req.user.id),
    };

    if (type) matchStage.type = type;
    if (category) matchStage.category = category;
    if (status) matchStage.status = status;

    if (startDate || endDate) {
      matchStage.transactionDate = {};
      if (startDate) matchStage.transactionDate.$gte = new Date(startDate);
      if (endDate) matchStage.transactionDate.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      matchStage.amount = {};
      if (minAmount) matchStage.amount.$gte = parseFloat(minAmount);
      if (maxAmount) matchStage.amount.$lte = parseFloat(maxAmount);
    }

    if (tags) {
      const tagKeyArray = tags.split(',').map((k) => k.trim()).filter(Boolean);
      if (tagKeyArray.length > 0) {
        matchStage.tagKeys = { $in: tagKeyArray };
      }
    }

    const [result] = await Transaction.aggregate([
      { $match: matchStage },
      {
        $facet: {
          data: [
            { $sort: { transactionDate: -1 } },
            { $skip: skip },
            { $limit: limitNum },
            { $project: { __v: 0 } },
          ],
          totalCount: [{ $count: 'count' }],
          summary: [
            {
              $group: {
                _id: '$type',
                total: { $sum: '$amount' },
              },
            },
          ],
        },
      },
    ]);

    const total = result.totalCount[0]?.count || 0;
    const summaryMap = result.summary.reduce((acc, s) => {
      acc[s._id] = s.total;
      return acc;
    }, {});

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      summary: {
        totalCredit: summaryMap.credit || 0,
        totalDebit: summaryMap.debit || 0,
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log( 'id', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid transaction ID',
        errorCode: 'INVALID_ID',
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.id,
    })
      .populate('bankId', 'name accountNumber')
      .lean();

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Transaction not found',
        errorCode: 'TRANSACTION_NOT_FOUND',
      });
    }

    console.log( 'transaction', transaction);
    res.status(StatusCodes.OK).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid transaction ID',
        errorCode: 'INVALID_ID',
      });
    }

    const allowedFields = [
      'amount', 'type', 'category', 'tagKeys', 'description',
      'note', 'paymentMode', 'transactionDate', 'status',
      'currency', 'referenceId', 'bankId',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Transaction not found',
        errorCode: 'TRANSACTION_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid transaction ID',
        errorCode: 'INVALID_ID',
      });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Transaction not found',
        errorCode: 'TRANSACTION_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionSummary = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;

    const matchStage = {
      userId: new mongoose.Types.ObjectId(req.user.id),
    };

    if (startDate || endDate) {
      matchStage.transactionDate = {};
      if (startDate) matchStage.transactionDate.$gte = new Date(startDate);
      if (endDate) matchStage.transactionDate.$lte = new Date(endDate);
    }

    const groupId =
      groupBy === 'day'
        ? { year: { $year: '$transactionDate' }, month: { $month: '$transactionDate' }, day: { $dayOfMonth: '$transactionDate' } }
        : groupBy === 'week'
        ? { year: { $year: '$transactionDate' }, week: { $week: '$transactionDate' } }
        : { year: { $year: '$transactionDate' }, month: { $month: '$transactionDate' } };

    const summary = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { period: groupId, type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.period.year': -1, '_id.period.month': -1 } },
    ]);

    const categoryBreakdown = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        periodSummary: summary,
        categoryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};
