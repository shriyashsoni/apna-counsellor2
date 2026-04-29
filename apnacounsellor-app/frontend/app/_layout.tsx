import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Constants from 'expo-constants';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || 'https://brazen-caterpillar-18.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="mentor/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="booking/[mentorId]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="college/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="predictor" options={{ presentation: 'modal' }} />
          <Stack.Screen name="compare" options={{ presentation: 'modal' }} />
          <Stack.Screen name="batch/[id]" options={{ presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </ConvexProvider>
  );
}
