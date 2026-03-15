import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

import { API_BASE_URL } from '@/lib/apibase';
import { logoutUser } from './userSlice';

/** Backend Transaction model shape (from Transaction.js) */
export type TransactionType = 'credit' | 'debit' | 'transfer';

export interface BankRef {
  _id: string;
  name?: string;
  accountNumber?: string;
}

export interface TransactionRecord {
  _id: string;
  userId: string;
  bankId: string | null;
  amount: number;
  type: TransactionType;
  tagKeys: string[];
  notes?: string;
  transactionDate: string;
  currency: string;
  accountIn: string;
  excludedFromCashFlow: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionState {
  items: TransactionRecord[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

const initialState: TransactionState = {
  items: [],
  status: 'idle',
  error: null,
  pagination: null,
};

export const fetchTransactions = createAsyncThunk<
  { data: TransactionRecord[]; pagination: TransactionState['pagination'] },
  void,
  { state: RootState; rejectValue: string }
>(
  'transactions/fetchTransactions',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().user.token;
    if (!token) {
      return rejectWithValue('User not authenticated');
    }

    try {
      console.log( 'API_BASE_URL', API_BASE_URL, 'token', token);
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = (await response.json()) as {
        success: boolean;
        data?: TransactionRecord[];
        pagination?: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
        message?: string;
      };

      if (!response.ok || !json.success) {
        return rejectWithValue(json.message ?? 'Failed to fetch transactions');
      }

      const data = json.data ?? [];
      const pagination = json.pagination
        ? {
            page: json.pagination.page,
            limit: json.pagination.limit,
            total: json.pagination.total,
            totalPages: json.pagination.totalPages,
          }
        : null;

      return { data, pagination };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions';
      return rejectWithValue(message);
    }
  },
);

export const updateTransactionTags = createAsyncThunk<
  { id: string; tagKeys: string[] },
  { id: string; tagKeys: string[] },
  { state: RootState; rejectValue: string }
>(
  'transactions/updateTransactionTags',
  async ({ id, tagKeys }, { getState, rejectWithValue }) => {
    const token = getState().user.token;
    if (!token) {
      return rejectWithValue('User not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tagKeys }),
      });

      const json = (await response.json()) as {
        success: boolean;
        data?: TransactionRecord;
        message?: string;
      };

      if (!response.ok || !json.success) {
        return rejectWithValue(json.message ?? 'Failed to update transaction tags');
      }

      return { id, tagKeys };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update transaction tags';
      return rejectWithValue(message);
    }
  },
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
      state.pagination = null;
    },
    setTransactionsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateTransactionTagKeysLocally: (
      state,
      action: PayloadAction<{ id: string; tagKeys: string[] }>,
    ) => {
      const idx = state.items.findIndex((i) => i._id === action.payload.id);
      if (idx !== -1) {
        state.items[idx].tagKeys = action.payload.tagKeys;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch transactions';
      })
      .addCase(updateTransactionTags.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload.id);
        if (idx !== -1) {
          state.items[idx].tagKeys = action.payload.tagKeys;
        }
      })
      .addCase(logoutUser, () => initialState);
  },
});

/** Map backend TransactionRecord to UI Transaction (e.g. for list/detail) */
export function mapTransactionRecordToUI(rec: TransactionRecord): {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  date: Date;
  merchant: string;
  accountId: string;
  category?: string;
  tags: string[];
  notes?: string;
  receiptUrl?: string;
  excludedFromCashFlow: boolean;
  createdAt: Date;
} {
  return {
    id: rec._id,
    amount: rec.amount,
    type: rec.type === 'transfer' ? 'debit' : rec.type,
    date: new Date(rec.transactionDate),
    merchant: rec.accountIn || 'Transaction',
    accountId: rec.accountIn || '—',
    notes: rec.notes,
    excludedFromCashFlow: rec.excludedFromCashFlow,
    createdAt: new Date(rec.createdAt),
    tags: Array.isArray(rec.tagKeys) ? rec.tagKeys : [],
  };
}

export const {
  clearTransactions,
  setTransactionsError,
  updateTransactionTagKeysLocally,
} = transactionSlice.actions;
export default transactionSlice.reducer;
