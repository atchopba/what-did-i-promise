import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';

import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'checkmark-circle-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => (
  <View style={styles.container}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    <Ionicons name={icon as any} size={56} color={COLORS.neutral[300]} />
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    {actionLabel && onAction && (
      <Button title={actionLabel} onPress={onAction} variant="secondary" style={styles.btn} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING['4xl'],
    gap: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.neutral[600],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.neutral[400],
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: { marginTop: SPACING.sm },
});
