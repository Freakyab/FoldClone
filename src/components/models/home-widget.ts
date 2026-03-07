export interface WidgetConfig {
  id: 'others' | 'netWorth' | 'bankAccount' | 'creditCards' | 'spendingSummary' | 'uploadPdf';
  title: string;
  isVisible: boolean;
  order: number;
}

