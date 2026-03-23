import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';

interface ChipOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterChipsProps {
  options: ChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
  multi?: boolean;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  options, selected, onToggle, multi: _multi = true,
}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
    {options.map(opt => {
      const isSelected = selected.includes(opt.value);
      const color = opt.color ?? COLORS.primary[600];
      return (
        <TouchableOpacity
          key={opt.value}
          style={[styles.chip, isSelected && { backgroundColor: color + '20', borderColor: color }]}
          onPress={() => onToggle(opt.value)}
          activeOpacity={0.75}
        >
          <Text style={[styles.label, isSelected && { color }]}>{opt.label}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  row: { paddingHorizontal: SPACING.base, gap: SPACING.xs, paddingVertical: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    backgroundColor: COLORS.neutral[50],
  },
  label: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium, color: COLORS.neutral[600] },
});
