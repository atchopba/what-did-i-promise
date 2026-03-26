import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';

interface SectionHeaderProps {
  title: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title, count, actionLabel, onAction,
}) => (
  <View style={styles.row}>
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      {count !== undefined && (
        <View style={styles.countBadge}>
          <Text style={styles.count}>{count}</Text>
        </View>
      )}
    </View>
    {actionLabel && onAction && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.base,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  title: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: COLORS.neutral[200],
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  count: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, color: COLORS.neutral[600] },
  action: { fontSize: FONT_SIZE.sm, color: COLORS.primary[600], fontWeight: FONT_WEIGHT.medium },
});
