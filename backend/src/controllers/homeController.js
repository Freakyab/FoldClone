const { StatusCodes } = require('http-status-codes');

const Bank = require('../models/Bank');
const TagCategory = require('../models/TagCategory');
const Transaction = require('../models/Transaction');

const INVESTMENT_KEYWORDS = [
  'invest',
  'investment',
  'mutual',
  'sip',
  'stock',
  'equity',
  'portfolio',
  'fund',
  'fd',
  'ppf',
  'epf',
];

function roundAmount(value) {
  return Math.round(value * 100) / 100;
}

function startOfUtcDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function endOfUtcDay(date) {
  const nextDay = addUtcDays(startOfUtcDay(date), 1);
  return new Date(nextDay.getTime() - 1);
}

function addUtcDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function startOfUtcMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function startOfUtcYear(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function formatShortDateLabel(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }).formatToParts(date);

  const month = parts.find((part) => part.type === 'month')?.value?.toUpperCase() || 'N/A';
  const day = parts.find((part) => part.type === 'day')?.value || '00';
  return `${month}. ${day}`;
}

function sumAmounts(items, selector) {
  return roundAmount(items.reduce((total, item) => total + selector(item), 0));
}

function getSignedAmount(transaction) {
  if (transaction.type === 'credit') return transaction.amount;
  if (transaction.type === 'debit') return transaction.amount * -1;
  return 0;
}

function bucketValues(values, maxPoints) {
  if (values.length === 0) return [0];
  if (values.length <= maxPoints) return values.map(roundAmount);

  const bucketSize = values.length / maxPoints;
  const buckets = [];

  for (let index = 0; index < maxPoints; index += 1) {
    const startIndex = Math.floor(index * bucketSize);
    const rawEndIndex =
      index === maxPoints - 1
        ? values.length
        : Math.max(startIndex + 1, Math.floor((index + 1) * bucketSize));
    const slice = values.slice(startIndex, rawEndIndex);
    const average = slice.reduce((sum, value) => sum + value, 0) / slice.length;
    buckets.push(roundAmount(average));
  }

  return buckets;
}

function createHistoricalSeries({ currentValue, transactions, startDate, endDate }) {
  if (startDate > endDate) return [roundAmount(currentValue)];

  const normalizedTransactions = transactions
    .map((transaction) => ({
      date: new Date(transaction.transactionDate),
      signedAmount: getSignedAmount(transaction),
    }))
    .filter((transaction) => transaction.signedAmount !== 0);

  const points = [];

  for (
    let currentDate = startOfUtcDay(startDate);
    currentDate <= startOfUtcDay(endDate);
    currentDate = addUtcDays(currentDate, 1)
  ) {
    const dayEnd = endOfUtcDay(currentDate);
    const futureDelta = normalizedTransactions.reduce((sum, transaction) => {
      if (transaction.date > dayEnd) return sum + transaction.signedAmount;
      return sum;
    }, 0);
    points.push(roundAmount(currentValue - futureDelta));
  }

  return points.length > 0 ? points : [roundAmount(currentValue)];
}

