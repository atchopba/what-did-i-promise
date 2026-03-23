import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReliability } from '../../src/hooks/useReliability';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';
import { StatCard } from '../../src/components/StatCard';
import { ReliabilityLevel } from '../../src/types';

const LEVEL_CONFIG: Record<ReliabilityLevel, { color: string; label: string; icon: string }> = {
  solide: { color: COLORS.success.main, label: FR.stats.levels.solide, icon: '🛡️' },
  stable: { color: COLORS.primary[600], label: FR.stats.levels.stable, icon: '✅' },
  a_renforcer: { color: COLORS.warning.main, label: FR.stats.levels.aRenforcer, icon: '⚠️' },
  sous_tension: { color: COLORS.error.main, label: FR.stats.levels.sousTension, icon: '🔴' },
};

export default function StatsScreen() {
  const { score, isLoading } = useReliability();

  if (!score) return null;

  const cfg = LEVEL_CONFIG[score.level];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{FR.stats.title}</Text>

        <View style={[styles.scoreCard, { borderColor: cfg.color }]}>
          <Text style={styles.scoreEmoji}>{cfg.icon}</Text>
          <Text style={[styles.scoreValue, { color: cfg.color }]}>{score.score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
          <Text style={[styles.levelLabel, { color: cfg.color }]}>{cfg.label}</Text>
        </View>

        <View style={styles.grid}>
          <StatCard label={FR.stats.kept} value={score.keptCount} icon="checkmark-circle-outline" color={COLORS.success.main} />
          <StatCard label={FR.stats.overdue} value={score.overdueCount} icon="alert-circle-outline" color={COLORS.error.main} />
        </View>
        <View style={styles.grid}>
          <StatCard label={FR.stats.snoozed} value={score.snoozedCount} icon="calendar-outline" color={COLORS.warning.main} />
          <StatCard label={FR.stats.avgClosure} value={score.averageClosureTime !== null ? `${score.averageClosureTime}j` : '—'} icon="time-outline" color={COLORS.primary[600]} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  scroll: { padding: SPACING.base, gap: SPACING.base, paddingBottom: SPACING['3xl'] },
  title: { fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900], marginBottom: SPACING.sm },
  scoreCard: { backgroundColor: COLORS.neutral[0], borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: SPACING.xs, borderWidth: 2, ...SHADOWS.md },
  scoreEmoji: { fontSize: 48 },
  scoreValue: { fontSize: 64, fontWeight: FONT_WEIGHT.bold, lineHeight: 72 },
  scoreMax: { fontSize: FONT_SIZE.md, color: COLORS.neutral[400] },
  levelLabel: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.semibold },
  grid: { flexDirection: 'row', gap: SPACING.sm },
});
