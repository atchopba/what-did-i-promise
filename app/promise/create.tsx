import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePromiseStore } from '../../src/store/usePromiseStore';
import { usePersonStore } from '../../src/store/usePersonStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';
import { Button } from '../../src/components/Button';
import { ContextType, PromisePriority, DuePrecision } from '../../src/types';
import { CONTEXT_OPTIONS, PRIORITY_OPTIONS } from '../../src/constants/datasets';
import { addDays } from 'date-fns';

const DUE_PRECISION_OPTIONS = [
  { value: DuePrecision.AUJOURD_HUI, label: "Aujourd'hui", days: 0 },
  { value: DuePrecision.DEMAIN, label: 'Demain', days: 1 },
  { value: DuePrecision.CETTE_SEMAINE, label: 'Cette semaine', days: 7 },
  { value: DuePrecision.CE_MOIS, label: 'Ce mois', days: 30 },
  { value: DuePrecision.AUCUNE, label: 'Sans date', days: null },
];

export default function CreatePromiseScreen() {
  const { create, isLoading } = usePromiseStore();
  const { people, loadPeople } = usePersonStore();

  const [title, setTitle] = useState('');
  const [personId, setPersonId] = useState<string | null>(null);
  const [context, setContext] = useState<ContextType>(ContextType.PERSONNEL);
  const [priority, setPriority] = useState<PromisePriority>(PromisePriority.NORMALE);
  const [duePrecision, setDuePrecision] = useState<DuePrecision>(DuePrecision.AUCUNE);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => { loadPeople(); }, []);

  const getDueDate = (): string | null => {
    const opt = DUE_PRECISION_OPTIONS.find(o => o.value === duePrecision);
    if (!opt || opt.days === null) return null;
    return addDays(new Date(), opt.days).toISOString();
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('', FR.capture.errorEmpty);
      return;
    }
    const dueDate = getDueDate();
    const reminderAt = dueDate && reminderEnabled ? dueDate : null;
    await create({
      title: title.trim(),
      personId,
      contextType: context,
      priority,
      dueDate,
      duePrecision,
      reminderEnabled: reminderEnabled && !!reminderAt,
      reminderAt,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close-outline" size={26} color={COLORS.neutral[600]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{FR.capture.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.field}>
          <Text style={styles.label}>{FR.capture.titleLabel}</Text>
          <TextInput
            style={styles.input}
            placeholder={FR.capture.titlePlaceholder}
            value={title}
            onChangeText={setTitle}
            multiline
            numberOfLines={3}
            autoFocus
            placeholderTextColor={COLORS.neutral[400]}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{FR.capture.personLabel}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <TouchableOpacity style={[styles.chip, personId === null && styles.chipSelected]} onPress={() => setPersonId(null)}>
              <Text style={[styles.chipText, personId === null && styles.chipTextSelected]}>Aucune</Text>
            </TouchableOpacity>
            {people.map(p => (
              <TouchableOpacity key={p.id} style={[styles.chip, personId === p.id && styles.chipSelected]} onPress={() => setPersonId(p.id)}>
                <Text style={[styles.chipText, personId === p.id && styles.chipTextSelected]}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{FR.capture.dueDateLabel}</Text>
          <View style={styles.chipRow}>
            {DUE_PRECISION_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.value} style={[styles.chip, duePrecision === opt.value && styles.chipSelected]} onPress={() => setDuePrecision(opt.value)}>
                <Text style={[styles.chipText, duePrecision === opt.value && styles.chipTextSelected]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{FR.capture.priorityLabel}</Text>
          <View style={styles.chipRow}>
            {PRIORITY_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.value} style={[styles.chip, priority === opt.value && { borderColor: opt.color, backgroundColor: opt.color + '15' }]} onPress={() => setPriority(opt.value)}>
                <Text style={[styles.chipText, priority === opt.value && { color: opt.color, fontWeight: FONT_WEIGHT.semibold }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{FR.capture.contextLabel}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {CONTEXT_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.value} style={[styles.chip, context === opt.value && { borderColor: opt.color, backgroundColor: opt.color + '15' }]} onPress={() => setContext(opt.value)}>
                <Text style={[styles.chipText, context === opt.value && { color: opt.color }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {duePrecision !== DuePrecision.AUCUNE && (
          <TouchableOpacity style={[styles.reminderToggle, reminderEnabled && styles.reminderToggleOn]} onPress={() => setReminderEnabled(!reminderEnabled)}>
            <Ionicons name={reminderEnabled ? 'notifications' : 'notifications-outline'} size={20} color={reminderEnabled ? COLORS.primary[600] : COLORS.neutral[400]} />
            <Text style={[styles.reminderText, reminderEnabled && styles.reminderTextOn]}>{FR.capture.reminderLabel}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title={FR.capture.cta} onPress={handleCreate} fullWidth size="lg" loading={isLoading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[0] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.neutral[100] },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.neutral[900] },
  scroll: { padding: SPACING.base, paddingBottom: SPACING['3xl'], gap: SPACING.lg },
  field: { gap: SPACING.sm },
  label: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.neutral[700] },
  input: { borderWidth: 1, borderColor: COLORS.neutral[200], borderRadius: RADIUS.lg, padding: SPACING.md, fontSize: FONT_SIZE.base, color: COLORS.neutral[900], minHeight: 80 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chips: { gap: SPACING.xs, paddingVertical: 2 },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.neutral[200], backgroundColor: COLORS.neutral[50] },
  chipSelected: { borderColor: COLORS.primary[600], backgroundColor: COLORS.primary[50] },
  chipText: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[600] },
  chipTextSelected: { color: COLORS.primary[700], fontWeight: FONT_WEIGHT.semibold },
  reminderToggle: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.neutral[200] },
  reminderToggleOn: { borderColor: COLORS.primary[200], backgroundColor: COLORS.primary[50] },
  reminderText: { fontSize: FONT_SIZE.base, color: COLORS.neutral[500] },
  reminderTextOn: { color: COLORS.primary[700] },
  footer: { padding: SPACING.base, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.neutral[100] },
});
