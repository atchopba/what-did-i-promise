import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePersonStore } from '../../src/store/usePersonStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';
import { PersonAvatar } from '../../src/components/PersonAvatar';
import { EmptyState } from '../../src/components/EmptyState';
import { Button } from '../../src/components/Button';
import { Person, PersonType } from '../../src/types';
import { PERSON_TYPE_OPTIONS } from '../../src/constants/datasets';

export default function PeopleScreen() {
  const { people, isLoading, loadPeople, createPerson } = usePersonStore();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<PersonType>(PersonType.AUTRE);

  useEffect(() => { loadPeople(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createPerson({ name: name.trim(), type });
    setName('');
    setType(PersonType.AUTRE);
    setShowModal(false);
  };

  const renderPerson = ({ item }: { item: Person }) => (
    <TouchableOpacity
      style={styles.personRow}
      onPress={() => router.push(`/person/${item.id}`)}
      activeOpacity={0.75}
    >
      <PersonAvatar person={item} size={44} />
      <View style={styles.personInfo}>
        <Text style={styles.personName}>{item.name}</Text>
        <Text style={styles.personType}>
          {PERSON_TYPE_OPTIONS.find(o => o.value === item.type)?.label ?? item.type}
        </Text>
      </View>
      <View style={styles.weightRow}>
        {Array.from({ length: item.relationshipWeight }).map((_, i) => (
          <Ionicons key={i} name="star" size={10} color={COLORS.warning.main} />
        ))}
      </View>
      <Ionicons name="chevron-forward-outline" size={18} color={COLORS.neutral[300]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{FR.people.title}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={24} color={COLORS.primary[600]} />
        </TouchableOpacity>
      </View>

      {people.length === 0 ? (
        <EmptyState icon="people-outline" title={FR.people.empty} actionLabel={FR.people.addPerson} onAction={() => setShowModal(true)} />
      ) : (
        <FlatList data={people} keyExtractor={p => p.id} renderItem={renderPerson} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
      )}

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{FR.people.addPerson}</Text>
            <TextInput
              style={styles.input}
              placeholder={FR.people.namePlaceholder}
              value={name}
              onChangeText={setName}
              autoFocus
              placeholderTextColor={COLORS.neutral[400]}
            />
            <Text style={styles.fieldLabel}>{FR.people.typeLabel}</Text>
            <View style={styles.typeGrid}>
              {PERSON_TYPE_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.typeChip, type === opt.value && styles.typeChipSelected]}
                  onPress={() => setType(opt.value as PersonType)}
                >
                  <Text style={[styles.typeChipText, type === opt.value && styles.typeChipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Button title="Annuler" variant="secondary" onPress={() => setShowModal(false)} style={styles.modalBtn} />
              <Button title="Créer" onPress={handleCreate} style={styles.modalBtn} disabled={!name.trim()} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md },
  title: { fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900] },
  addBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  list: { paddingBottom: SPACING['3xl'] },
  personRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.neutral[0], marginHorizontal: SPACING.base, marginBottom: SPACING.sm, padding: SPACING.md, borderRadius: RADIUS.xl, gap: SPACING.sm, ...SHADOWS.sm },
  personInfo: { flex: 1 },
  personName: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.neutral[900] },
  personType: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[400] },
  weightRow: { flexDirection: 'row', gap: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.neutral[0], borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, gap: SPACING.md },
  modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900] },
  input: { borderWidth: 1, borderColor: COLORS.neutral[200], borderRadius: RADIUS.lg, padding: SPACING.md, fontSize: FONT_SIZE.base, color: COLORS.neutral[900] },
  fieldLabel: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium, color: COLORS.neutral[600] },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  typeChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.neutral[200], backgroundColor: COLORS.neutral[50] },
  typeChipSelected: { borderColor: COLORS.primary[600], backgroundColor: COLORS.primary[50] },
  typeChipText: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[600] },
  typeChipTextSelected: { color: COLORS.primary[700], fontWeight: FONT_WEIGHT.semibold },
  modalActions: { flexDirection: 'row', gap: SPACING.sm, paddingTop: SPACING.sm },
  modalBtn: { flex: 1 },
});
