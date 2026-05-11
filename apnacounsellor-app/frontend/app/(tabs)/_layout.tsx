import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: COLORS.primary, 
        tabBarInactiveTintColor: COLORS.textMuted, 
        tabBarStyle: { 
          backgroundColor: COLORS.background, 
          borderTopColor: COLORS.borderLight, 
          borderTopWidth: 1, 
          paddingBottom: 8, 
          paddingTop: 8, 
          height: 65,
          ...SHADOWS.sm,
        }, 
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' } 
      }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconBg : undefined}>
              <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="ai-chat" 
        options={{ 
          title: 'AI Bot', 
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconBg : undefined}>
              <Ionicons name={focused ? "sparkles" : "sparkles-outline"} size={22} color={color} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="mentorship" 
        options={{ 
          title: 'Mentors', 
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconBg : undefined}>
              <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconBg : undefined}>
              <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
            </View>
          )
        }} 
      />
      <Tabs.Screen name="colleges" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />

    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconBg: {
    backgroundColor: COLORS.overlayLight,
    borderRadius: 12,
    padding: 6,
  },
});
