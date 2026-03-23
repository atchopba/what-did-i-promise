import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePromiseStore } from '../../src/store/usePromiseStore';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { useReliability } from '../../src/hooks/useReliability';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';
import { StatCard } from '../../src/components/StatCard';
import { Button } from '../../src/components/Button';
import { PromiseRow } from '../../src/components/PromiseRow';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function HomeScreen() {
  const { promises, sections, isLoading, loadPromises } = usePromiseStore();
  const { isPremium } = useSettingsStore();
  const { score } = useReliability();

  useEffect(() => {
    loadPromises();
  }, []);

  const today = sections.find(s => s.key === 'today')?.data ?? [];
  const overdue = sections.find(s => s.key === 'overdue')?.data ?? [];
  const thisWeek = sections.find(s => s.key === 'thisWeek')?.data ?? [];

  const todayStr = format(new Date(), "EEEE d MMMM", { locale: fr });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadPromises} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{todayStr}</Text>
            <Text style={styles.title}>{FR.home.title}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkinBtn}
            onPress={() => router.push('/modal/checkin')}
          >
            <Ionicons name="checkmark-done-outline" size={20} color={COLORS.primary[600]} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatCard label={FR.home.today} value={today.length} icon="today-outline" color={COLORS.primary[600]} />
          <StatCard label={FR.home.overdue} value={overdue.length} icon="alert-circle-outline" color={overdue.length > 0 ? COLORS.error.main : COLORS.neutral[400]} />
          <StatCard label={FR.home.thisWeek} value={thisWeek.length} icon="calendar-outline" color={COLORS.warning.main} />
          {score && (
            <StatCard label={FR.home.reliability} value={`${score.score}%`} icon="shield-checkmark-outline" color={COLORS.success.main} />
          )}
        </View>

        <Button title={FR.home.cta} onPress={() => router.push('/promise/create')} fullWidth size="lg" style={styles.cta} />

        {overdue.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <Ionicons name="alert-circle-outline" size={18} color={COLORS.error.main} />
                <Text style={[styles.sectionTitle, { color: COLORS.error.main }]}>
                  {FR.promises.sections.overdue} ({overdue.length})
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/promises')}>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            {overdue.slice(0, 3).map(p => (
              <PromiseRow key={p.id} promise={p} onPress={id => router.push(`/promise/${id}`)} />
            ))}
          </View>
        )}

        {today.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <Ionicons name="today-outline" size={18} color={COLORS.primary[600]} />
                <Text style={styles.sectionTitle}>{FR.promises.sections.today} ({today.length})</Text>
              </View>
            </View>
            {today.slice(0, 5).map(p => (
              <PromiseRow key={p.id} promise={p} onPress={id => router.push(`/promise/${id}`)} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.riskBanner} onPress={() => router.push('/promises')}>
          <Ionicons name="shield-outline" size={20} color={COLORS.warning.dark} />
          <Text style={styles.riskBannerText}>Voir les promesses à risque</Text>
          <Ionicons name="chevron-forward-outline" size={16} color={COLORS.warning.dark} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  scroll: { paddingBottom: SPACING['3xl'] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md },
  date: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[400], textTransform: 'capitalize' },
  title: { fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900] },
  checkinBtn: { width: 40, height: 40, borderRadius: RADIUS.lg, backgroundColor: COLORS.primary[50], alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.base, marginBottom: SPACING.base },
  cta: { marginHorizontal: SPACING.base, marginBottom: SPACING.lg },
  section: { marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, marginBottom: SPACING.sm },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  sectionTitle: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.neutral[800] },
  seeAll: { fontSize: FONT_SIZE.sm, color: COLORS.primary[600] },
  riskBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginHorizontal: SPACING.base, marginTop: SPACING.md, backgroundColor: COLORS.warning.light, padding: SPACING.md, borderRadius: RADIUS.xl, ...SHADOWS.sm },
  riskBannerText: { flex: 1, fontSize: FONT_SIZE.base, color: COLORS.warning.dark, fontWeight: FONT_WEIGHT.medium },
});
