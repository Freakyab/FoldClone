import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@/lib/apibase';
import type { RootState } from '@/store';

import { logoutUser } from './userSlice';

export type HomeAsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type CashFlowTone = 'positive' | 'negative' | 'neutral';

export interface CashFlowDashboardEntry {
  label: string;
  amount: number;
  tone: CashFlowTone;
}

export interface CashFlowDashboardData {
  monthLabel: string;
  entries: CashFlowDashboardEntry[];
}

export interface NetWorthDashboardData {
  total: number;
  balance: number;
  debt: number;
  monthChange: number;
  yearChange: number;
  chartValues: number[];
  chartLabel: string;
}

export interface BankAccountSummary {
  id: string;
  bankName: string;
  maskedAccountNumber: string;
  currentBalance: number;
  currency: string;
  iconKey: string;
}

export interface SelectedBankAccount extends BankAccountSummary {
  lastDigits: string | null;
  chartValues: number[];
  startLabel: string;
  endLabel: string;
  lastTransactionDate: string | null;
}

export interface BankAccountsDashboardData {
  totalLinked: number;
  totalBalance: number;
  accounts: BankAccountSummary[];
  selectedAccount: SelectedBankAccount | null;
}

export interface SpendingSummaryItem {
  label: string;
  amount: number;
  percent: number;
}

export interface SpendingSummaryDashboardData {
  monthLabel: string;
  items: SpendingSummaryItem[];
}

export interface HomeDashboardData {
  generatedAt: string;
  cashFlow: CashFlowDashboardData;
  netWorth: NetWorthDashboardData;
  bankAccounts: BankAccountsDashboardData;
  spendingSummary: SpendingSummaryDashboardData;
}

export interface HomeState {
  data: HomeDashboardData | null;
  status: HomeAsyncStatus;
  error: string | null;
}

const initialState: HomeState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchHomeDashboard = createAsyncThunk<
  HomeDashboardData,
  void,
  { state: RootState; rejectValue: string }
>('home/fetchDashboard', async (_, { getState, rejectWithValue }) => {
  const token = getState().user.token;
  if (!token) return rejectWithValue('User not authenticated');

  try {
    const response = await fetch(`${API_BASE_URL}/api/home/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const json = (await response.json()) as {
      success: boolean;
      data?: HomeDashboardData;
      message?: string;
    };

    if (!response.ok || !json.success || !json.data) {
      return rejectWithValue(json.message ?? 'Failed to fetch home dashboard');
    }

    return json.data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch home dashboard';
    return rejectWithValue(message);
  }
});

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeDashboard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHomeDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchHomeDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch home dashboard';
      })
      .addCase(logoutUser, () => initialState);
  },
});

export const { clearHomeDashboard } = homeSlice.actions;

export const selectHomeDashboardState = (state: RootState) => state.home;
export const selectHomeDashboard = (state: RootState) => state.home.data;

export default homeSlice.reducer;
