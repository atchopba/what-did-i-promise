import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePromiseStore } from '../../src/store/usePromiseStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';
import { StatusBadge, PriorityBadge, RiskBadge } from '../../src/components/Badge';
import { TimelineItem } from '../../src/components/TimelineItem';
import { ReminderPill } from '../../src/components/ReminderPill';
import { PersonAvatar } from '../../src/components/PersonAvatar';
import { Button } from '../../src/components/Button';
import { PromiseStatus } from '../../src/types';
import { sharePromise } from '../../src/services/PromiseService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PromiseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentPromise, loadPromiseDetail, complete, snooze, archive, addNote, lastFeedback, clearFeedback } = usePromiseStore();
  const [noteText, setNoteText] = useState('');
  const [showSnooze, setShowSnooze] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (id) loadPromiseDetail(id);
  }, [id]);

  useEffect(() => {
    if (lastFeedback) {
      setShowFeedback(true);
      const t = setTimeout(() => {
        setShowFeedback(false);
        clearFeedback();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [lastFeedback]);

  if (!currentPromise) return null;

  const p = currentPromise;

  const handleComplete = async () => {
    await complete(p.id);
    router.back();
  };

  const handleSnooze = async (days: number) => {
    const until = new Date(Date.now() + days * 86400000).toISOString();
    await snooze(p.id, until);
    setShowSnooze(false);
  };

  const handleArchive = () => {
    Alert.alert('', FR.confirm.archive, [
      { text: FR.confirm.no, style: 'cancel' },
      { text: FR.confirm.yes, onPress: async () => { await archive(p.id); router.back(); } },
    ]);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await addNote(p.id, noteText.trim());
    setNoteText('');
  };

  const isActive = ![PromiseStatus.TENUE, PromiseStatus.ANNULEE, PromiseStatus.ARCHIVEE].includes(p.status);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.neutral[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{FR.detail.title}</Text>
        <TouchableOpacity onPress={() => sharePromise(p)} style={styles.backBtn}>
          <Ionicons name="share-outline" size={22} color={COLORS.neutral[600]} />
        </TouchableOpacity>
      </View>

      {showFeedback && lastFeedback && (
        <View style={styles.feedbackToast}>
          <Text style={styles.feedbackText}>{lastFeedback}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.titleCard}>
          <Text style={styles.promiseTitle}>{p.title}</Text>
          <View style={styles.badgesRow}>
            <StatusBadge status={p.status} />
            <PriorityBadge priority={p.priority} />
            {p.riskScore > 30 && <RiskBadge score={p.riskScore} />}
          </View>
          {p.person && <PersonAvatar person={p.person} size={28} showName />}
          {p.dueDate && (
            <View style={styles.dueRow}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.neutral[400]} />
              <Text style={styles.dueText}>{format(new Date(p.dueDate), 'dd MMMM yyyy', { locale: fr })}</Text>
            </View>
          )}
        </View>

        {isActive && (
          <View style={styles.actions}>
            <Button title="Tenue ✓" onPress={handleComplete} style={styles.actionBtn} />
            <Button title="Reporter" variant="secondary" onPress={() => setShowSnooze(true)} style={styles.actionBtn} />
            <Button title="Archiver" variant="ghost" onPress={handleArchive} style={styles.actionBtn} />
          </View>
        )}

        {p.reminders && p.reminders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{FR.detail.reminders}</Text>
            {p.reminders.map(r => <ReminderPill key={r.id} reminder={r} />)}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{FR.detail.notes}</Text>
          {p.notes?.map(note => (
            <View key={note.id} style={styles.noteCard}>
              <Text style={styles.noteContent}>{note.content}</Text>
              <Text style={styles.noteDate}>{format(new Date(note.createdAt), 'dd MMM yyyy', { locale: fr })}</Text>
            </View>
          ))}
          {p.notes?.length === 0 && <Text style={styles.emptyNote}>{FR.detail.noNotes}</Text>}
          <View style={styles.noteInput}>
            <TextInput
              style={styles.noteTextInput}
              placeholder={FR.detail.addNotePlaceholder}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              placeholderTextColor={COLORS.neutral[400]}
            />
            <TouchableOpacity onPress={handleAddNote} disabled={!noteText.trim()} style={[styles.sendBtn, !noteText.trim() && styles.sendBtnDisabled]}>
              <Ionicons name="send" size={18} color={noteText.trim() ? COLORS.primary[600] : COLORS.neutral[300]} />
            </TouchableOpacity>
          </View>
        </View>

        {p.events && p.events.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{FR.detail.events}</Text>
            {p.events.map((evt, i) => (
              <TimelineItem key={evt.id} event={evt} isLast={i === (p.events?.length ?? 0) - 1} />
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={showSnooze} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.snoozeCard}>
            <Text style={styles.snoozeTitle}>Reporter à...</Text>
            {[1, 3, 7, 14].map(days => (
              <TouchableOpacity key={days} style={styles.snoozeOption} onPress={() => handleSnooze(days)}>
                <Text style={styles.snoozeOptionText}>
                  {days === 1 ? 'Demain' : days === 3 ? 'Dans 3 jours' : days === 7 ? 'La semaine prochaine' : 'Dans 2 semaines'}
                </Text>
              </TouchableOpacity>
            ))}
            <Button title={FR.confirm.no} variant="ghost" onPress={() => setShowSnooze(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[50] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm, backgroundColor: COLORS.neutral[0], borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.neutral[100] },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold, color: COLORS.neutral[900], textAlign: 'center' },
  feedbackToast: { backgroundColor: COLORS.success.main, padding: SPACING.md, marginHorizontal: SPACING.base, marginTop: SPACING.sm, borderRadius: RADIUS.lg },
  feedbackText: { color: '#fff', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium, textAlign: 'center' },
  scroll: { padding: SPACING.base, paddingBottom: SPACING['4xl'], gap: SPACING.md },
  titleCard: { backgroundColor: COLORS.neutral[0], borderRadius: RADIUS.xl, padding: SPACING.lg, gap: SPACING.sm, ...SHADOWS.sm },
  promiseTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900], lineHeight: 28 },
  badgesRow: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap' },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  dueText: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[500] },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { flex: 1 },
  section: { gap: SPACING.sm },
  sectionTitle: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 0.5 },
  noteCard: { backgroundColor: COLORS.neutral[0], borderRadius: RADIUS.lg, padding: SPACING.md, gap: 4, ...SHADOWS.sm },
  noteContent: { fontSize: FONT_SIZE.base, color: COLORS.neutral[800], lineHeight: 22 },
  noteDate: { fontSize: FONT_SIZE.xs, color: COLORS.neutral[400] },
  emptyNote: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[400], fontStyle: 'italic' },
  noteInput: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: COLORS.neutral[0], borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.neutral[200], paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  noteTextInput: { flex: 1, fontSize: FONT_SIZE.base, color: COLORS.neutral[900], maxHeight: 100, paddingVertical: SPACING.sm },
  sendBtn: { padding: SPACING.sm },
  sendBtnDisabled: { opacity: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  snoozeCard: { backgroundColor: COLORS.neutral[0], borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, gap: SPACING.sm },
  snoozeTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900], marginBottom: SPACING.sm },
  snoozeOption: { padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.neutral[50], borderWidth: 1, borderColor: COLORS.neutral[200] },
  snoozeOptionText: { fontSize: FONT_SIZE.base, color: COLORS.neutral[800], textAlign: 'center' },
});
