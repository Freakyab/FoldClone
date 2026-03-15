import { createSlice } from '@reduxjs/toolkit';

import type { WidgetConfig } from '@/components/models/home-widget';
import type { RootState } from '@/store';

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'others', title: 'Others', isVisible: true, order: 0 },
  { id: 'netWorth', title: 'Net worth', isVisible: true, order: 1 },
  { id: 'uploadPdf', title: 'Upload PDF', isVisible: true, order: 2 },
  { id: 'bankAccount', title: 'Bank account', isVisible: true, order: 3 },
  { id: 'creditCards', title: 'Credit cards', isVisible: true, order: 4 },
  { id: 'cashFlow', title: 'Cash Flow', isVisible: true, order: 5 },
  {
    id: 'spendingSummary',
    title: 'Spending summary',
    isVisible: true,
    order: 6,
  },
];

export interface WidgetsState {
  widgets: WidgetConfig[];
}

const initialState: WidgetsState = {
  widgets: DEFAULT_WIDGETS,
};

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    setWidgets: (state, action: { payload: WidgetConfig[] }) => {
      state.widgets = action.payload.map((w, idx) => ({ ...w, order: idx }));
    },
    resetWidgets: () => initialState,
  },
});

export const { setWidgets, resetWidgets } = widgetsSlice.actions;

export const selectWidgets = (state: RootState) => state.widgets.widgets;

export default widgetsSlice.reducer;
