import React from 'react';
import Svg, { Circle, Path, Rect, Line, Polyline, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// ─── Bill icons ───────────────────────────────────────────────────────────────

export function PhoneIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.6 10.8C7.8 13.2 9.8 15.2 12.2 16.4L14.2 14.4C14.5 14.1 14.9 14 15.3 14.2C16.6 14.6 18 14.8 19.5 14.8C20.3 14.8 21 15.5 21 16.3V20.5C21 21.3 20.3 22 19.5 22C10.4 22 3 14.6 3 5.5C3 4.7 3.7 4 4.5 4H8.7C9.5 4 10.2 4.7 10.2 5.5C10.2 7 10.4 8.4 10.8 9.7C11 10.1 10.9 10.5 10.6 10.8L8.6 12.8L8.6 10.8H6.6Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function RentIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3L21 9.5V20C21 20.6 20.6 21 20 21H15V16H9V21H4C3.4 21 3 20.6 3 20V9.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function WaterIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C12 2 5 10 5 15C5 18.9 8.1 22 12 22C15.9 22 19 18.9 19 15C19 10 12 2 12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ElectricityIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GasIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C9 6 7 9 7 12C7 14.8 8.2 16 9 17C9.8 18 10 19 10 20H14C14 19 14.2 18 15 17C15.8 16 17 14.8 17 12C17 9 15 6 12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="10" y1="20" x2="14" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="10" y1="22" x2="14" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function InternetIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5C5 12.5 6.5 9 12 9C17.5 9 19 12.5 19 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M8 16C8 16 9.5 13.5 12 13.5C14.5 13.5 16 16 16 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="19" r="1" fill={color} />
      <Path d="M2 8.5C2 8.5 5 3 12 3C19 3 22 8.5 22 8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function HouseInsuranceIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3L21 9.5V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V9.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 12C10.9 12 10 12.9 10 14C10 15.1 10.9 16 12 16C13.1 16 14 15.1 14 14C14 12.9 13.1 12 12 12Z" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

// ─── Food & Drinks icons ───────────────────────────────────────────────────────

export function EatingOutIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 2V8C3 10.2 4.8 12 7 12V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M7 2V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M11 2V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M11 7C13.8 7 17 5.5 17 2V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TakeAwayIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 8H18L17 19H7L6 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 8V6C8 4.9 9.3 4 11 4H13C14.7 4 16 4.9 16 6V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="4" y1="8" x2="20" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function TeaCoffeeIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11H16V17C16 18.7 14.7 20 13 20H7C5.3 20 4 18.7 4 17V11Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 13H18C19.1 13 20 13.9 20 15C20 16.1 19.1 17 18 17H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M8 6C8 6 7 7.5 8 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 5C12 5 11 7 12 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function FastFoodIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 15H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M3 11C3 9 7 7 12 7C17 7 21 9 21 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M5 15V18C5 19.1 5.9 20 7 20H17C18.1 20 19 19.1 19 18V15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 7V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 7V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M16 7V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function SnacksIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 3H16L18 9H6L8 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 9L5 21H19L18 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SwiggyIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3C7.6 3 4 6.6 4 11C4 14 5.6 16.6 8 18L8 21H16L16 18C18.4 16.6 20 14 20 11C20 6.6 16.4 3 12 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 11C9 9.3 10.3 8 12 8C13.7 8 15 9.3 15 11C15 12.7 13.7 14 12 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function ZomatoIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C16.4 21 20 17.4 20 13C20 8.6 16.4 5 12 5C7.6 5 4 8.6 4 13C4 17.4 7.6 21 12 21Z" stroke={color} strokeWidth="1.5" />
      <Path d="M9 13C9 11.3 10.3 10 12 10C13.7 10 15 11.3 15 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 5V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Transport icons ───────────────────────────────────────────────────────────

export function UberIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="8" width="20" height="12" rx="3" stroke={color} strokeWidth="1.5" />
      <Path d="M6 8V6C6 4.9 6.9 4 8 4H16C17.1 4 18 4.9 18 6V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="7" cy="17" r="1.5" stroke={color} strokeWidth="1.5" />
      <Circle cx="17" cy="17" r="1.5" stroke={color} strokeWidth="1.5" />
      <Line x1="2" y1="14" x2="22" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function RapidoIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 17L3 14L7 8H17L21 14L19 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="8" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      <Circle cx="16" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      <Line x1="10" y1="17" x2="14" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function AutoIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 16H3C2.4 16 2 15.6 2 15V13L5 7H18L21 13V15C21 15.6 20.6 16 20 16H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="7" cy="16" r="2" stroke={color} strokeWidth="1.5" />
      <Circle cx="17" cy="16" r="2" stroke={color} strokeWidth="1.5" />
      <Line x1="9" y1="16" x2="15" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M5 11H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function CabIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 17H3V13L6 7H18L21 13V17H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="7" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      <Circle cx="17" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      <Path d="M9 17H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M8 7L7 11H17L16 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TrainIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="16" rx="3" stroke={color} strokeWidth="1.5" />
      <Line x1="5" y1="10" x2="19" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="9" cy="15" r="1" fill={color} />
      <Circle cx="15" cy="15" r="1" fill={color} />
      <Path d="M8 18L6 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M16 18L18 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M6 22H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function MetroIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="3" width="16" height="13" rx="3" stroke={color} strokeWidth="1.5" />
      <Line x1="4" y1="9" x2="20" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="9" cy="13" r="1" fill={color} />
      <Circle cx="15" cy="13" r="1" fill={color} />
      <Path d="M7 16L5 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M17 16L19 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="12" y1="3" x2="12" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function BusIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 10C4 7 8 4 12 4C16 4 20 7 20 10V18H4V10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="4" y1="14" x2="20" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="8" cy="18" r="2" stroke={color} strokeWidth="1.5" />
      <Circle cx="16" cy="18" r="2" stroke={color} strokeWidth="1.5" />
      <Line x1="12" y1="4" x2="12" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Shopping icons ────────────────────────────────────────────────────────────

export function ClothesIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7L8 4L12 7L16 4L21 7L19 12H15V20H9V12H5L3 7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function FootwearIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 17H22V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V17Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 17L7 9L12 11L18 9L20 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ElectronicsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <Line x1="8" y1="22" x2="16" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M9 11L11 13L15 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function FestivalIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L14.9 8.6L22 9.7L17 14.6L18.2 22L12 18.6L5.8 22L7 14.6L2 9.7L9.1 8.6L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function VideoGamesIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9H18C19.1 9 20 9.9 20 11V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V11C4 9.9 4.9 9 6 9Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="8" y1="13" x2="11" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="9.5" y1="11.5" x2="9.5" y2="14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="15" cy="13" r="1" fill={color} />
      <Circle cx="17" cy="15" r="1" fill={color} />
    </Svg>
  );
}

