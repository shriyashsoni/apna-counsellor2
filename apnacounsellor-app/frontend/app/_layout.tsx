import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold, Lexend_800ExtraBold } from '@expo-google-fonts/lexend';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ 
        headerShown: false, 
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#F8FAFC' }
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="mentor/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="booking/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="college/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="predictor" options={{ presentation: 'card' }} />
        <Stack.Screen name="compare" options={{ presentation: 'card' }} />
      </Stack>
    </AuthProvider>
  );
}