function humanizeTagKey(tagKey) {
  if (!tagKey) return 'Others';
  const normalized = tagKey.split('.').pop() || tagKey;
  return normalized
    .split(/[_-]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

function buildTagLabelMap(tagCategories) {
  const tagLabels = new Map();

  tagCategories.forEach((category) => {
    tagLabels.set(category.slug, category.label);
    category.subItems.forEach((subItem) => {
      tagLabels.set(subItem.tagKey, subItem.label);
    });
  });

  return tagLabels;
}

function getTagLabel(tagKey, tagLabels) {
  if (!tagKey) return 'Others';
  return (
    tagLabels.get(tagKey) ||
    tagLabels.get(tagKey.split('.')[0]) ||
    humanizeTagKey(tagKey)
  );
}

function isInvestmentTransaction(transaction, tagLabels) {
  const primaryTag = Array.isArray(transaction.tagKeys) ? transaction.tagKeys[0] : null;
  const label = getTagLabel(primaryTag, tagLabels);
  const haystack = `${primaryTag || ''} ${label}`.toLowerCase();
  return INVESTMENT_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

function maskAccountNumber(accountNumber) {
  if (!accountNumber) return 'No account number';
  const trimmed = accountNumber.replace(/\s+/g, '');
  const lastDigits = trimmed.slice(-4);
  if (!lastDigits) return '****';
  return `****${lastDigits}`;
}

function getLastDigits(accountNumber) {
  if (!accountNumber) return null;
  const trimmed = accountNumber.replace(/\s+/g, '');
  return trimmed.slice(-4) || null;
}

async function getHomeDashboard(req, res, next) {
  try {
    const now = new Date();
    const monthStart = startOfUtcMonth(now);
    const yearStart = startOfUtcYear(now);
    const netWorthSeriesStart = addUtcDays(startOfUtcDay(now), -179);
    const dataWindowStart =
      yearStart < netWorthSeriesStart ? yearStart : netWorthSeriesStart;
    const linkedBankFilter = Bank.buildLinkedBankFilter(req.user.id);

    const [banks, transactions, tagCategories] = await Promise.all([
      Bank.find(linkedBankFilter)
        .sort({ isPrimary: -1, createdAt: -1 })
        .lean(),
      Transaction.find({
        userId: req.user.id,
        transactionDate: { $gte: dataWindowStart, $lte: now },
      })
        .select('amount type tagKeys transactionDate bankId excludedFromCashFlow')
        .sort({ transactionDate: 1 })
        .lean(),
      TagCategory.find({ isActive: true }).select('slug label subItems').lean(),
    ]);

    const tagLabels = buildTagLabelMap(tagCategories);
    const currentMonthTransactions = transactions.filter(
      (transaction) => new Date(transaction.transactionDate) >= monthStart,
    );
    const yearToDateTransactions = transactions.filter(
      (transaction) => new Date(transaction.transactionDate) >= yearStart,
    );

    const assetBanks = banks.filter((bank) => bank.accountType !== 'credit_card');
    const debtBanks = banks.filter((bank) => bank.accountType === 'credit_card');
    const selectedBank = assetBanks[0] || banks[0] || null;

    const currentAssets = sumAmounts(assetBanks, (bank) => bank.balance || 0);
    const currentDebt = sumAmounts(debtBanks, (bank) => bank.balance || 0);
    const currentNetWorth = roundAmount(currentAssets - currentDebt);

    const monthCredits = currentMonthTransactions.filter(
      (transaction) =>
        transaction.type === 'credit' && transaction.excludedFromCashFlow !== true,
    );
    const monthDebits = currentMonthTransactions.filter(
      (transaction) =>
        transaction.type === 'debit' && transaction.excludedFromCashFlow !== true,
    );
    const investedTransactions = monthDebits.filter((transaction) =>
      isInvestmentTransaction(transaction, tagLabels),
    );
    const investedIds = new Set(investedTransactions.map((transaction) => String(transaction._id)));
    const outgoingTransactions = monthDebits.filter(
      (transaction) => !investedIds.has(String(transaction._id)),
    );

    const incomingAmount = sumAmounts(monthCredits, (transaction) => transaction.amount);
    const outgoingAmount = sumAmounts(outgoingTransactions, (transaction) => transaction.amount);
    const investedAmount = sumAmounts(
      investedTransactions,
      (transaction) => transaction.amount,
    );
    const leftAmount = roundAmount(
      incomingAmount - outgoingAmount - investedAmount,
    );

    const spendingBuckets = currentMonthTransactions
      .filter((transaction) => transaction.type === 'debit')
      .reduce((accumulator, transaction) => {
        const primaryTag = Array.isArray(transaction.tagKeys)
          ? transaction.tagKeys[0]
          : null;
        const label = getTagLabel(primaryTag, tagLabels);
        accumulator[label] = (accumulator[label] || 0) + transaction.amount;
        return accumulator;
      }, {});

    const totalMonthlySpending = Object.values(spendingBuckets).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    const spendingItems = Object.entries(spendingBuckets)
      .map(([label, amount]) => ({
        label,
        amount: roundAmount(amount),
        percent:
          totalMonthlySpending > 0
            ? Math.round((amount / totalMonthlySpending) * 100)
            : 0,
      }))
      .sort((first, second) => second.amount - first.amount)
      .slice(0, 5);

    const netWorthSeries = createHistoricalSeries({
      currentValue: currentNetWorth,
      transactions,
      startDate: netWorthSeriesStart,
      endDate: now,
    });

    const monthChange = sumAmounts(
      yearToDateTransactions.filter((transaction) => new Date(transaction.transactionDate) >= monthStart),
      (transaction) => getSignedAmount(transaction),
    );
    const yearChange = sumAmounts(
      yearToDateTransactions,
      (transaction) => getSignedAmount(transaction),
    );

    let selectedAccount = null;

    if (selectedBank) {
      const selectedTransactions = await Transaction.find({
        userId: req.user.id,
        bankId: selectedBank._id,
        transactionDate: { $lte: now },
      })
        .select('amount type transactionDate')
        .sort({ transactionDate: 1 })
        .lean();

      const selectedStartDate =
        selectedTransactions.length > 0
          ? startOfUtcDay(new Date(selectedTransactions[0].transactionDate))
          : addUtcDays(startOfUtcDay(now), -29);
      const selectedSeries = createHistoricalSeries({
        currentValue: selectedBank.balance || 0,
        transactions: selectedTransactions,
        startDate: selectedStartDate,
        endDate: now,
      });
      const lastTransactionDate =
        selectedTransactions.length > 0
          ? new Date(selectedTransactions[selectedTransactions.length - 1].transactionDate)
          : null;

      selectedAccount = {
        id: selectedBank._id.toString(),
        bankName: selectedBank.name,
        iconKey: selectedBank.name,
        maskedAccountNumber: maskAccountNumber(selectedBank.accountNumber),
        lastDigits: getLastDigits(selectedBank.accountNumber),
        currentBalance: roundAmount(selectedBank.balance || 0),
        currency: selectedBank.currency || 'INR',
        chartValues: bucketValues(selectedSeries, 15),
        startLabel: formatShortDateLabel(selectedStartDate),
        endLabel: formatShortDateLabel(now),
        lastTransactionDate: lastTransactionDate ? lastTransactionDate.toISOString() : null,
      };
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        generatedAt: now.toISOString(),
        cashFlow: {
          monthLabel: formatMonthLabel(now),
          entries: [
            { label: 'Incoming', amount: incomingAmount, tone: 'positive' },
            { label: 'Outgoing', amount: outgoingAmount, tone: 'negative' },
            { label: 'Invested', amount: investedAmount, tone: 'neutral' },
            { label: 'Left', amount: leftAmount, tone: 'neutral' },
          ],
        },
        netWorth: {
          total: currentNetWorth,
          balance: currentAssets,
          debt: currentDebt,
          monthChange,
          yearChange,
          chartValues: netWorthSeries,
          chartLabel: 'Last 180 days',
        },
        bankAccounts: {
          totalLinked: banks.length,
          totalBalance: currentAssets,
          accounts: banks.map((bank) => ({
            id: bank._id.toString(),
            bankName: bank.name,
            maskedAccountNumber: maskAccountNumber(bank.accountNumber),
            currentBalance: roundAmount(bank.balance || 0),
            currency: bank.currency || 'INR',
            iconKey: bank.name,
          })),
          selectedAccount,
        },
        spendingSummary: {
          monthLabel: formatMonthLabel(now),
          items: spendingItems,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getHomeDashboard };
