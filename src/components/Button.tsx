import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const labelStyle = [styles.label, styles[`label_${variant}`], styles[`label_${size}`], textStyle];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.neutral[0] : COLORS.primary[600]}
          size="small"
        />
      ) : (
        <Text style={labelStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOWS.sm,
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },

  // Variants
  primary: { backgroundColor: COLORS.primary[600] },
  secondary: {
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: COLORS.error.main },

  // Sizes
  size_sm: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, minHeight: 36 },
  size_md: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2, minHeight: 44 },
  size_lg: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, minHeight: 52 },

  // Label
  label: { fontWeight: FONT_WEIGHT.semibold },
  label_primary: { color: COLORS.neutral[0] },
  label_secondary: { color: COLORS.neutral[800] },
  label_ghost: { color: COLORS.primary[600] },
  label_danger: { color: COLORS.neutral[0] },
  label_sm: { fontSize: FONT_SIZE.sm },
  label_md: { fontSize: FONT_SIZE.base },
  label_lg: { fontSize: FONT_SIZE.md },
});
