import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { AppCard } from '@/components/ui/app-card';

interface BaseCardProps extends React.PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function BaseCard({ children, style }: BaseCardProps) {
  return <AppCard style={style}>{children}</AppCard>;
}