export function BooksIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 3H9C10.1 3 11 3.9 11 5V20C11 21.1 10.1 22 9 22H4C2.9 22 2 21.1 2 20V5C2 3.9 2.9 3 4 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11 7L20 4L22 18L13 21L11 7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Groceries icons ───────────────────────────────────────────────────────────

export function StaplesIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3C8 3 5 7 5 12H19C19 7 16 3 12 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="4" y="12" width="16" height="9" rx="1" stroke={color} strokeWidth="1.5" />
      <Line x1="8" y1="12" x2="8" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="16" y1="12" x2="16" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function VegetablesIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C12 22 4 17 4 10C4 6.7 7.6 4 12 4C16.4 4 20 6.7 20 10C20 17 12 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 4V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 9C12 9 15 6 18 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 14C12 14 9 11 6 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function FruitsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C8.7 22 6 19.3 6 16C6 12.7 8.7 8 12 8C15.3 8 18 12.7 18 16C18 19.3 15.3 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 8C12 8 13 4 17 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function MeatIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 7C19 7 21 9 21 12C21 15 19 17 17 17C15 17 13 15.5 11 15.5C9 15.5 7 17 5 17C3 17 2 15 2 13C2 10 4 8 6 8L19 7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="18" cy="6" r="2" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export function EggsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3C8.7 3 6 7.1 6 11.5C6 16 8.7 20 12 20C15.3 20 18 16 18 11.5C18 7.1 15.3 3 12 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 13C10 13 10.5 14.5 12 14.5C13.5 14.5 14 13 14 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function BakeryIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 12C6 8.7 8.7 6 12 6C15.3 6 18 8.7 18 12H6Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="4" y="12" width="16" height="9" rx="2" stroke={color} strokeWidth="1.5" />
      <Line x1="9" y1="12" x2="9" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="15" y1="12" x2="15" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Home icons ────────────────────────────────────────────────────────────────

