import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE } from '../../src/constants/theme';
import { FR } from '../../src/constants/strings.fr';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary[600],
        tabBarInactiveTintColor: COLORS.neutral[400],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.neutral[100],
          backgroundColor: COLORS.neutral[0],
          height: 58,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: FR.tabs.home,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="promises"
        options={{
          title: FR.tabs.promises,
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: FR.tabs.people,
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: FR.tabs.stats,
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: FR.tabs.settings,
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
