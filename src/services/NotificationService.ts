// expo-notifications is lazy-loaded to avoid crashing in Expo Go (SDK 53+
// removed remote push notification support; the module throws at load time
// via its pushTokenAutoRegistration side-effect file).
// Dynamic import inside a try/catch lets us catch that error gracefully.
import { Platform } from 'react-native';
import { FR } from '../constants/strings.fr';
import { settingsRepository } from '../repositories/SettingsRepository';
import { Reminder } from '../types';

type ExpoNotificationsModule = typeof import('expo-notifications');

let _mod: ExpoNotificationsModule | null = null;
let _loadAttempted = false;

async function loadNotifications(): Promise<ExpoNotificationsModule | null> {
  if (Platform.OS === 'web') return null;
  if (_loadAttempted) return _mod;
  _loadAttempted = true;
  try {
    const mod = (await import('expo-notifications')) as ExpoNotificationsModule;
    mod.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    _mod = mod;
  } catch {
    // expo-notifications unavailable (e.g. Expo Go SDK 53+)
    console.warn('expo-notifications not available on this platform/environment.');
    _mod = null;
  }
  return _mod;
}

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const N = await loadNotifications();
  if (!N) return false;
  try {
    const { status: existing } = await N.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await N.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

export const scheduleReminder = async (
  reminder: Reminder,
  promiseTitle: string,
): Promise<string | null> => {
  const N = await loadNotifications();
  if (!N) return null;
  try {
    const enabled = await settingsRepository.getBool('notifications_enabled', true);
    if (!enabled) return null;

    const granted = await requestNotificationPermissions();
    if (!granted) return null;

    const trigger = new Date(reminder.remindAt);
    if (trigger <= new Date()) return null;

    const { SchedulableTriggerInputTypes } = N;
    return await N.scheduleNotificationAsync({
      content: {
        title: 'What Did I Promise?',
        body: promiseTitle,
        data: { reminderId: reminder.id, promiseId: reminder.promiseId },
        sound: true,
      },
      trigger: { type: SchedulableTriggerInputTypes.DATE, date: trigger },
    });
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
};

export const scheduleCheckinReminder = async (): Promise<void> => {
  const N = await loadNotifications();
  if (!N) return;
  try {
    const enabled = await settingsRepository.getBool('notifications_enabled', true);
    if (!enabled) return;

    const existingId = await settingsRepository.get('checkin_notification_id');
    if (existingId) await cancelNotification(existingId);

    const { SchedulableTriggerInputTypes } = N;
    const notificationId = await N.scheduleNotificationAsync({
      content: {
        title: 'What Did I Promise?',
        body: FR.feedback.checkinReminder,
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });

    await settingsRepository.set('checkin_notification_id', notificationId);
  } catch (error) {
    console.error('Failed to schedule checkin reminder:', error);
  }
};

export const scheduleStaleReminder = async (
  promiseId: string,
  promiseTitle: string,
  daysSinceCreation: number,
): Promise<string | null> => {
  const N = await loadNotifications();
  if (!N) return null;
  try {
    const { SchedulableTriggerInputTypes } = N;
    const body = FR.feedback.staleReminder.replace('{days}', String(daysSinceCreation));
    return await N.scheduleNotificationAsync({
      content: {
        title: 'What Did I Promise?',
        body,
        data: { type: 'stale', promiseId },
        sound: true,
      },
      trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 },
    });
  } catch {
    return null;
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  const N = await loadNotifications();
  if (!N) return;
  try {
    await N.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Ignore (notification may already be delivered)
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  const N = await loadNotifications();
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
};
