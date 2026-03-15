import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { logoutUser } from './userSlice';

export type StatementJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface StatementJobResult {
  bank?: { _id: string; name?: string; accountNumber?: string; balance?: number };
  transactionsCreated?: number;
  transactionsSkippedDuplicate?: number;
}

export interface StatementJobState {
  activeJobId: string | null;
  status: StatementJobStatus | null;
  result: StatementJobResult | null;
  error: string | null;
  /** When the job was started (upload queued) for "expected time" display */
  startedAt: number | null;
}

const initialState: StatementJobState = {
  activeJobId: null,
  status: null,
  result: null,
  error: null,
  startedAt: null,
};

const statementJobSlice = createSlice({
  name: 'statementJob',
  initialState,
  reducers: {
    setActiveJob: (
      state,
      action: PayloadAction<{ jobId: string; status?: StatementJobStatus }>,
    ) => {
      state.activeJobId = action.payload.jobId;
      state.status = action.payload.status ?? 'pending';
      state.result = null;
      state.error = null;
      state.startedAt = Date.now();
    },
    updateJobStatus: (
      state,
      action: PayloadAction<{
        status: StatementJobStatus;
        result?: StatementJobResult | null;
        error?: string | null;
      }>,
    ) => {
      state.status = action.payload.status;
      if (action.payload.result !== undefined) state.result = action.payload.result;
      if (action.payload.error !== undefined) state.error = action.payload.error;
    },
    clearActiveJob: (state) => {
      state.activeJobId = null;
      state.status = null;
      state.result = null;
      state.error = null;
      state.startedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser, (state) => {
      state.activeJobId = null;
      state.status = null;
      state.result = null;
      state.error = null;
      state.startedAt = null;
    });
  },
});

export const { setActiveJob, updateJobStatus, clearActiveJob } = statementJobSlice.actions;

/** True if user has an in-flight statement job (no new uploads allowed). */
export function selectIsStatementJobActive(state: { statementJob: StatementJobState }): boolean {
  const { activeJobId, status } = state.statementJob;
  if (!activeJobId) return false;
  return status === 'pending' || status === 'processing';
}

export default statementJobSlice.reducer;
