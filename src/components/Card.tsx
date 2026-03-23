import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card: React.FC<CardProps> = ({ children, style, padding = 'md' }) => (
  <View style={[styles.card, styles[`pad_${padding}`], style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: RADIUS.xl,
    ...SHADOWS.md,
  },
  pad_none: {},
  pad_sm: { padding: SPACING.sm },
  pad_md: { padding: SPACING.base },
  pad_lg: { padding: SPACING.xl },
});
