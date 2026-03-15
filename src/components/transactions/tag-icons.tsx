import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function createTagIcon(icon: MaterialIconName) {
  function TagIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
    return <MaterialCommunityIcons name={icon} size={size} color={color} />;
  }

  return TagIcon;
}

export const PhoneIcon = createTagIcon('phone-outline');
export const RentIcon = createTagIcon('home-outline');
export const WaterIcon = createTagIcon('water-outline');
export const ElectricityIcon = createTagIcon('flash-outline');
export const GasIcon = createTagIcon('fire');
export const InternetIcon = createTagIcon('wifi');
export const HouseInsuranceIcon = createTagIcon('shield-home-outline');

export const EatingOutIcon = createTagIcon('silverware-fork-knife');
export const TakeAwayIcon = createTagIcon('shopping-outline');
export const TeaCoffeeIcon = createTagIcon('coffee-outline');
export const FastFoodIcon = createTagIcon('hamburger');
export const SnacksIcon = createTagIcon('cookie-outline');
export const SwiggyIcon = createTagIcon('motorbike');
export const ZomatoIcon = createTagIcon('food-outline');

export const UberIcon = createTagIcon('car-outline');
export const RapidoIcon = createTagIcon('motorbike');
export const AutoIcon = createTagIcon('motorbike');
export const CabIcon = createTagIcon('taxi');
export const TrainIcon = createTagIcon('train');
export const MetroIcon = createTagIcon('subway-variant');
export const BusIcon = createTagIcon('bus');

export const ClothesIcon = createTagIcon('tshirt-crew-outline');
export const FootwearIcon = createTagIcon('shoe-sneaker');
export const ElectronicsIcon = createTagIcon('laptop');
export const FestivalIcon = createTagIcon('party-popper');
export const VideoGamesIcon = createTagIcon('gamepad-variant-outline');
export const BooksIcon = createTagIcon('book-open-variant');

export const StaplesIcon = createTagIcon('basket-outline');
export const VegetablesIcon = createTagIcon('carrot');
export const FruitsIcon = createTagIcon('apple');
export const MeatIcon = createTagIcon('food-drumstick-outline');
export const EggsIcon = createTagIcon('egg-outline');
export const BakeryIcon = createTagIcon('bread-slice-outline');

export const EssentialsIcon = createTagIcon('home-heart');
export const ToiletriesIcon = createTagIcon('shower');
export const DecorIcon = createTagIcon('sofa-outline');
export const CleaningIcon = createTagIcon('spray-bottle');

export const MutualFundsIcon = createTagIcon('chart-line');
export const StocksIcon = createTagIcon('chart-line');
export const IPOIcon = createTagIcon('chart-bell-curve');
export const PPFIcon = createTagIcon('piggy-bank-outline');
export const NPSIcon = createTagIcon('piggy-bank-outline');
export const FixedDepositIcon = createTagIcon('bank-outline');

export const ParentsIcon = createTagIcon('account-group-outline');
export const SpouseIcon = createTagIcon('heart-outline');
export const MomIcon = createTagIcon('account-outline');
export const DadIcon = createTagIcon('account-outline');
export const PocketMoneyIcon = createTagIcon('wallet-outline');

export const NetflixIcon = createTagIcon('television-play');
export const PrimeIcon = createTagIcon('television');
export const YoutubeIcon = createTagIcon('youtube');
export const SoftwareIcon = createTagIcon('monitor');
export const NewsIcon = createTagIcon('newspaper-variant-outline');

export const EMIElectronicsIcon = createTagIcon('laptop');
export const HouseEMIIcon = createTagIcon('home-outline');
export const VehicleEMIIcon = createTagIcon('car-outline');
export const EducationEMIIcon = createTagIcon('school-outline');

export const CreditCardIcon = createTagIcon('credit-card-outline');
export const HealthInsuranceIcon = createTagIcon('shield-plus-outline');
export const CarInsuranceIcon = createTagIcon('car-outline');
export const LifeInsuranceIcon = createTagIcon('heart-pulse');

export const EntertainmentIcon = createTagIcon('movie-open-outline');
export const MoviesIcon = createTagIcon('movie-outline');
export const ConcertIcon = createTagIcon('ticket-outline');
export const EventsIcon = createTagIcon('calendar-star');
export const TravelIcon = createTagIcon('airplane');
export const MedicalIcon = createTagIcon('medical-bag');
export const PersonalIcon = createTagIcon('content-cut');
export const FitnessIcon = createTagIcon('dumbbell');
export const ServicesIcon = createTagIcon('toolbox-outline');
export const TaxIcon = createTagIcon('receipt-text-outline');
export const TopUpIcon = createTagIcon('cellphone-arrow-down');
export const ChildrenIcon = createTagIcon('baby-face-outline');
export const PetCareIcon = createTagIcon('paw');
export const BusinessIcon = createTagIcon('briefcase-outline');
export const SelfTransferIcon = createTagIcon('swap-horizontal');
export const SavingIcon = createTagIcon('piggy-bank-outline');
export const GiftIcon = createTagIcon('gift-outline');
export const LentIcon = createTagIcon('hand-coin-outline');
export const DonationIcon = createTagIcon('hand-heart-outline');
export const HiddenChargesIcon = createTagIcon('file-alert-outline');
export const CashWithdrawalIcon = createTagIcon('cash-minus');
export const ReturnIcon = createTagIcon('backup-restore');

export const EarningsIcon = createTagIcon('cash-plus');
export const SalaryIcon = createTagIcon('cash-multiple');
export const BorrowedIcon = createTagIcon('hand-coin-outline');
export const InterestIcon = createTagIcon('percent-outline');
export const RedemptionIcon = createTagIcon('cash-refund');
export const CashDepositIcon = createTagIcon('cash-plus');
export const DividendsIcon = createTagIcon('chart-line');
export const CashbackIcon = createTagIcon('cash-fast');
export const OthersIcon = createTagIcon('tag-outline');
