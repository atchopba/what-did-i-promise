import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Person } from '../types';
import { FONT_SIZE, FONT_WEIGHT } from '../constants/theme';

interface PersonAvatarProps {
  person: Person;
  size?: number;
  showName?: boolean;
}

const AVATAR_COLORS = [
  '#6366F1', '#EC4899', '#F97316', '#10B981',
  '#3B82F6', '#8B5CF6', '#F59E0B', '#14B8A6',
];

const getColor = (seed: number | null | undefined): string => {
  const idx = ((seed ?? 0) % AVATAR_COLORS.length + AVATAR_COLORS.length) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const getInitials = (name: string): string =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

export const PersonAvatar: React.FC<PersonAvatarProps> = ({ person, size = 32, showName = false }) => {
  const bg = getColor(person.colorSeed);
  const initials = getInitials(person.name);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
        <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
      </View>
      {showName && (
        <Text style={[styles.name, { fontSize: Math.max(FONT_SIZE.xs, size * 0.42) }]}>
          {person.name}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#fff', fontWeight: FONT_WEIGHT.bold },
  name: { color: '#374151', fontWeight: FONT_WEIGHT.medium },
});
