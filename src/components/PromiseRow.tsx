import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import { PromiseWithPerson, PromiseStatus, PromisePriority } from '../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/theme';

import { StatusBadge } from './Badge';
import { PersonAvatar } from './PersonAvatar';

interface PromiseRowProps {
  promise: PromiseWithPerson;
  onPress?: (id: string) => void;
  onComplete?: (id: string) => void;
  showPerson?: boolean;
}

const PRIORITY_COLORS: Record<PromisePriority, string> = {
  faible: COLORS.neutral[300],
  normale: COLORS.primary[400],
  elevee: COLORS.warning.main,
  critique: COLORS.error.main,
};

const formatDueDate = (dueDate: string | null): string | null => {
  if (!dueDate) return null;
  try {
    return formatDistanceToNow(new Date(dueDate), { addSuffix: true, locale: fr });
  } catch {
    return null;
  }
};

export const PromiseRow: React.FC<PromiseRowProps> = ({
  promise,
  onPress,
  onComplete,
  showPerson = true,
}) => {
  const isOverdue =
    promise.status === PromiseStatus.EN_RETARD ||
    (promise.dueDate !== null &&
      new Date(promise.dueDate) < new Date() &&
      promise.status === PromiseStatus.OUVERTE);

  return (
    <TouchableOpacity
      style={[styles.container, isOverdue && styles.overdueContainer]}
      onPress={() => onPress?.(promise.id)}
      activeOpacity={0.75}
    >
      {/* Priority indicator */}
      <View style={[styles.priorityBar, { backgroundColor: PRIORITY_COLORS[promise.priority] }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>
            {promise.title}
          </Text>
          {onComplete && promise.status !== PromiseStatus.TENUE && (
            <TouchableOpacity
              onPress={() => onComplete(promise.id)}
              style={styles.checkBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success.main} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.meta}>
          <StatusBadge status={promise.status} />

          {promise.dueDate && (
            <View style={styles.dueDateRow}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={isOverdue ? COLORS.error.main : COLORS.neutral[400]}
              />
              <Text style={[styles.dueDate, isOverdue && styles.overdueDue]}>
                {formatDueDate(promise.dueDate)}
              </Text>
            </View>
          )}

          {showPerson && promise.person && (
            <PersonAvatar person={promise.person} size={18} showName />
          )}
        </View>

        {promise.notesCount > 0 && (
          <View style={styles.notesRow}>
            <Ionicons name="document-text-outline" size={12} color={COLORS.neutral[400]} />
            <Text style={styles.notesCount}>{promise.notesCount} note(s)</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  overdueContainer: {
    borderWidth: 1,
    borderColor: COLORS.error.light,
  },
  priorityBar: {
    width: 4,
    borderTopLeftRadius: RADIUS.xl,
    borderBottomLeftRadius: RADIUS.xl,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.neutral[900],
    lineHeight: 22,
  },
  checkBtn: { padding: 2 },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dueDate: { fontSize: FONT_SIZE.xs, color: COLORS.neutral[400] },
  overdueDue: { color: COLORS.error.main, fontWeight: FONT_WEIGHT.medium },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  notesCount: { fontSize: FONT_SIZE.xs, color: COLORS.neutral[400] },
});
