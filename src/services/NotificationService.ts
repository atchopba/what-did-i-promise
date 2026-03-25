import * as ExpoNotifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';
import { FR } from '../constants/strings.fr';
import { settingsRepository } from '../repositories/SettingsRepository';
import { Reminder } from '../types';

if (Platform.OS !== 'web')
  ExpoNotifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await ExpoNotifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await ExpoNotifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleReminder = async (
  reminder: Reminder,
  promiseTitle: string,
): Promise<string | null> => {
  if (Platform.OS === 'web') return null;
  try {
    const enabled = await settingsRepository.getBool('notifications_enabled', true);
    if (!enabled) return null;

    const granted = await requestNotificationPermissions();
    if (!granted) return null;

    const trigger = new Date(reminder.remindAt);
    if (trigger <= new Date()) return null;

    const notificationId = await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: 'What Did I Promise?',
        body: promiseTitle,
        data: { reminderId: reminder.id, promiseId: reminder.promiseId },
        sound: true,
      },
      trigger: { type: SchedulableTriggerInputTypes.DATE, date: trigger },
    });

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
};

export const scheduleCheckinReminder = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    const enabled = await settingsRepository.getBool('notifications_enabled', true);
    if (!enabled) return;

    // Cancel any existing check-in reminder without touching promise reminders
    const existingId = await settingsRepository.get('checkin_notification_id');
    if (existingId) {
      await cancelNotification(existingId);
    }

    const notificationId = await ExpoNotifications.scheduleNotificationAsync({
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
  if (Platform.OS === 'web') return null;
  try {
    const body = FR.feedback.staleReminder.replace('{days}', String(daysSinceCreation));

    const notificationId = await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: 'What Did I Promise?',
        body,
        data: { type: 'stale', promiseId },
        sound: true,
      },
      trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 }, // Immediate for stale check
    });

    return notificationId;
  } catch {
    return null;
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await ExpoNotifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Ignore errors (notification may already be delivered)
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  await ExpoNotifications.cancelAllScheduledNotificationsAsync();
};
