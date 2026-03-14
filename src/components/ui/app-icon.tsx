import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type AppIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
}>;

export type AppIconName =
  | 'arrow-left-right'
  | 'bell'
  | 'bell-off'
  | 'bookmark'
  | 'building-2'
  | 'calendar'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'circle-x'
  | 'credit-card'
  | 'ellipsis'
  | 'file-text'
  | 'flame'
  | 'grip'
  | 'grid-2x2'
  | 'info'
  | 'pencil'
  | 'pencil-line'
  | 'plus'
  | 'refresh-ccw'
  | 'search'
  | 'settings'
  | 'sliders-horizontal'
  | 'square-check'
  | 'sticky-note'
  | 'tag'
  | 'user'
  | 'user-round'
  | 'wallet'
  | 'x';

const APP_ICON_MAP: Record<AppIconName, MaterialIconName> = {
  'arrow-left-right': 'swap-horizontal',
  bell: 'bell-outline',
  'bell-off': 'bell-off-outline',
  bookmark: 'bookmark-outline',
  'building-2': 'bank-outline',
  calendar: 'calendar-blank-outline',
  check: 'check',
  'chevron-down': 'chevron-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'chevron-up': 'chevron-up',
  'circle-x': 'close-circle-outline',
  'credit-card': 'credit-card-outline',
  ellipsis: 'dots-horizontal',
  'file-text': 'file-document-outline',
  flame: 'fire',
  grip: 'drag',
  'grid-2x2': 'view-grid-outline',
  info: 'information-outline',
  pencil: 'pencil-outline',
  'pencil-line': 'pencil-box-outline',
  plus: 'plus',
  'refresh-ccw': 'refresh',
  search: 'magnify',
  settings: 'cog-outline',
  'sliders-horizontal': 'tune-variant',
  'square-check': 'check-box-outline',
  'sticky-note': 'note-text-outline',
  tag: 'tag-outline',
  user: 'account-outline',
  'user-round': 'account-circle-outline',
  wallet: 'wallet-outline',
  x: 'close',
};

export interface AppIconProps
  extends Omit<React.ComponentProps<typeof MaterialCommunityIcons>, 'name' | 'color' | 'size'> {
  name?: AppIconName;
  icon?: AppIconComponent;
  size?: number;
  color?: string;
  themeColor?: ThemeColor;
}

export function AppIcon({
  name,
  icon,
  size = 20,
  color,
  themeColor = 'textSecondary',
  ...props
}: AppIconProps) {
  const theme = useTheme();
  if (icon) return React.createElement(icon, { size, color: color ?? theme[themeColor] });
  if (!name) return null;

  return (
    <MaterialCommunityIcons
      name={APP_ICON_MAP[name]}
      size={size}
      color={color ?? theme[themeColor]}
      {...props}
    />
  );
}
