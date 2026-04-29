import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const ROLES = [
  { key: 'student', label: 'Student', icon: 'school-outline' as const, desc: 'Get guidance & mentorship' },
  { key: 'mentor', label: 'Mentor', icon: 'people-outline' as const, desc: 'Help students & earn' },
];

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, role);
      router.replace('/(tabs)/dashboard');
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity testID="back-btn" style={styles.backBtn} onPress={() => step === 1 ? router.back() : setStep(1)}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: step === 1 ? '50%' : '100%' }]} />
          </View>

          {step === 1 ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Join Apna Counselor</Text>
                <Text style={styles.subtitle}>Choose your role to get started</Text>
              </View>

              <View style={styles.rolesContainer}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    testID={`role-${r.key}-btn`}
                    style={[styles.roleCard, role === r.key && styles.roleCardActive]}
                    onPress={() => setRole(r.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={r.icon} size={32} color={role === r.key ? COLORS.textInverse : COLORS.primary} />
                    <Text style={[styles.roleTitle, role === r.key && styles.roleTitleActive]}>{r.label}</Text>
                    <Text style={[styles.roleDesc, role === r.key && styles.roleDescActive]}>{r.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                testID="register-next-btn"
                style={styles.submitBtn}
                onPress={() => {
                  if (role === 'mentor') {
                    router.push('/(auth)/mentor-register');
                  } else {
                    setStep(2);
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>{role === 'mentor' ? 'Become a Mentor' : 'Continue'}</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.textInverse} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Fill in your details as a {role}</Text>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                  <Text testID="register-error" style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <TextInput
                    testID="register-name-input"
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.textSecondary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL</Text>
                  <TextInput
                    testID="register-email-input"
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={COLORS.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <TextInput
                    testID="register-password-input"
                    style={styles.input}
                    placeholder="Min 6 characters"
                    placeholderTextColor={COLORS.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                testID="register-submit-btn"
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.textInverse} />
                ) : (
                  <Text style={styles.submitBtnText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity testID="goto-login" style={styles.linkBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Sign In</Text></Text>
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
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  progressBar: { height: 3, backgroundColor: COLORS.border, borderRadius: 2, marginBottom: SPACING.xl },
  progressFill: { height: 3, backgroundColor: COLORS.primary, borderRadius: 2 },
  header: { marginBottom: SPACING.xl },
  title: { ...TYPOGRAPHY.h1, color: COLORS.primary, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.errorLight, padding: SPACING.md, borderRadius: RADIUS.sm, marginBottom: SPACING.md },
  errorText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontSize: 13 },
  rolesContainer: { gap: SPACING.md, marginBottom: SPACING.xl },
  roleCard: { padding: SPACING.lg, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background, gap: SPACING.sm, ...SHADOWS.sm },
  roleCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, ...SHADOWS.md },
  roleTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  roleTitleActive: { color: COLORS.textInverse },
  roleDesc: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  roleDescActive: { color: 'rgba(255,255,255,0.7)' },
  form: { gap: SPACING.lg, marginBottom: SPACING.xl },
  inputGroup: { gap: SPACING.xs },
  inputLabel: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, fontSize: 12 },
  input: { height: 56, backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, fontSize: 16, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  submitBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.md, ...SHADOWS.md },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { ...TYPOGRAPHY.body, color: COLORS.textInverse, fontWeight: '600', fontSize: 17 },
  linkBtn: { alignItems: 'center', paddingVertical: SPACING.md },
  linkText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  linkBold: { fontWeight: '700', color: COLORS.primary },
});
