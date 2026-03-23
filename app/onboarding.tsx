import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../src/constants/theme';
import { FR } from '../src/constants/strings.fr';
import { Button } from '../src/components/Button';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: '1',
    icon: 'shield-checkmark-outline',
    iconColor: COLORS.primary[600],
    bg: COLORS.primary[50],
    ...FR.onboarding.slide1,
  },
  {
    key: '2',
    icon: 'heart-circle-outline',
    iconColor: '#EC4899',
    bg: '#FDF2F8',
    ...FR.onboarding.slide2,
  },
  {
    key: '3',
    icon: 'flash-outline',
    iconColor: '#F59E0B',
    bg: '#FFFBEB',
    ...FR.onboarding.slide3,
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const { setOnboardingCompleted } = useSettingsStore();

  const handleNext = async () => {
    if (current < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: current + 1 });
      setCurrent(current + 1);
    } else {
      await setOnboardingCompleted();
      router.replace('/(tabs)');
    }
  };

  const handleSkip = async () => {
    await setOnboardingCompleted();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon as any} size={80} color={item.iconColor} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
        onMomentumScrollEnd={e => {
          setCurrent(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title={SLIDES[current].cta}
          onPress={handleNext}
          fullWidth
          size="lg"
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutral[0] },
  skipBtn: { position: 'absolute', top: SPACING.xl, right: SPACING.lg, zIndex: 10, padding: SPACING.sm },
  skipText: { color: COLORS.neutral[400], fontSize: FONT_SIZE.base },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING['2xl'], gap: SPACING.xl },
  iconWrap: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold, color: COLORS.neutral[900], textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.neutral[500], textAlign: 'center', lineHeight: 26 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.xs, marginBottom: SPACING.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.neutral[200] },
  dotActive: { width: 24, backgroundColor: COLORS.primary[600] },
  footer: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl },
  btn: {},
});
