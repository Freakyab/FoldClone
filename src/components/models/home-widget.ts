export interface WidgetConfig {
  id: 'others' | 'netWorth' | 'bankAccount' | 'creditCards' | 'spendingSummary';
  title: string;
  isVisible: boolean;
  order: number;
}

