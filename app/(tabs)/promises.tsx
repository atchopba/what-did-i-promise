import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePromiseStore } from '../../src/store/usePromiseStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';
import { PromiseRow } from '../../src/components/PromiseRow';
import { FilterChips } from '../../src/components/FilterChips';
import { EmptyState } from '../../src/components/EmptyState';
import { SectionHeader } from '../../src/components/SectionHeader';
import { STATUS_OPTIONS } from '../../src/constants/datasets';
import { TimeSection } from '../../src/types';

export default function PromisesScreen() {
  const { sections, isLoading, loadPromises, complete } = usePromiseStore();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => { loadPromises(); }, []);

  const filteredSections: TimeSection[] = selectedStatuses.length === 0
    ? sections
    : sections.map(s => ({
        ...s,
        data: s.data.filter(p => selectedStatuses.includes(p.status)),
      })).filter(s => s.data.length > 0);

  const toggleStatus = (val: string) => {
    setSelectedStatuses(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  const isEmpty = filteredSections.every(s => s.data.length === 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{FR.promises.title}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/promise/create')}>
          <Ionicons name="add" size={24} color={COLORS.primary[600]} />
        </TouchableOpacity>
      </View>

      <FilterChips
        options={STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label, color: s.color }))}
        selected={selectedStatuses}
        onToggle={toggleStatus}
      />

      {isEmpty ? (
        <EmptyState
          icon="checkmark-circle-outline"
          title={selectedStatuses.length > 0 ? FR.promises.emptyFiltered : FR.promises.empty}
          actionLabel={FR.home.cta}
          onAction={() => router.push('/promise/create')}
        />
      ) : (
        <FlatList
          data={filteredSections}
          keyExtractor={s => s.key}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => loadPromises()} />}
          contentContainerStyle={styles.list}
          renderItem={({ item: section }) => (
            <View>
              <SectionHeader title={section.title} count={section.data.length} />
              {section.data.map(promise => (
                <PromiseRow
                  key={promise.id}
                  promise={promise}
                  onPress={id => router.push(`/promise/${id}`)}
                  onComplete={id => complete(id)}
                />
              ))}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md },
  title: { fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900] },
  addBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  list: { paddingBottom: SPACING['3xl'] },
});
