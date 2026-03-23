import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCheckin } from '../../src/hooks/useCheckin';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';
import { PromiseRow } from '../../src/components/PromiseRow';
import { SectionHeader } from '../../src/components/SectionHeader';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';

export default function CheckinModal() {
  const { checkin, isLoading, finish } = useCheckin();

  if (!checkin) return null;

  const total = checkin.today.length + checkin.overdue.length + checkin.atRisk.length;
  const isEmpty = total === 0;

  const handleDone = async () => {
    await finish();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close-outline" size={26} color={COLORS.neutral[600]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{FR.checkin.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>{FR.checkin.subtitle}</Text>

      {isEmpty ? (
        <EmptyState icon="checkmark-circle-outline" title={FR.checkin.allGood} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {checkin.overdue.length > 0 && (
            <>
              <SectionHeader title={FR.checkin.overdue} count={checkin.overdue.length} />
              {checkin.overdue.map(p => (
                <PromiseRow key={p.id} promise={p} onPress={id => router.push(`/promise/${id}`)} />
              ))}
            </>
          )}
          {checkin.today.length > 0 && (
            <>
              <SectionHeader title={FR.checkin.today} count={checkin.today.length} />
              {checkin.today.map(p => (
                <PromiseRow key={p.id} promise={p} onPress={id => router.push(`/promise/${id}`)} />
              ))}
            </>
          )}
          {checkin.atRisk.length > 0 && (
            <>
              <SectionHeader title={FR.checkin.atRisk} count={checkin.atRisk.length} />
              {checkin.atRisk.map(p => (
                <PromiseRow key={p.id} promise={p} onPress={id => router.push(`/promise/${id}`)} />
              ))}
            </>
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Button title={FR.checkin.done} onPress={handleDone} fullWidth size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.base },
  headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900] },
  subtitle: { fontSize: FONT_SIZE.base, color: COLORS.neutral[500], paddingHorizontal: SPACING.base, marginBottom: SPACING.sm },
  scroll: { paddingBottom: SPACING['3xl'] },
  footer: { padding: SPACING.base, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.neutral[100] },
});