export function EssentialsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3L21 9.5V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V9.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="9" y="13" width="6" height="8" rx="1" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export function ToiletriesIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 4H16C16.6 4 17 4.4 17 5V20C17 20.6 16.6 21 16 21H8C7.4 21 7 20.6 7 20V5C7 4.4 7.4 4 8 4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="10" y1="4" x2="10" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="14" y1="4" x2="14" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="7" y1="9" x2="17" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function DecorIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L21 9V21H3V9L12 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="13" r="3" stroke={color} strokeWidth="1.5" />
      <Path d="M9 13C9 11.3 10.3 10 12 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function CleaningIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 5L8 11H16L14 5H10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 11L5 20H19L17 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="5" x2="12" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Investment icons ──────────────────────────────────────────────────────────

export function MutualFundsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 20L8 13L12 16L17 8L21 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="21" cy="12" r="1.5" fill={color} />
      <Line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function StocksIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="16 7 22 7 22 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IPOIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M8 12H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 8V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function PPFIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" stroke={color} strokeWidth="1.5" />
      <Path d="M12 6V12L16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function NPSIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C12 22 3 17 3 10C3 6.1 7.2 3 12 3C16.8 3 21 6.1 21 10C21 17 12 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 8V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="15" r="0.5" fill={color} stroke={color} strokeWidth="1" />
    </Svg>
  );
}

export function FixedDepositIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M3 10H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M7 14H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M7 17H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M8 6V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M16 6V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Support icons ─────────────────────────────────────────────────────────────

export function ParentsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="8" cy="7" r="3" stroke={color} strokeWidth="1.5" />
      <Circle cx="16" cy="7" r="3" stroke={color} strokeWidth="1.5" />
      <Path d="M1 21C1 17.7 4.1 15 8 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M23 21C23 17.7 19.9 15 16 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function SpouseIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21L5 14C3.3 12.3 3.3 9.7 5 8C6.7 6.3 9.3 6.3 11 8L12 9L13 8C14.7 6.3 17.3 6.3 19 8C20.7 9.7 20.7 12.3 19 14L12 21Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MomIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" />
      <Path d="M4 21C4 17.1 7.6 14 12 14C16.4 14 20 17.1 20 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M10 7C10 7 10.5 9 12 9C13.5 9 14 7 14 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function DadIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" />
      <Path d="M4 21C4 17.1 7.6 14 12 14C16.4 14 20 17.1 20 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="9" y1="7" x2="15" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function PocketMoneyIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="8" width="20" height="13" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M2 13H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M16 8V6C16 4.9 15.1 4 14 4H10C8.9 4 8 4.9 8 6V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="17" r="2" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

// ─── Subscription icons ────────────────────────────────────────────────────────

