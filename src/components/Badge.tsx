import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';
import { PromiseStatus, PromisePriority } from '../types';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = COLORS.neutral[700],
  backgroundColor = COLORS.neutral[100],
  size = 'sm',
}) => (
  <View style={[styles.badge, { backgroundColor }, size === 'md' && styles.md]}>
    <Text style={[styles.label, { color }, size === 'md' && styles.labelMd]}>{label}</Text>
  </View>
);

export const StatusBadge: React.FC<{ status: PromiseStatus }> = ({ status }) => {
  const color = COLORS.status[status] ?? COLORS.neutral[500];
  const bg = color + '20';
  const labels: Record<PromiseStatus, string> = {
    ouverte: 'Ouverte',
    en_cours: 'En cours',
    tenue: 'Tenue',
    reportee: 'Reportée',
    annulee: 'Annulée',
    en_retard: 'En retard',
    archivee: 'Archivée',
  };
  return <Badge label={labels[status]} color={color} backgroundColor={bg} />;
};

export const PriorityBadge: React.FC<{ priority: PromisePriority }> = ({ priority }) => {
  const map: Record<PromisePriority, { label: string; color: string }> = {
    faible: { label: 'Faible', color: COLORS.neutral[400] },
    normale: { label: 'Normale', color: COLORS.primary[500] },
    elevee: { label: 'Élevée', color: COLORS.warning.main },
    critique: { label: 'Critique', color: COLORS.error.main },
  };
  const { label, color } = map[priority];
  return <Badge label={label} color={color} backgroundColor={color + '20'} />;
};

export const RiskBadge: React.FC<{ score: number }> = ({ score }) => {
  const level =
    score >= 80 ? 'critique' :
    score >= 60 ? 'surveiller' :
    score >= 30 ? 'attention' : 'faible';
  const labels: Record<string, string> = {
    faible: 'Faible risque',
    attention: 'Attention',
    surveiller: 'À surveiller',
    critique: 'Critique',
  };
  const color = COLORS.risk[level as keyof typeof COLORS.risk];
  return <Badge label={labels[level]} color={color} backgroundColor={color + '20'} />;
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  md: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  label: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold },
  labelMd: { fontSize: FONT_SIZE.sm },
});
