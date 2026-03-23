import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, title, subtitle, onPress, rightElement, danger }) => (
  <TouchableOpacity
    style={styles.row}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress && !rightElement}
  >
    <View style={[styles.iconWrap, danger && styles.iconDanger]}>
      <Ionicons name={icon as any} size={20} color={danger ? COLORS.error.main : COLORS.neutral[600]} />
    </View>
    <View style={styles.rowContent}>
      <Text style={[styles.rowTitle, danger && styles.dangerText]}>{title}</Text>
      {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement ?? (onPress && <Ionicons name="chevron-forward-outline" size={18} color={COLORS.neutral[300]} />)}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { isPremium, biometricEnabled, notificationsEnabled, toggleBiometric, toggleNotifications, upgradeToPremium } = useSettingsStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{FR.settings.title}</Text>

        {!isPremium && (
          <TouchableOpacity style={styles.premiumBanner} onPress={() => router.push('/modal/paywall')}>
            <Ionicons name="star-outline" size={24} color={COLORS.warning.dark} />
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>{FR.settings.premium}</Text>
              <Text style={styles.premiumSubtitle}>{FR.settings.premiumDesc}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.warning.dark} />
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <SettingRow
            icon="notifications-outline"
            title={FR.settings.notifications}
            subtitle={FR.settings.notificationsDesc}
            rightElement={
              <Switch value={notificationsEnabled} onValueChange={toggleNotifications} trackColor={{ true: COLORS.primary[600], false: COLORS.neutral[200] }} />
            }
          />
          <SettingRow
            icon="finger-print-outline"
            title={FR.settings.biometric}
            subtitle={FR.settings.biometricDesc}
            rightElement={
              <Switch value={biometricEnabled} onValueChange={toggleBiometric} trackColor={{ true: COLORS.primary[600], false: COLORS.neutral[200] }} />
            }
          />
        </View>

        <View style={styles.section}>
          <SettingRow icon="information-circle-outline" title={FR.settings.about} subtitle={`${FR.settings.version} 1.0.0`} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  scroll: { padding: SPACING.base, paddingBottom: SPACING['3xl'], gap: SPACING.md },
  title: { fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900], marginBottom: SPACING.sm },
  premiumBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warning.light, borderRadius: RADIUS.xl, padding: SPACING.base, gap: SPACING.sm, ...SHADOWS.sm },
  premiumText: { flex: 1 },
  premiumTitle: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.warning.dark },
  premiumSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.warning.dark },
  section: { backgroundColor: COLORS.neutral[0], borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.neutral[100] },
  iconWrap: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.neutral[100], alignItems: 'center', justifyContent: 'center' },
  iconDanger: { backgroundColor: COLORS.error.light },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: FONT_SIZE.base, color: COLORS.neutral[900] },
  rowSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[400], marginTop: 2 },
  dangerText: { color: COLORS.error.main },
});
