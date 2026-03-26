import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../constants/theme';

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
  options,
  selected,
  onToggle,
  multi: _multi = true,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.row}
    style={styles.container}
  >
    {options.map(opt => {
      const isSelected = selected.includes(opt.value);
      const color = opt.color ?? COLORS.primary[600];
      return (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.chip,
            {
              borderColor: color,
              backgroundColor: isSelected ? color + '25' : COLORS.neutral[0],
            },
          ]}
          onPress={() => onToggle(opt.value)}
          activeOpacity={0.75}
        >
          <Text style={[styles.label, { color: isSelected ? color : COLORS.neutral[800] }]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    minHeight: 60,
  },
  row: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  chip: {
    paddingHorizontal: 20,
    minHeight: 44,
    justifyContent: 'center' as const,
    borderRadius: RADIUS.full,
    borderWidth: 2,
  },
  label: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
