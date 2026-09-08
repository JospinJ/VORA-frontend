import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@vora/tokens';
import { Text } from './Text';

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View style={styles.box}>
      <Text variant="caption" color="muted">
        {label}
      </Text>
      <Text variant="numericXl" color="turquoise">
        {value}
      </Text>
      {hint ? (
        <Text variant="caption" color="secondary">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface[700],
    borderWidth: 1,
    borderColor: colors.border.default,
  },
});
