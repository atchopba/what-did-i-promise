import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import { PromiseEvent, EventType } from '../types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

const EVENT_CONFIG: Record<EventType, { icon: string; color: string; label: string }> = {
  [EventType.CREATED]: { icon: 'add-circle-outline', color: COLORS.primary[500], label: 'Créée' },
  [EventType.UPDATED]: { icon: 'pencil-outline', color: COLORS.neutral[400], label: 'Modifiée' },
  [EventType.STATUS_CHANGED]: { icon: 'swap-horizontal-outline', color: COLORS.warning.main, label: 'Statut changé' },
  [EventType.NOTE_ADDED]: { icon: 'document-text-outline', color: COLORS.info.main, label: 'Note ajoutée' },
  [EventType.REMINDER_SET]: { icon: 'notifications-outline', color: COLORS.success.main, label: 'Rappel défini' },
  [EventType.VIEWED]: { icon: 'eye-outline', color: COLORS.neutral[300], label: 'Consultée' },
  [EventType.SNOOZED]: { icon: 'calendar-outline', color: COLORS.warning.main, label: 'Reportée' },
  [EventType.COMPLETED]: { icon: 'checkmark-circle', color: COLORS.success.main, label: 'Tenue ✓' },
  [EventType.ARCHIVED]: { icon: 'archive-outline', color: COLORS.neutral[400], label: 'Archivée' },
  [EventType.SHARED]: { icon: 'share-outline', color: COLORS.primary[500], label: 'Partagée' },
};

interface TimelineItemProps {
  event: PromiseEvent;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ event, isLast }) => {
  const cfg = EVENT_CONFIG[event.eventType] ?? EVENT_CONFIG[EventType.UPDATED];
  const timeAgo = formatDistanceToNow(new Date(event.createdAt), { addSuffix: true, locale: fr });

  return (
    <View style={styles.row}>
      <View style={styles.line}>
        <View style={[styles.dot, { backgroundColor: cfg.color }]}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Ionicons name={cfg.icon as any} size={12} color="#fff" />
        </View>
        {!isLast && <View style={styles.connector} />}
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{cfg.label}</Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: SPACING.sm, minHeight: 44 },
  line: { alignItems: 'center', width: 28 },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  connector: { flex: 1, width: 2, backgroundColor: COLORS.neutral[200], marginVertical: 2 },
  content: { flex: 1, paddingTop: 2 },
  label: { fontSize: FONT_SIZE.sm, color: COLORS.neutral[700] },
  time: { fontSize: FONT_SIZE.xs, color: COLORS.neutral[400], marginTop: 2 },
});
