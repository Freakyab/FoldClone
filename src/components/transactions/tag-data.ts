import type { ComponentType } from 'react';
import {
  PhoneIcon, RentIcon, WaterIcon, ElectricityIcon, GasIcon, InternetIcon, HouseInsuranceIcon,
  EatingOutIcon, TakeAwayIcon, TeaCoffeeIcon, FastFoodIcon, SnacksIcon, SwiggyIcon, ZomatoIcon,
  UberIcon, RapidoIcon, AutoIcon, CabIcon, TrainIcon, MetroIcon, BusIcon,
  ClothesIcon, FootwearIcon, ElectronicsIcon, FestivalIcon, VideoGamesIcon, BooksIcon,
  StaplesIcon, VegetablesIcon, FruitsIcon, MeatIcon, EggsIcon, BakeryIcon,
  EssentialsIcon, ToiletriesIcon, DecorIcon, CleaningIcon,
  MutualFundsIcon, StocksIcon, IPOIcon, PPFIcon, NPSIcon, FixedDepositIcon,
  ParentsIcon, SpouseIcon, MomIcon, DadIcon, PocketMoneyIcon,
  NetflixIcon, PrimeIcon, YoutubeIcon, SoftwareIcon, NewsIcon,
  EMIElectronicsIcon, HouseEMIIcon, VehicleEMIIcon, EducationEMIIcon,
  CreditCardIcon,
  HealthInsuranceIcon, CarInsuranceIcon, LifeInsuranceIcon,
  OthersIcon,
} from './tag-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export interface TagSubItem {
  id: string;
  label: string;
  Icon: ComponentType<IconProps>;
}

