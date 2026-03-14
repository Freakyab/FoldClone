import { Text, type TextProps, type TextStyle } from 'react-native';

import { Fonts, ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'bodyStrong'
    | 'label'
    | 'link'
    | 'linkPrimary'
    | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        textStyles.base,
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && textStyles.default,
        type === 'title' && textStyles.title,
        type === 'small' && textStyles.small,
        type === 'smallBold' && textStyles.smallBold,
        type === 'subtitle' && textStyles.subtitle,
        type === 'bodyStrong' && textStyles.bodyStrong,
        type === 'label' && textStyles.label,
        type === 'link' && textStyles.link,
        type === 'linkPrimary' && textStyles.linkPrimary,
        type === 'linkPrimary' && { color: theme.accentBlue },
        type === 'code' && textStyles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const textStyles = {
  base: {
    fontFamily: Fonts.sans,
  },
  small: {
    ...Typography.small,
  },
  smallBold: {
    ...Typography.smallBold,
  },
  default: {
    ...Typography.default,
  },
  title: {
    ...Typography.title,
  },
  subtitle: {
    ...Typography.subtitle,
  },
  bodyStrong: {
    ...Typography.bodyStrong,
  },
  label: {
    ...Typography.label,
  },
  link: {
    ...Typography.link,
  },
  linkPrimary: {
    ...Typography.link,
    fontWeight: '700',
  },
  code: {
    ...Typography.code,
  },
} satisfies Record<string, TextStyle>;
