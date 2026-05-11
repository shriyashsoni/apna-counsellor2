import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: COLORS.primary, 
        tabBarInactiveTintColor: COLORS.textMuted, 
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          borderTopWidth: 0, 
          paddingBottom: Platform.OS === 'ios' ? 24 : 12, 
          paddingTop: 12, 
          height: Platform.OS === 'ios' ? 90 : 70,
          ...SHADOWS.lg,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }, 
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 4 } 
      }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "grid" : "grid-outline"} size={24} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="ai-chat" 
        options={{ 
          title: 'Copilot', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "sparkles" : "sparkles-outline"} size={24} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="mentorship" 
        options={{ 
          title: 'Mentors', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={24} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Account', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          )
        }} 
      />
      <Tabs.Screen name="colleges" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
