import type { ReactNode } from 'react';

export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: Date;
  merchant: string;
  accountId: string;
  category?: string;
  tag?: 'SELF_TRANSFER' | 'RETURN' | 'PAYMENT';
  notes?: string;
  receiptUrl?: string;
  excludedFromCashFlow: boolean;
  createdAt: Date;
}

export interface MonthSection {
  month: string;
  transactionCount: number;
  transactions: Transaction[];
}

export interface TransactionsState {
  selectedIds: string[];
  searchQuery: string;
  activeTab: 'all' | 'groups';
  monthSections: MonthSection[];
}

export interface TransactionsHeaderProps {
  onSelectPress: () => void;
  onAddPress: () => void;
  onBackPress?: () => void;
  rightAccessory?: ReactNode;
}

