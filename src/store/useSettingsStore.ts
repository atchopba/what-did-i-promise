import { create } from 'zustand';
import { FeatureFlags } from '../types';
import { settingsRepository } from '../repositories/SettingsRepository';
import { FREE_TIER_LIMITS, PREMIUM_FEATURES } from '../constants';
import { scheduleCheckinReminder, cancelAllNotifications } from '../services/NotificationService';

interface SettingsStore {
  isPremium: boolean;
  onboardingCompleted: boolean;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  featureFlags: FeatureFlags;
  isLoading: boolean;

  loadSettings: () => Promise<void>;
  setOnboardingCompleted: () => Promise<void>;
  toggleBiometric: (enabled: boolean) => Promise<void>;
  toggleNotifications: (enabled: boolean) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
}

const buildFeatureFlags = (isPremium: boolean): FeatureFlags => {
  if (isPremium) {
    return {
      maxActivePromises: null,
      maxPeople: null,
      maxRemindersPerPromise: 10,
      advancedRiskView: true,
      fullHistory: true,
      customTemplates: true,
      exportLocal: true,
      advancedFilters: true,
      detailedReliabilityScore: true,
      recurringPromises: true,
      customTags: true,
    };
  }
  return {
    maxActivePromises: FREE_TIER_LIMITS.maxActivePromises,
    maxPeople: FREE_TIER_LIMITS.maxPeople,
    maxRemindersPerPromise: FREE_TIER_LIMITS.maxRemindersPerPromise,
    advancedRiskView: false,
    fullHistory: false,
    customTemplates: false,
    exportLocal: false,
    advancedFilters: false,
    detailedReliabilityScore: false,
    recurringPromises: false,
    customTags: false,
  };
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  isPremium: false,
  onboardingCompleted: false,
  biometricEnabled: false,
  notificationsEnabled: true,
  featureFlags: buildFeatureFlags(false),
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const [premium, onboarding, biometric, notifications] = await Promise.all([
        settingsRepository.getBool('is_premium', false),
        settingsRepository.getBool('onboarding_completed', false),
        settingsRepository.getBool('biometric_enabled', false),
        settingsRepository.getBool('notifications_enabled', true),
      ]);
      set({
        isPremium: premium,
        onboardingCompleted: onboarding,
        biometricEnabled: biometric,
        notificationsEnabled: notifications,
        featureFlags: buildFeatureFlags(premium),
        isLoading: false,
      });
    } catch (e: any) {
      set({ isLoading: false });
    }
  },

  setOnboardingCompleted: async () => {
    await settingsRepository.setBool('onboarding_completed', true);
    set({ onboardingCompleted: true });
    // Schedule daily check-in
    await scheduleCheckinReminder();
  },

  toggleBiometric: async (enabled: boolean) => {
    await settingsRepository.setBool('biometric_enabled', enabled);
    set({ biometricEnabled: enabled });
  },

  toggleNotifications: async (enabled: boolean) => {
    await settingsRepository.setBool('notifications_enabled', enabled);
    set({ notificationsEnabled: enabled });
    if (!enabled) {
      await cancelAllNotifications();
    } else {
      await scheduleCheckinReminder();
    }
  },

  upgradeToPremium: async () => {
    await settingsRepository.setBool('is_premium', true);
    set({ isPremium: true, featureFlags: buildFeatureFlags(true) });
  },
}));
