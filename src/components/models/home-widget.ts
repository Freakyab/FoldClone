export interface WidgetConfig {
  id:
    | 'others'
    | 'netWorth'
    | 'bankAccount'
    | 'creditCards'
    | 'cashFlow'
    | 'spendingSummary'
    | 'uploadPdf';
  title: string;
  isVisible: boolean;
  order: number;
}

