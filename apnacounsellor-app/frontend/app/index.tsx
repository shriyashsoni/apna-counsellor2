import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { COLORS, SHADOWS } from '../src/constants/theme';
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Background Element */}
        <View style={styles.bgBlob} />

        <View style={styles.heroSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={60} color="#4F46E5" />
          </View>
          <Text style={styles.title}>Apna{"\n"}Counsellor</Text>
          <Text style={styles.tagline}>India's Premier AI-Powered Engineering Counseling Platform</Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: 'sparkles', text: 'AI Rank Analysis', color: '#4F46E5' },
            { icon: 'people', text: 'IIT/NIT Mentors', color: '#10B981' },
            { icon: 'analytics', text: 'College Predictor', color: '#F59E0B' }
          ].map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: f.color + '20' }]}>
                <Ionicons name={f.icon as any} size={20} color={f.color} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>Already have an account? <Text style={styles.boldText}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: 32, justifyContent: 'space-between' },
  bgBlob: { position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#4F46E510' },
  heroSection: { marginTop: 60, alignItems: 'center' },
  logoCircle: { width: 120, height: 120, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', ...SHADOWS.lg, marginBottom: 24 },
  title: { fontSize: 42, fontWeight: '900', color: '#1E1B4B', textAlign: 'center', fontFamily: 'Lexend_800ExtraBold', lineHeight: 48 },
  tagline: { fontSize: 16, color: '#64748B', textAlign: 'center', marginTop: 16, fontFamily: 'Inter_400Regular', lineHeight: 24 },
  features: { gap: 16, marginVertical: 40 },
  featureItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, ...SHADOWS.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  featureIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  featureText: { fontSize: 15, fontWeight: '700', color: '#1E1B4B', fontFamily: 'Lexend_700Bold' },
  actions: { gap: 16, marginBottom: 20 },
  primaryBtn: { height: 64, backgroundColor: '#4F46E5', borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, ...SHADOWS.md },
  primaryBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800', fontFamily: 'Lexend_800ExtraBold' },
  secondaryBtn: { alignItems: 'center', paddingVertical: 12 },
  secondaryBtnText: { fontSize: 15, color: '#64748B', fontFamily: 'Inter_400Regular' },
  boldText: { fontWeight: '700', color: '#4F46E5' },
});