export interface TagCategory {
  id: string;
  label: string;
  description: string;
  Icon: ComponentType<IconProps>;
  subItems: TagSubItem[];
}

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'bill',
    label: 'Bill',
    description: 'Rent, Wi-fi, electricity and other bills',
    Icon: ElectricityIcon,
    subItems: [
      { id: 'bill.phone', label: 'Phone', Icon: PhoneIcon },
      { id: 'bill.rent', label: 'Rent', Icon: RentIcon },
      { id: 'bill.water', label: 'Water', Icon: WaterIcon },
      { id: 'bill.electricity', label: 'Electricity', Icon: ElectricityIcon },
      { id: 'bill.gas', label: 'Gas', Icon: GasIcon },
      { id: 'bill.internet', label: 'Internet', Icon: InternetIcon },
      { id: 'bill.house_insurance', label: 'House', Icon: HouseInsuranceIcon },
      { id: 'bill.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'food_drinks',
    label: 'Food & Drinks',
    description: 'Eating out, Swiggy, Zomato etc.',
    Icon: EatingOutIcon,
    subItems: [
      { id: 'food.eating_out', label: 'Eating out', Icon: EatingOutIcon },
      { id: 'food.take_away', label: 'Take Away', Icon: TakeAwayIcon },
      { id: 'food.tea_coffee', label: 'Tea & Coffee', Icon: TeaCoffeeIcon },
      { id: 'food.fast_food', label: 'Fast Food', Icon: FastFoodIcon },
      { id: 'food.snacks', label: 'Snacks', Icon: SnacksIcon },
      { id: 'food.swiggy', label: 'Swiggy', Icon: SwiggyIcon },
      { id: 'food.zomato', label: 'Zomato', Icon: ZomatoIcon },
      { id: 'food.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    description: 'Uber, Ola and other modes of transport',
    Icon: CabIcon,
    subItems: [
      { id: 'transport.uber', label: 'Uber', Icon: UberIcon },
      { id: 'transport.rapido', label: 'Rapido', Icon: RapidoIcon },
      { id: 'transport.auto', label: 'Auto', Icon: AutoIcon },
      { id: 'transport.cab', label: 'Cab', Icon: CabIcon },
      { id: 'transport.train', label: 'Train', Icon: TrainIcon },
      { id: 'transport.metro', label: 'Metro', Icon: MetroIcon },
      { id: 'transport.bus', label: 'Bus', Icon: BusIcon },
      { id: 'transport.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    description: 'Clothes, shoes, furniture etc.',
    Icon: ClothesIcon,
    subItems: [
      { id: 'shopping.clothes', label: 'Clothes', Icon: ClothesIcon },
      { id: 'shopping.footwear', label: 'Footwear', Icon: FootwearIcon },
      { id: 'shopping.electronics', label: 'Electronics', Icon: ElectronicsIcon },
      { id: 'shopping.festival', label: 'Festival', Icon: FestivalIcon },
      { id: 'shopping.video_games', label: 'Video games', Icon: VideoGamesIcon },
      { id: 'shopping.books', label: 'Books', Icon: BooksIcon },
      { id: 'shopping.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'groceries',
    label: 'Groceries',
    description: 'Kitchen and other household supplies',
    Icon: StaplesIcon,
    subItems: [
      { id: 'grocery.staples', label: 'Staples', Icon: StaplesIcon },
      { id: 'grocery.vegetables', label: 'Vegetables', Icon: VegetablesIcon },
      { id: 'grocery.fruits', label: 'Fruits', Icon: FruitsIcon },
      { id: 'grocery.meat', label: 'Meat', Icon: MeatIcon },
      { id: 'grocery.eggs', label: 'Eggs', Icon: EggsIcon },
      { id: 'grocery.bakery', label: 'Bakery', Icon: BakeryIcon },
      { id: 'grocery.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'home',
    label: 'Home',
    description: 'Household related expenses',
    Icon: EssentialsIcon,
    subItems: [
      { id: 'home.essentials', label: 'Essentials', Icon: EssentialsIcon },
      { id: 'home.toiletries', label: 'Toiletries', Icon: ToiletriesIcon },
      { id: 'home.decor', label: 'Decor', Icon: DecorIcon },
      { id: 'home.cleaning', label: 'Cleaning', Icon: CleaningIcon },
      { id: 'home.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'subscription',
    label: 'Subscription',
    description: 'Recurring payment to online services',
    Icon: NetflixIcon,
    subItems: [
      { id: 'sub.netflix', label: 'Netflix', Icon: NetflixIcon },
      { id: 'sub.prime', label: 'Prime', Icon: PrimeIcon },
      { id: 'sub.youtube', label: 'YouTube', Icon: YoutubeIcon },
      { id: 'sub.software', label: 'Software', Icon: SoftwareIcon },
      { id: 'sub.news', label: 'News', Icon: NewsIcon },
      { id: 'sub.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'emi',
    label: 'EMI',
    description: 'Repayment of Loan',
    Icon: HouseEMIIcon,
    subItems: [
      { id: 'emi.electronics', label: 'Electronics', Icon: EMIElectronicsIcon },
      { id: 'emi.house', label: 'House', Icon: HouseEMIIcon },
      { id: 'emi.vehicle', label: 'Vehicle', Icon: VehicleEMIIcon },
      { id: 'emi.education', label: 'Education', Icon: EducationEMIIcon },
      { id: 'emi.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'credit_bill',
    label: 'Credit Bill',
    description: 'Credit Card & BNPL services settlement',
    Icon: CreditCardIcon,
    subItems: [
      { id: 'credit.credit_card', label: 'Credit card', Icon: CreditCardIcon },
      { id: 'credit.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'investment',
    label: 'Investment',
    description: 'Money put towards investment',
    Icon: MutualFundsIcon,
    subItems: [
      { id: 'invest.mutual_funds', label: 'Mutual Funds', Icon: MutualFundsIcon },
      { id: 'invest.stocks', label: 'Stocks', Icon: StocksIcon },
      { id: 'invest.ipo', label: 'IPO', Icon: IPOIcon },
      { id: 'invest.ppf', label: 'PPF', Icon: PPFIcon },
      { id: 'invest.nps', label: 'NPS', Icon: NPSIcon },
      { id: 'invest.fixed_deposit', label: 'Fixed Deposit', Icon: FixedDepositIcon },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    description: 'Financial support for loved ones',
    Icon: ParentsIcon,
    subItems: [
      { id: 'support.parents', label: 'Parents', Icon: ParentsIcon },
      { id: 'support.spouse', label: 'Spouse', Icon: SpouseIcon },
      { id: 'support.mom', label: 'Mom', Icon: MomIcon },
      { id: 'support.dad', label: 'Dad', Icon: DadIcon },
      { id: 'support.pocket_money', label: 'Pocket Money', Icon: PocketMoneyIcon },
      { id: 'support.others', label: 'Others', Icon: OthersIcon },
    ],
  },
  {
    id: 'insurance',
    label: 'Insurance',
    description: 'Payment towards insurance premiums',
    Icon: HealthInsuranceIcon,
    subItems: [
      { id: 'insurance.health', label: 'Health', Icon: HealthInsuranceIcon },
      { id: 'insurance.car', label: 'Vehicle', Icon: CarInsuranceIcon },
      { id: 'insurance.life', label: 'Life', Icon: LifeInsuranceIcon },
      { id: 'insurance.others', label: 'Others', Icon: OthersIcon },
    ],
  },
];

export const MOST_USED_TAG_IDS = [
  'food.eating_out',
  'food.take_away',
  'food.fast_food',
  'transport.uber',
  'transport.auto',
];

export function findTagSubItem(id: string): TagSubItem | undefined {
  for (const cat of TAG_CATEGORIES) {
    const found = cat.subItems.find(s => s.id === id);
    if (found) return found;
  }
  return undefined;
}

export function findTagCategory(subItemId: string): TagCategory | undefined {
  return TAG_CATEGORIES.find(cat => cat.subItems.some(s => s.id === subItemId));
}
