import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

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
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="back-btn" style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={COLORS.error} />
              <Text testID="login-error" style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                testID="login-email-input"
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={COLORS.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  testID="login-password-input"
                  style={styles.passwordInput}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            testID="login-submit-btn"
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textInverse} />
            ) : (
              <Text style={styles.submitBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.line} />
            <Text style={styles.sepText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.googleBtn}
            onPress={() => {/* Google Auth logic */}}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={20} color={COLORS.textPrimary} />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>


          <TouchableOpacity testID="goto-register" style={styles.linkBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryLight },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xl },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  header: { marginBottom: SPACING.xl },
  title: { ...TYPOGRAPHY.h1, color: COLORS.primary, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.errorLight, padding: SPACING.md, borderRadius: RADIUS.sm, marginBottom: SPACING.md },
  errorText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontSize: 13 },
  form: { gap: SPACING.lg, marginBottom: SPACING.xl },
  inputGroup: { gap: SPACING.xs },
  inputLabel: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, fontSize: 12 },
  input: { height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, fontSize: 16, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  passwordInput: { flex: 1, height: 56, paddingHorizontal: SPACING.md, fontSize: 16, color: COLORS.textPrimary },
  eyeBtn: { padding: SPACING.md },
  submitBtn: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md, ...SHADOWS.md },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { ...TYPOGRAPHY.body, color: COLORS.textInverse, fontWeight: '600', fontSize: 17 },
  separator: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.lg, gap: SPACING.md },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  sepText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontWeight: '700' },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background, paddingVertical: 16, borderRadius: RADIUS.pill, gap: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  googleBtnText: { ...TYPOGRAPHY.body, color: COLORS.textPrimary, fontWeight: '600' },
  linkBtn: { alignItems: 'center', paddingVertical: SPACING.md },
  linkText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  linkBold: { fontWeight: '700', color: COLORS.primary },
});
