export const COLORS = {
  // Primary palette - calm, premium
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Neutral
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  // Semantic
  success: { light: '#D1FAE5', main: '#10B981', dark: '#047857' },
  warning: { light: '#FEF3C7', main: '#F59E0B', dark: '#B45309' },
  error: { light: '#FEE2E2', main: '#EF4444', dark: '#B91C1C' },
  info: { light: '#DBEAFE', main: '#3B82F6', dark: '#1D4ED8' },
  // Risk levels
  risk: {
    faible: '#10B981',
    attention: '#F59E0B',
    surveiller: '#F97316',
    critique: '#EF4444',
  },
  // Status colors
  status: {
    ouverte: '#3B82F6',
    en_cours: '#8B5CF6',
    tenue: '#10B981',
    reportee: '#F59E0B',
    annulee: '#9CA3AF',
    en_retard: '#EF4444',
    archivee: '#6B7280',
  },
  // Context colors
  context: {
    personnel: '#8B5CF6',
    travail: '#3B82F6',
    famille: '#EC4899',
    amities: '#F97316',
    administratif: '#6B7280',
    sante: '#10B981',
    finances: '#F59E0B',
    maison: '#84CC16',
    autre: '#9CA3AF',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 19,
  xl: 22,
  '2xl': 26,
  '3xl': 30,
  '4xl': 36,
};

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const CONTEXT_ICONS: Record<string, string> = {
  personnel: 'person-outline',
  travail: 'briefcase-outline',
  famille: 'home-outline',
  amities: 'people-outline',
  administratif: 'document-text-outline',
  sante: 'medical-outline',
  finances: 'cash-outline',
  maison: 'hammer-outline',
  autre: 'ellipsis-horizontal-outline',
};

export const STATUS_ICONS: Record<string, string> = {
  ouverte: 'radio-button-off-outline',
  en_cours: 'time-outline',
  tenue: 'checkmark-circle-outline',
  reportee: 'calendar-outline',
  annulee: 'close-circle-outline',
  en_retard: 'alert-circle-outline',
  archivee: 'archive-outline',
};

export const PRIORITY_ICONS: Record<string, string> = {
  faible: 'chevron-down-outline',
  normale: 'remove-outline',
  elevee: 'chevron-up-outline',
  critique: 'flame-outline',
};
