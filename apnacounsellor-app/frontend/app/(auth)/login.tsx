import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/dashboard');
    } catch (e: any) {
      setError(e.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your premium academic portal</Text>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, loading && styles.disabledBtn]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Sign In</Text>
                <Ionicons name="chevron-forward" size={18} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.googleBtn} 
            onPress={async () => {
              const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: 'apnacounsellor://google-auth',
                }
              });
              if (error) Alert.alert('Error', error.message);
            }}
          >
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Apna Counsellor?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  flex: { flex: 1 },
  scroll: { padding: 24, flexGrow: 1 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 32, ...SHADOWS.sm },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#1E1B4B', fontFamily: 'Lexend_800ExtraBold' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 8, fontFamily: 'Inter_400Regular' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#FEE2E2' },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  form: { gap: 24, marginBottom: 32 },
  inputWrapper: { gap: 8 },
  label: { fontSize: 12, fontWeight: '700', color: '#4F46E5', letterSpacing: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, height: 60, ...SHADOWS.sm },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#1E1B4B', fontFamily: 'Inter_500Medium' },
  eyeBtn: { padding: 8 },
  submitBtn: { height: 60, backgroundColor: '#4F46E5', borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...SHADOWS.md },
  disabledBtn: { opacity: 0.7 },
  submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700', fontFamily: 'Lexend_700Bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { color: '#94A3B8', fontSize: 12, fontWeight: '700' },
  googleBtn: { height: 60, backgroundColor: '#FFF', borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 1, borderColor: '#E2E8F0', ...SHADOWS.sm },
  googleBtnText: { color: '#1E1B4B', fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 'auto', paddingVertical: 24 },
  footerText: { fontSize: 15, color: '#64748B', fontFamily: 'Inter_400Regular' },
  linkText: { fontSize: 15, color: '#4F46E5', fontWeight: '700', fontFamily: 'Lexend_700Bold' },
});
