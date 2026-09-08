import React from 'react';
import { Text as RNText, StyleSheet, type TextProps, type TextStyle } from 'react-native';
import { colors, typography } from '@vora/tokens';

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant;
  color?: 'primary' | 'secondary' | 'muted' | 'turquoise' | 'copper' | 'danger' | 'success';
  align?: TextStyle['textAlign'];
};

const colorMap = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  turquoise: colors.brand.turquoise500,
  copper: colors.brand.copper500,
  danger: colors.semantic.danger,
  success: colors.semantic.success,
} as const;

export function Text({
  variant = 'body',
  color = 'primary',
  align,
  style,
  ...rest
}: Props) {
  return (
    <RNText
      style={[
        typography[variant],
        { color: colorMap[color], textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
}

export const textStyles = StyleSheet.create({});
