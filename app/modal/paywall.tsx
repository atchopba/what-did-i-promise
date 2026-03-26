import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';
import { Button } from '../../src/components/Button';
import { useSettingsStore } from '../../src/store/useSettingsStore';

export default function PaywallModal() {
  const { upgradeToPremium } = useSettingsStore();

  const handleUpgrade = async () => {
    // TODO: integrate RevenueCat
    await upgradeToPremium();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close-outline" size={26} color={COLORS.neutral[500]} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>⭐</Text>
          <Text style={styles.title}>{FR.paywall.title}</Text>
          <Text style={styles.subtitle}>{FR.paywall.subtitle}</Text>
        </View>

        <View style={styles.featureList}>
          {FR.paywall.features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success.main} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={FR.paywall.cta} onPress={handleUpgrade} fullWidth size="lg" style={styles.ctaBtn} />
        <TouchableOpacity onPress={() => router.back()} style={styles.laterBtn}>
          <Text style={styles.laterText}>{FR.paywall.later}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[0] },
  closeBtn: { position: 'absolute', top: 52, right: SPACING.base, zIndex: 10, padding: SPACING.sm },
  scroll: { paddingBottom: SPACING['3xl'] },
  hero: { alignItems: 'center', paddingTop: SPACING['4xl'], paddingHorizontal: SPACING['2xl'], gap: SPACING.md },
  heroEmoji: { fontSize: 60 },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900], textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZE.base, color: COLORS.neutral[500], textAlign: 'center', lineHeight: 24 },
  featureList: { marginTop: SPACING.xl, paddingHorizontal: SPACING.xl, gap: SPACING.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  featureText: { fontSize: FONT_SIZE.base, color: COLORS.neutral[700] },
  footer: { padding: SPACING.base, gap: SPACING.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.neutral[100] },
  ctaBtn: {},
  laterBtn: { alignItems: 'center', padding: SPACING.sm },
  laterText: { color: COLORS.neutral[400], fontSize: FONT_SIZE.base },
});