export function NetflixIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 4V20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M7 4L14 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M17 4V20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M14 14L17 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function PrimeIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L21 9V21H3V9L12 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 14L12 11L15 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function YoutubeIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22.5 7C22.5 7 22.2 5.2 21.4 4.4C20.4 3.3 19.3 3.3 18.7 3.2C15.6 3 11 3 11 3C11 3 6.4 3 3.3 3.2C2.7 3.3 1.6 3.3 0.6 4.4C-0.2 5.2 -0.5 7 -0.5 7C-0.5 7 -0.8 9.1 -0.8 11.2V13.2C-0.8 15.2 -0.5 17.4 -0.5 17.4C-0.5 17.4 -0.2 19.2 0.6 20C1.6 21.1 2.8 21.1 3.5 21.2C5.6 21.4 12 21.4 12 21.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 15V9L15 12L10 15Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 15L20 18M20 15L17 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function SoftwareIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="3" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M8 21H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 17V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M8 10L10 12L8 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13 14H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function NewsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 3H20C20.6 3 21 3.4 21 4V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V4C3 3.4 3.4 3 4 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="7" y1="8" x2="17" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="7" y1="12" x2="17" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="7" y1="16" x2="13" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── EMI icons ─────────────────────────────────────────────────────────────────

export function EMIElectronicsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M8 22H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 18V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M7 11H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function HouseEMIIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3L21 9.5V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V9.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 21V15H15V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function VehicleEMIIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 17H3V13L6 7H18L21 13V17H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="7" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      <Circle cx="17" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      <Path d="M9 17H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function EducationEMIIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 10L12 5L2 10L12 15L22 10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 12.5V17C6 17 8 19 12 19C16 19 18 17 18 17V12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="22" y1="10" x2="22" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Credit Bill icons ─────────────────────────────────────────────────────────

export function CreditCardIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <Line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="6" y1="15" x2="10" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Insurance icons ───────────────────────────────────────────────────────────

export function HealthInsuranceIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C12 22 3 16 3 9C3 6.2 7.1 4 12 4C16.9 4 21 6.2 21 9C21 16 12 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 11H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 9V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function CarInsuranceIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 17H3V13L6 7H18L21 13V17H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="7" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      <Circle cx="17" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      <Path d="M13 10L15 12L13 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function LifeInsuranceIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C12 22 3 16 3 9C3 6.2 7.1 4 12 4C16.9 4 21 6.2 21 9C21 16 12 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Entertainment icons ───────────────────────────────────────────────────────

