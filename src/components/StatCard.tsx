import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label, value, icon, color = COLORS.primary[600], subtitle,
}) => (
  <View style={styles.card}>
    {icon && (
      <View style={[styles.iconWrap, { backgroundColor: color + '20' }]}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
    )}
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1,
    ...SHADOWS.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900] },
  label: { fontSize: FONT_SIZE.xs, color: COLORS.neutral[500], textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZE.xs, color: COLORS.neutral[400], textAlign: 'center' },
});
