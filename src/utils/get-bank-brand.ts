import type { AppIconName } from '@/components/ui/app-icon';

export interface BankBrand {
  backgroundColor: string;
  accentColor: string;
  label: string;
  iconName: AppIconName;
}

const BANK_BRANDS: { keywords: string[]; brand: BankBrand }[] = [
  {
    keywords: ['icici'],
    brand: {
      label: 'I',
      iconName: 'building-2',
      backgroundColor: '#F97316',
      accentColor: '#FED7AA',
    },
  },
  {
    keywords: ['hdfc'],
    brand: {
      label: 'H',
      iconName: 'building-2',
      backgroundColor: '#2563EB',
      accentColor: '#BFDBFE',
    },
  },
  {
    keywords: ['state bank', 'sbi'],
    brand: {
      label: 'S',
      iconName: 'building-2',
      backgroundColor: '#1D4ED8',
      accentColor: '#BFDBFE',
    },
  },
  {
    keywords: ['axis'],
    brand: {
      label: 'A',
      iconName: 'building-2',
      backgroundColor: '#7C3AED',
      accentColor: '#DDD6FE',
    },
  },
  {
    keywords: ['kotak'],
    brand: {
      label: 'K',
      iconName: 'building-2',
      backgroundColor: '#DC2626',
      accentColor: '#FECACA',
    },
  },
  {
    keywords: ['yes bank', 'yes'],
    brand: {
      label: 'Y',
      iconName: 'building-2',
      backgroundColor: '#0EA5E9',
      accentColor: '#BAE6FD',
    },
  },
  {
    keywords: ['idfc'],
    brand: {
      label: 'I',
      iconName: 'building-2',
      backgroundColor: '#7C2D12',
      accentColor: '#FCD9BD',
    },
  },
];

const DEFAULT_BANK_BRAND: BankBrand = {
  label: 'B',
  iconName: 'building-2',
  backgroundColor: '#475467',
  accentColor: '#D0D5DD',
};

export function getBankBrand(bankName?: string | null): BankBrand {
  if (!bankName) return DEFAULT_BANK_BRAND;

  const normalizedName = bankName.toLowerCase();
  const matchedBrand = BANK_BRANDS.find(({ keywords }) =>
    keywords.some((keyword) => normalizedName.includes(keyword)),
  );

  if (matchedBrand) return matchedBrand.brand;

  return {
    ...DEFAULT_BANK_BRAND,
    label: bankName.charAt(0).toUpperCase() || DEFAULT_BANK_BRAND.label,
  };
}