export function EntertainmentIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M10 9L15 12L10 15V9Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="2" y1="12" x2="8" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function MoviesIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M10 9L15 12L10 15V9Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ConcertIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18V5L21 3V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 9L21 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M6 21C7.7 21 9 19.7 9 18C9 16.3 7.7 15 6 15C4.3 15 3 16.3 3 18C3 19.7 4.3 21 6 21Z" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export function EventsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
      <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function TravelIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L2 12L10 13L16 7L22 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M2 12L10 13V22L16 16H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MedicalIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C12 22 3 16 3 9C3 6.2 7.1 4 12 4C16.9 4 21 6.2 21 9C21 16 12 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 8V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M9 11H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function PersonalIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" />
      <Path d="M4 21C4 17.1 7.6 14 12 14C16.4 14 20 17.1 20 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function FitnessIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6.5 6.5L9 9L6.5 11.5L9 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17.5 10L15 12.5L17.5 15L15 17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 9L12 12L15 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ServicesIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14.7 6.3L21 12L14.7 17.7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 12H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M3 5V19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function TaxIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6C5.4 2 5 2.4 5 3V21C5 21.6 5.4 22 6 22H18C18.6 22 19 21.6 19 21V8L14 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 2V8H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 13H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M9 17H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function TopUpIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="1.5" />
      <Line x1="12" y1="18" x2="12" y2="18.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 14V14.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M8 6H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function ChildrenIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="6" r="3" stroke={color} strokeWidth="1.5" />
      <Path d="M5 21C5 17.1 8.1 14 12 14C15.9 14 19 17.1 19 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 9V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function PetCareIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 10C10 8 7 8 5 10C3 12 3 15 5 17L12 22L19 17C21 15 21 12 19 10C17 8 14 8 12 10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="9" cy="9" r="1.5" stroke={color} strokeWidth="1.5" />
      <Circle cx="15" cy="9" r="1.5" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export function BusinessIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M2 11H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function SelfTransferIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 1L21 5L17 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 11V9C3 7.9 3.9 7 5 7H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 23L3 19L7 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M21 13V15C21 16.1 20.1 17 19 17H3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SavingIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 16V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M5 12H3C2.4 12 2 11.6 2 11V5C2 4.4 2.4 4 3 4H9C9.6 4 10 4.4 10 5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19 12H21C21.6 12 22 11.6 22 11V5C22 4.4 21.6 4 21 4H15C14.4 4 14 4.4 14 5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 12C5 12 5 20 12 20C19 20 19 12 19 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GiftIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12V22H4V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 7H2V12H22V7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 22V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 7H7.5C6.1 7 5 5.9 5 4.5C5 3.1 6.1 2 7.5 2C10 2 12 5 12 7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 7H16.5C17.9 7 19 5.9 19 4.5C19 3.1 17.9 2 16.5 2C14 2 12 5 12 7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function LentIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C16.4 21 20 17.4 20 13C20 8.6 16.4 5 12 5C7.6 5 4 8.6 4 13C4 17.4 7.6 21 12 21Z" stroke={color} strokeWidth="1.5" />
      <Path d="M12 8V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 16H12.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function DonationIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21.4L10.5 20C5.3 15.3 2 12 2 8.5C2 5.4 4.4 3 7.5 3C9.2 3 10.9 3.8 12 5C13.1 3.8 14.8 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 18.7 15.3 13.5 20L12 21.4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function HiddenChargesIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17.9 17.9C16.5 19.3 14.5 20 12 20C7.6 20 4 16.4 4 12C4 9.5 4.7 7.5 6.1 6.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M6.1 6.1L3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M21 21L17.9 17.9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 4C16.4 4 20 7.6 20 12C20 12.8 19.9 13.6 19.7 14.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function CashWithdrawalIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="1.5" />
      <Line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M6 14H6.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M10 14H10.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M14 14H14.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M18 14H18.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function ReturnIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12C3 7 7 3 12 3C17 3 21 7 21 12C21 17 17 21 12 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 12H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 12L7 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Credit / Income icons ────────────────────────────────────────────────────

export function EarningsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M17 7C17 5.9 16.1 5 15 5H9C7.9 5 7 5.9 7 7V9C7 10.1 7.9 11 9 11H15C16.1 11 17 10.1 17 9V7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 13C17 11.9 16.1 11 15 11H9C7.9 11 7 11.9 7 13V15C7 16.1 7.9 17 9 17H15C16.1 17 17 16.1 17 15V13Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SalaryIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <Path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M2 11H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function BorrowedIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C16.4 21 20 17.4 20 13C20 8.6 16.4 5 12 5C7.6 5 4 8.6 4 13C4 17.4 7.6 21 12 21Z" stroke={color} strokeWidth="1.5" />
      <Path d="M12 8V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 16H12.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function InterestIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L14.1 9.3L22 12L14.1 14.7L12 22L9.9 14.7L2 12L9.9 9.3L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function RedemptionIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 20L8 15L12 19L21 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 19L15 22L21 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="18" cy="6" r="2" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export function CashDepositIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="1.5" />
      <Line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M12 14V18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M10 16H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function DividendsIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 2H22V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CashbackIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function OthersIcon({ size = 22, color = '#8A8A8A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <Circle cx="8.5" cy="12" r="1" fill={color} />
      <Circle cx="12" cy="12" r="1" fill={color} />
      <Circle cx="15.5" cy="12" r="1" fill={color} />
    </Svg>
  );
}
