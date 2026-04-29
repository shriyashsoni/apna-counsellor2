import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { apiCall } from '../../src/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../src/context/AuthContext';

export default function MentorRegister() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: '',
    branch: '',
    year: '',
    linkedin: '',
    termsAccepted: false,
  });

  const handleSubmit = async () => {
    setError('');
    
    // Validation
    if (!form.name || !form.email || !form.phone || !form.password || !form.college || !form.branch || !form.year) {
      setError('Please fill all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!form.termsAccepted) {
      setError('Please accept terms and conditions');
      return;
    }
    
    setLoading(true);
    try {
      const data = await apiCall('/auth/register/mentor', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          college: form.college,
          course: form.course,
          branch: form.branch,
          year: form.year,
          linkedin: form.linkedin,
          terms_accepted: form.termsAccepted,
        }),
      });
      
      await AsyncStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) await AsyncStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);
      
      // Go to onboarding
      router.replace('/mentor-onboarding');
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <View style={s.header}>
            <Text style={s.title}>Become a Mentor</Text>
            <Text style={s.subtitle}>Share your knowledge and earn</Text>
          </View>
          
          {error ? (
            <View style={s.errorBox}>
              <Ionicons name="alert-circle" size={18} color={COLORS.error} />
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={s.form}>
            <View style={s.inputGroup}>
              <Text style={s.label}>Full Name *</Text>
              <TextInput
                style={s.input}
                placeholder="Your full name"
                placeholderTextColor={COLORS.textMuted}
                value={form.name}
                onChangeText={(v) => setForm({...form, name: v})}
              />
            </View>
            
            <View style={s.inputGroup}>
              <Text style={s.label}>Email Address *</Text>
              <TextInput
                style={s.input}
                placeholder="your@email.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => setForm({...form, email: v})}
              />
            </View>
            
            <View style={s.inputGroup}>
              <Text style={s.label}>Mobile Number *</Text>
              <TextInput
                style={s.input}
                placeholder="+91 98765 43210"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(v) => setForm({...form, phone: v})}
              />
            </View>
            
            <View style={s.row}>
              <View style={[s.inputGroup, { flex: 1 }]}>
                <Text style={s.label}>Password *</Text>
                <View style={s.passwordContainer}>
                  <TextInput
                    style={s.passwordInput}
                    placeholder="Password"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={!showPassword}
                    value={form.password}
                    onChangeText={(v) => setForm({...form, password: v})}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={s.inputGroup}>
              <Text style={s.label}>Confirm Password *</Text>
              <TextInput
                style={s.input}
                placeholder="Confirm password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(v) => setForm({...form, confirmPassword: v})}
              />
            </View>
            
            <View style={s.divider} />
            <Text style={s.sectionTitle}>College Details</Text>
            
            <View style={s.inputGroup}>
              <Text style={s.label}>College Name *</Text>
              <TextInput
                style={s.input}
                placeholder="e.g., IIT Bombay"
                placeholderTextColor={COLORS.textMuted}
                value={form.college}
                onChangeText={(v) => setForm({...form, college: v})}
              />
            </View>
            
            <View style={s.row}>
              <View style={[s.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                <Text style={s.label}>Course</Text>
                <TextInput
                  style={s.input}
                  placeholder="B.Tech"
                  placeholderTextColor={COLORS.textMuted}
                  value={form.course}
                  onChangeText={(v) => setForm({...form, course: v})}
                />
              </View>
              <View style={[s.inputGroup, { flex: 1 }]}>
                <Text style={s.label}>Branch *</Text>
                <TextInput
                  style={s.input}
                  placeholder="CSE"
                  placeholderTextColor={COLORS.textMuted}
                  value={form.branch}
                  onChangeText={(v) => setForm({...form, branch: v})}
                />
              </View>
            </View>
            
            <View style={s.inputGroup}>
              <Text style={s.label}>Year of Study *</Text>
              <TextInput
                style={s.input}
                placeholder="e.g., 3rd Year"
                placeholderTextColor={COLORS.textMuted}
                value={form.year}
                onChangeText={(v) => setForm({...form, year: v})}
              />
            </View>
            
            <View style={s.inputGroup}>
              <Text style={s.label}>LinkedIn Profile</Text>
              <TextInput
                style={s.input}
                placeholder="linkedin.com/in/yourprofile"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                value={form.linkedin}
                onChangeText={(v) => setForm({...form, linkedin: v})}
              />
            </View>
            
            <TouchableOpacity 
              style={s.checkbox} 
              onPress={() => setForm({...form, termsAccepted: !form.termsAccepted})}
            >
              <View style={[s.checkboxBox, form.termsAccepted && s.checkboxChecked]}>
                {form.termsAccepted && <Ionicons name="checkmark" size={14} color={COLORS.textInverse} />}
              </View>
              <Text style={s.checkboxText}>I agree to the Terms of Service and Privacy Policy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              testID="mentor-register-submit-btn"
              accessibilityRole="button"
              accessibilityLabel="Create Account"
              style={[s.submitBtn, loading && s.submitBtnDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.textInverse} />
              ) : (
                <>
                  <Text style={s.submitBtnText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={20} color={COLORS.textInverse} />
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={s.linkBtn} onPress={() => router.push('/(auth)/login')}>
              <Text style={s.linkText}>Already have an account? <Text style={s.linkBold}>Sign In</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryLight },
  flex: { flex: 1 },
  scroll: { padding: SPACING.lg, paddingBottom: 50 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  header: { marginBottom: SPACING.xl },
  title: { ...TYPOGRAPHY.h1, color: COLORS.primary, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.errorLight, padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.md },
  errorText: { ...TYPOGRAPHY.caption, color: COLORS.error, flex: 1 },
  form: { gap: SPACING.md },
  inputGroup: { gap: SPACING.xs },
  label: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, fontSize: 12 },
  input: { height: 52, backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, fontSize: 16, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  passwordInput: { flex: 1, height: 52, paddingHorizontal: SPACING.md, fontSize: 16, color: COLORS.textPrimary },
  eyeBtn: { padding: SPACING.md },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary, marginBottom: SPACING.sm },
  checkbox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginVertical: SPACING.md },
  checkboxBox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkboxText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, flex: 1, fontSize: 13 },
  submitBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.md, ...SHADOWS.md },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { ...TYPOGRAPHY.body, color: COLORS.textInverse, fontWeight: '600', fontSize: 17 },
  linkBtn: { alignItems: 'center', paddingVertical: SPACING.md },
  linkText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  linkBold: { fontWeight: '700', color: COLORS.primary },
});
