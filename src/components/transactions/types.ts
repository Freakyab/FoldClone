import type { ReactNode } from 'react';

export type TransactionType = 'credit' | 'debit';

export type TransactionTypeFilter = 'incoming' | 'outgoing' | 'both';

export interface FilterState {
  /** accountId values to include; empty = all */
  sourceAccountIds: string[];
  transactionType: TransactionTypeFilter;
  /** tag keys to include; empty = all */
  tags: string[];
  /** inclusive start date */
  dateFrom: Date | null;
  /** inclusive end date */
  dateTo: Date | null;
  onlyBookmarked: boolean;
  onlyCash: boolean;
  onlyWithNotes: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: Date;
  merchant: string;
  accountId: string;
  category?: string;
  /** tag keys from tag-data (e.g. food.eating_out); legacy SELF_TRANSFER etc. may appear in list */
  tags: string[];
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

