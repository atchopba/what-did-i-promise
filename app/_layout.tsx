import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDatabase } from '../src/hooks/useDatabase';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { COLORS } from '../src/constants/theme';
import { FR } from '../src/constants/strings.fr';

export default function RootLayout() {
  const { isReady, error } = useDatabase();
  const { loadSettings, onboardingCompleted } = useSettingsStore();

  useEffect(() => {
    if (isReady) {
      loadSettings();
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{FR.errors.dbInit}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="promise/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="promise/create" options={{ presentation: 'modal' }} />
          <Stack.Screen name="person/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="modal/checkin" options={{ presentation: 'modal' }} />
          <Stack.Screen name="modal/paywall" options={{ presentation: 'modal' }} />
          <Stack.Screen name="modal/snooze" options={{ presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.neutral[50], gap: 12 },
  loadingText: { color: COLORS.neutral[500], fontSize: 16 },
  errorText: { color: COLORS.error.main, fontSize: 16, textAlign: 'center', paddingHorizontal: 24 },
});
