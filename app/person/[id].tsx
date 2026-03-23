import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePersonStore } from '../../src/store/usePersonStore';
import { usePromiseStore } from '../../src/store/usePromiseStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS } from '../../src/constants/theme';
import { PersonAvatar } from '../../src/components/PersonAvatar';
import { PromiseRow } from '../../src/components/PromiseRow';
import { EmptyState } from '../../src/components/EmptyState';
import { PERSON_TYPE_OPTIONS } from '../../src/constants/datasets';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { people, loadPeople } = usePersonStore();
  const { promises, loadPromises } = usePromiseStore();

  useEffect(() => {
    loadPeople();
    if (id) loadPromises({ personId: id });
  }, [id]);

  const person = people.find(p => p.id === id);
  if (!person) return null;

  const personPromises = promises.filter(p => p.personId === id);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.neutral[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personne</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <PersonAvatar person={person} size={64} />
          <Text style={styles.name}>{person.name}</Text>
          <Text style={styles.type}>
            {PERSON_TYPE_OPTIONS.find(o => o.value === person.type)?.label ?? person.type}
          </Text>
          <View style={styles.weightRow}>
            <Text style={styles.weightLabel}>Importance : </Text>
            {Array.from({ length: person.relationshipWeight }).map((_, i) => (
              <Ionicons key={i} name="star" size={16} color={COLORS.warning.main} />
            ))}
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{personPromises.length}</Text>
              <Text style={styles.statLabel}>Promesses</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Promesses</Text>
        {personPromises.length === 0 ? (
          <EmptyState icon="list-outline" title="Aucune promesse pour cette personne." />
        ) : (
          personPromises.map(p => (
            <PromiseRow key={p.id} promise={p} onPress={pid => router.push(`/promise/${pid}`)} showPerson={false} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm, backgroundColor: COLORS.neutral[0], borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.neutral[100] },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.neutral[900] },
  scroll: { padding: SPACING.base, paddingBottom: SPACING['4xl'], gap: SPACING.md },
  profileCard: { backgroundColor: COLORS.neutral[0], borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm, ...SHADOWS.sm },
  name: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900] },
  type: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[400] },
  weightRow: { flexDirection: 'row', alignItems: 'center' },
  weightLabel: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[500] },
  statsRow: { flexDirection: 'row', gap: SPACING.xl, marginTop: SPACING.sm },
  stat: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900] },
  statLabel: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[400] },
  sectionTitle: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[700], marginTop: SPACING.sm },
});
