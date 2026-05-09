import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && user) router.replace('/(tabs)/dashboard');
  }, [loading, user]);

  if (loading) {
    return (
      <View style={s.loadingContainer}>
        <Image source={require('../assets/images/logo.jpg')} style={s.loadingLogo} resizeMode="contain" />
      </View>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        {/* Hero Section with Logo */}
        <View style={s.heroSection}>
          <View style={s.logoWrapper}>
            <Image source={require('../assets/images/logo.jpg')} style={s.logo} resizeMode="contain" />
          </View>
          <Text style={s.tagline}>India's #1 AI-Powered{"\n"}Engineering Counseling Platform</Text>
        </View>

        {/* Features Grid */}
        <View style={s.features}>
          <View style={s.featureRow}>
            <View style={s.featureItem}>
              <View style={s.featureIconBg}>
                <Ionicons name="school-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={s.featureText}>IIT/NIT Mentors</Text>
            </View>
            <View style={s.featureItem}>
              <View style={s.featureIconBg}>
                <Ionicons name="sparkles-outline" size={22} color={COLORS.primaryMedium} />
              </View>
              <Text style={s.featureText}>AI Predictor</Text>
            </View>
          </View>
          <View style={s.featureRow}>
            <View style={s.featureItem}>
              <View style={s.featureIconBg}>
                <Ionicons name="business-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={s.featureText}>200+ Colleges</Text>
            </View>
            <View style={s.featureItem}>
              <View style={s.featureIconBg}>
                <Ionicons name="chatbubbles-outline" size={22} color={COLORS.primaryMedium} />
              </View>
              <Text style={s.featureText}>24/7 AI Chat</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={s.actions}>
          <TouchableOpacity 
            testID="get-started-btn" 
            style={s.primaryButton} 
            onPress={() => router.push('/(auth)/register')} 
            activeOpacity={0.85}
          >
            <Text style={s.primaryButtonText}>Get Started</Text>
            <View style={s.buttonArrow}>
              <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            testID="login-btn" 
            style={s.secondaryButton} 
            onPress={() => router.push('/(auth)/login')} 
            activeOpacity={0.8}
          >
            <Text style={s.secondaryButtonText}>Already have an account? <Text style={s.signInText}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.primaryLight 
  },
  loadingContainer: { 
    flex: 1, 
    backgroundColor: COLORS.primaryLight, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  loadingLogo: {
    width: 200,
    height: 200,
  },
  content: { 
    flex: 1, 
    paddingHorizontal: SPACING.lg, 
    justifyContent: 'space-between', 
    paddingVertical: SPACING.xxl 
  },
  heroSection: { 
    alignItems: 'center', 
    marginTop: SPACING.xl 
  },
  logoWrapper: {
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 180,
    height: 180,
  },
  tagline: { 
    ...TYPOGRAPHY.body, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    lineHeight: 26,
    fontSize: 16,
  },
  features: { 
    gap: SPACING.md 
  },
  featureRow: { 
    flexDirection: 'row', 
    gap: SPACING.md 
  },
  featureItem: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.sm, 
    backgroundColor: COLORS.surfaceElevated, 
    padding: SPACING.md, 
    borderRadius: RADIUS.md, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  featureIconBg: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { 
    ...TYPOGRAPHY.body, 
    fontWeight: '500', 
    color: COLORS.textPrimary, 
    fontSize: 13,
    flex: 1,
  },
  actions: { 
    gap: SPACING.md 
  },
  primaryButton: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.primary, 
    paddingVertical: 18, 
    paddingHorizontal: SPACING.xl, 
    borderRadius: RADIUS.pill, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  primaryButtonText: { 
    ...TYPOGRAPHY.body, 
    color: COLORS.textInverse, 
    fontWeight: '600', 
    fontSize: 17 
  },
  buttonArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: { 
    paddingVertical: SPACING.md, 
    alignItems: 'center' 
  },
  secondaryButtonText: { 
    ...TYPOGRAPHY.body, 
    color: COLORS.textSecondary, 
    fontWeight: '400' 
  },
  signInText: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
