import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Reminder } from '../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../constants/theme';

interface ReminderPillProps {
  reminder: Reminder;
  onDelete?: (id: string) => void;
}

export const ReminderPill: React.FC<ReminderPillProps> = ({ reminder, onDelete }) => {
  const dateStr = format(new Date(reminder.remindAt), 'dd MMM, HH:mm', { locale: fr });
  const isSent = Boolean(reminder.isSent);
  return (
    <View style={[styles.pill, isSent ? styles.sent : styles.pending]}>
      <Ionicons
        name="notifications-outline"
        size={14}
        color={isSent ? COLORS.neutral[400] : COLORS.primary[600]}
      />
      <Text style={[styles.label, isSent && styles.sentLabel]}>{dateStr}</Text>
      {onDelete && !isSent && (
        <TouchableOpacity
          onPress={() => onDelete(reminder.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-outline" size={14} color={COLORS.neutral[400]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  pending: { backgroundColor: COLORS.primary[50], borderWidth: 1, borderColor: COLORS.primary[200] },
  sent: { backgroundColor: COLORS.neutral[100] },
  label: { fontSize: FONT_SIZE.xs, color: COLORS.primary[700] },
  sentLabel: { color: COLORS.neutral[400] },
});
