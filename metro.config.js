const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// AlaSQL's filesystem build pulls in `react-native-fetch-blob` which is not
// available in the browser. We stub it out with an empty module so the web
// bundle resolves without errors.
// Modules within expo-notifications that call requireNativeModule() at load
// time and are unavailable in Expo Go (SDK 53+). We stub them all out so the
// app doesn't crash; local-notification scheduling still works in a dev build.
const EXPO_NOTIFICATIONS_PUSH_STUBS = [
  'DevicePushTokenAutoRegistration',
  'pushTokenAutoRegistration',
  'warnOfExpoGoPushUsage',
  'TopicSubscriptionModule',
  'ServerRegistrationModule',
  'TokenEmitter',
  'getExpoPushTokenAsync',
  'getDevicePushTokenAsync',
  'unregisterForNotificationsAsync',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-fetch-blob') {
    return { type: 'empty' };
  }
  // Stub all push-related expo-notifications files that throw in Expo Go.
  const fromExpoNotifications = context.originModulePath?.includes('expo-notifications');
  if (
    fromExpoNotifications &&
    EXPO_NOTIFICATIONS_PUSH_STUBS.some(name => moduleName.includes(name))
  ) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
