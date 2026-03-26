import { Redirect } from 'expo-router';
import { useSettingsStore } from '../src/store/useSettingsStore';

export default function Index() {
  const { onboardingCompleted } = useSettingsStore();
  return <Redirect href={onboardingCompleted ? '/(tabs)' : '/onboarding'} />;
}
