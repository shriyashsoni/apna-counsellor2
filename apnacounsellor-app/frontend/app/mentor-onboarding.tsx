import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import api from '../src/utils/api';

const HELP_CATEGORIES = [
  'College Selection', 'Branch Guidance', 'Entrance Exam Strategy', 
  'Placement Preparation', 'Hackathons', 'Career Guidance', 
  'Study Abroad', 'Freelancing', 'Internships'
];

const SESSION_TYPES = ['1:1 Call', 'Chat Support', 'Group Session', 'Webinar'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Kannada'];

export default function MentorOnboarding() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1
  const [step1, setStep1] = useState({
    name: user?.name || '', gender: '', city: '', state: '',
    college: user?.college || '', degree: '', branch: user?.branch || '',
    year: user?.year || '', graduation_year: ''
  });
  
  // Step 2
  const [step2, setStep2] = useState({
    entrance_exam: '', rank_percentile: '', cgpa: '',
    achievements: [] as string[], internships: [] as string[]
  });
  const [newAchievement, setNewAchievement] = useState('');
  const [newInternship, setNewInternship] = useState('');
  
  // Step 3
  const [step3, setStep3] = useState({
    help_categories: [] as string[], languages: ['English', 'Hindi'], session_types: ['1:1 Call']
  });
  
  // Step 4
  const [step4, setStep4] = useState({
    pricing_30: 300, pricing_60: 500, weekly_slots: [] as string[],
    timezone: 'Asia/Kolkata', instant_booking: false
  });
  
  // Step 5
  const [step5, setStep5] = useState({
    headline: '', about: '', why_book: '', profile_photo: '', intro_video: ''
  });

  useEffect(() => {
    if (user?.onboarding_step) setStep(user.onboarding_step);
  }, [user]);

  const handleNext = async () => {
    setLoading(true);
    try {
      if (step === 1) {
        await api.post('/mentor/onboarding/step1', step1);
      } else if (step === 2) {
        await api.post('/mentor/onboarding/step2', step2);
      } else if (step === 3) {
        await api.post('/mentor/onboarding/step3', step3);
      } else if (step === 4) {
        await api.post('/mentor/onboarding/step4', step4);
      } else if (step === 5) {
        await api.post('/mentor/onboarding/step5', step5);
      }
      if (step < 6) setStep(step + 1);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.detail || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/mentor/onboarding/submit');
      Alert.alert('Submitted!', 'Your profile is under verification. You will be notified once approved.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/dashboard') }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.detail || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setStep3(prev => ({
      ...prev,
      help_categories: prev.help_categories.includes(cat) 
        ? prev.help_categories.filter(c => c !== cat)
        : [...prev.help_categories, cat]
    }));
  };

  const toggleLanguage = (lang: string) => {
    setStep3(prev => ({
      ...prev,
      languages: prev.languages.includes(lang) 
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const toggleSessionType = (type: string) => {
    setStep3(prev => ({
      ...prev,
      session_types: prev.session_types.includes(type) 
        ? prev.session_types.filter(t => t !== type)
        : [...prev.session_types, type]
    }));
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Complete Profile</Text>
          <Text style={s.stepText}>Step {step}/6</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${(step / 6) * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>Basic Information</Text>
              <Text style={s.stepDesc}>Tell us about yourself</Text>
              
              <View style={s.form}>
                <View style={s.inputGroup}>
                  <Text style={s.label}>Full Name</Text>
                  <TextInput style={s.input} value={step1.name} onChangeText={v => setStep1({...step1, name: v})} placeholder="Your name" placeholderTextColor={COLORS.textMuted} />
                </View>
                <View style={s.row}>
                  <View style={[s.inputGroup, {flex: 1, marginRight: SPACING.sm}]}>
                    <Text style={s.label}>Gender</Text>
                    <TextInput style={s.input} value={step1.gender} onChangeText={v => setStep1({...step1, gender: v})} placeholder="Male/Female" placeholderTextColor={COLORS.textMuted} />
                  </View>
                  <View style={[s.inputGroup, {flex: 1}]}>
                    <Text style={s.label}>City</Text>
                    <TextInput style={s.input} value={step1.city} onChangeText={v => setStep1({...step1, city: v})} placeholder="City" placeholderTextColor={COLORS.textMuted} />
                  </View>
                </View>
                <View style={s.inputGroup}>
                  <Text style={s.label}>State</Text>
                  <TextInput style={s.input} value={step1.state} onChangeText={v => setStep1({...step1, state: v})} placeholder="State" placeholderTextColor={COLORS.textMuted} />
                </View>
                <View style={s.inputGroup}>
                  <Text style={s.label}>College Name</Text>
                  <TextInput style={s.input} value={step1.college} onChangeText={v => setStep1({...step1, college: v})} placeholder="e.g., IIT Bombay" placeholderTextColor={COLORS.textMuted} />
                </View>
                <View style={s.row}>
                  <View style={[s.inputGroup, {flex: 1, marginRight: SPACING.sm}]}>
                    <Text style={s.label}>Degree</Text>
                    <TextInput style={s.input} value={step1.degree} onChangeText={v => setStep1({...step1, degree: v})} placeholder="B.Tech" placeholderTextColor={COLORS.textMuted} />
                  </View>
                  <View style={[s.inputGroup, {flex: 1}]}>
                    <Text style={s.label}>Branch</Text>
                    <TextInput style={s.input} value={step1.branch} onChangeText={v => setStep1({...step1, branch: v})} placeholder="CSE" placeholderTextColor={COLORS.textMuted} />
                  </View>
                </View>
                <View style={s.row}>
                  <View style={[s.inputGroup, {flex: 1, marginRight: SPACING.sm}]}>
                    <Text style={s.label}>Year</Text>
                    <TextInput style={s.input} value={step1.year} onChangeText={v => setStep1({...step1, year: v})} placeholder="3rd Year" placeholderTextColor={COLORS.textMuted} />
                  </View>
                  <View style={[s.inputGroup, {flex: 1}]}>
                    <Text style={s.label}>Graduation Year</Text>
                    <TextInput style={s.input} value={step1.graduation_year} onChangeText={v => setStep1({...step1, graduation_year: v})} placeholder="2025" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Step 2: Academic Details */}
          {step === 2 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>Academic Details</Text>
              <Text style={s.stepDesc}>Your academic achievements</Text>
              
              <View style={s.form}>
                <View style={s.inputGroup}>
                  <Text style={s.label}>Entrance Exam Cleared</Text>
                  <TextInput style={s.input} value={step2.entrance_exam} onChangeText={v => setStep2({...step2, entrance_exam: v})} placeholder="JEE Advanced, MHT-CET" placeholderTextColor={COLORS.textMuted} />
                </View>
                <View style={s.row}>
                  <View style={[s.inputGroup, {flex: 1, marginRight: SPACING.sm}]}>
                    <Text style={s.label}>Rank / Percentile</Text>
                    <TextInput style={s.input} value={step2.rank_percentile} onChangeText={v => setStep2({...step2, rank_percentile: v})} placeholder="AIR 500" placeholderTextColor={COLORS.textMuted} />
                  </View>
                  <View style={[s.inputGroup, {flex: 1}]}>
                    <Text style={s.label}>CGPA</Text>
                    <TextInput style={s.input} value={step2.cgpa} onChangeText={v => setStep2({...step2, cgpa: v})} placeholder="8.5" placeholderTextColor={COLORS.textMuted} />
                  </View>
                </View>
                
                <View style={s.inputGroup}>
                  <Text style={s.label}>Achievements</Text>
                  <View style={s.tagInputRow}>
                    <TextInput style={[s.input, {flex: 1}]} value={newAchievement} onChangeText={setNewAchievement} placeholder="Add achievement" placeholderTextColor={COLORS.textMuted} />
                    <TouchableOpacity style={s.addBtn} onPress={() => { if(newAchievement) { setStep2({...step2, achievements: [...step2.achievements, newAchievement]}); setNewAchievement(''); } }}>
                      <Ionicons name="add" size={20} color={COLORS.textInverse} />
                    </TouchableOpacity>
                  </View>
                  <View style={s.tags}>
                    {step2.achievements.map((a, i) => (
                      <View key={i} style={s.tag}>
                        <Text style={s.tagText}>{a}</Text>
                        <TouchableOpacity onPress={() => setStep2({...step2, achievements: step2.achievements.filter((_, idx) => idx !== i)})}>
                          <Ionicons name="close" size={14} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={s.inputGroup}>
                  <Text style={s.label}>Internships / Hackathons</Text>
                  <View style={s.tagInputRow}>
                    <TextInput style={[s.input, {flex: 1}]} value={newInternship} onChangeText={setNewInternship} placeholder="Add experience" placeholderTextColor={COLORS.textMuted} />
                    <TouchableOpacity style={s.addBtn} onPress={() => { if(newInternship) { setStep2({...step2, internships: [...step2.internships, newInternship]}); setNewInternship(''); } }}>
                      <Ionicons name="add" size={20} color={COLORS.textInverse} />
                    </TouchableOpacity>
                  </View>
                  <View style={s.tags}>
                    {step2.internships.map((a, i) => (
                      <View key={i} style={s.tag}>
                        <Text style={s.tagText}>{a}</Text>
                        <TouchableOpacity onPress={() => setStep2({...step2, internships: step2.internships.filter((_, idx) => idx !== i)})}>
                          <Ionicons name="close" size={14} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Step 3: Mentorship Details */}
          {step === 3 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>Mentorship Details</Text>
              <Text style={s.stepDesc}>What can you help students with?</Text>
              
              <View style={s.form}>
                <Text style={s.label}>Select Categories</Text>
                <View style={s.chipGrid}>
                  {HELP_CATEGORIES.map(cat => (
                    <TouchableOpacity key={cat} style={[s.chip, step3.help_categories.includes(cat) && s.chipActive]} onPress={() => toggleCategory(cat)}>
                      <Text style={[s.chipText, step3.help_categories.includes(cat) && s.chipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Text style={[s.label, {marginTop: SPACING.lg}]}>Languages Spoken</Text>
                <View style={s.chipGrid}>
                  {LANGUAGES.map(lang => (
                    <TouchableOpacity key={lang} style={[s.chip, step3.languages.includes(lang) && s.chipActive]} onPress={() => toggleLanguage(lang)}>
                      <Text style={[s.chipText, step3.languages.includes(lang) && s.chipTextActive]}>{lang}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Text style={[s.label, {marginTop: SPACING.lg}]}>Session Types Offered</Text>
                <View style={s.chipGrid}>
                  {SESSION_TYPES.map(type => (
                    <TouchableOpacity key={type} style={[s.chip, step3.session_types.includes(type) && s.chipActive]} onPress={() => toggleSessionType(type)}>
                      <Text style={[s.chipText, step3.session_types.includes(type) && s.chipTextActive]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>Pricing & Availability</Text>
              <Text style={s.stepDesc}>Set your rates and schedule</Text>
              
              <View style={s.form}>
                <View style={s.row}>
                  <View style={[s.inputGroup, {flex: 1, marginRight: SPACING.sm}]}>
                    <Text style={s.label}>Price (30 min)</Text>
                    <TextInput style={s.input} value={String(step4.pricing_30)} onChangeText={v => setStep4({...step4, pricing_30: parseInt(v) || 0})} keyboardType="numeric" placeholder="300" placeholderTextColor={COLORS.textMuted} />
                  </View>
                  <View style={[s.inputGroup, {flex: 1}]}>
                    <Text style={s.label}>Price (60 min)</Text>
                    <TextInput style={s.input} value={String(step4.pricing_60)} onChangeText={v => setStep4({...step4, pricing_60: parseInt(v) || 0})} keyboardType="numeric" placeholder="500" placeholderTextColor={COLORS.textMuted} />
                  </View>
                </View>
                
                <TouchableOpacity style={s.toggleRow} onPress={() => setStep4({...step4, instant_booking: !step4.instant_booking})}>
                  <View>
                    <Text style={s.toggleLabel}>Instant Booking</Text>
                    <Text style={s.toggleDesc}>Allow students to book without approval</Text>
                  </View>
                  <View style={[s.toggle, step4.instant_booking && s.toggleActive]}>
                    <View style={[s.toggleKnob, step4.instant_booking && s.toggleKnobActive]} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 5: Bio */}
          {step === 5 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>Bio & Public Profile</Text>
              <Text style={s.stepDesc}>Make a great first impression</Text>
              
              <View style={s.form}>
                <View style={s.inputGroup}>
                  <Text style={s.label}>Headline</Text>
                  <TextInput style={s.input} value={step5.headline} onChangeText={v => setStep5({...step5, headline: v})} placeholder="IIT Bombay CSE | JEE AIR 500" placeholderTextColor={COLORS.textMuted} />
                </View>
                <View style={s.inputGroup}>
                  <Text style={s.label}>About You</Text>
                  <TextInput style={[s.input, s.textArea]} value={step5.about} onChangeText={v => setStep5({...step5, about: v})} placeholder="Tell students about yourself..." placeholderTextColor={COLORS.textMuted} multiline numberOfLines={4} textAlignVertical="top" />
                </View>
                <View style={s.inputGroup}>
                  <Text style={s.label}>Why Should Students Book You?</Text>
                  <TextInput style={[s.input, s.textArea]} value={step5.why_book} onChangeText={v => setStep5({...step5, why_book: v})} placeholder="What makes you unique..." placeholderTextColor={COLORS.textMuted} multiline numberOfLines={3} textAlignVertical="top" />
                </View>
              </View>
            </View>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <View style={s.stepContent}>
              <View style={s.reviewIcon}>
                <Ionicons name="checkmark-circle" size={60} color={COLORS.success} />
              </View>
              <Text style={s.stepTitle}>Review & Submit</Text>
              <Text style={s.stepDesc}>Your profile is ready for verification</Text>
              
              <View style={s.reviewCard}>
                <Text style={s.reviewName}>{step1.name || user?.name}</Text>
                <Text style={s.reviewCollege}>{step1.college} - {step1.branch}</Text>
                <Text style={s.reviewHeadline}>{step5.headline}</Text>
              </View>
              
              <View style={s.infoBox}>
                <Ionicons name="information-circle" size={20} color={COLORS.info} />
                <Text style={s.infoText}>Your profile will be reviewed by our team. You'll be notified once approved.</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Button */}
        <View style={s.bottomBar}>
          <TouchableOpacity 
            style={[s.nextBtn, loading && s.nextBtnDisabled]} 
            onPress={step === 6 ? handleSubmit : handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textInverse} />
            ) : (
              <>
                <Text style={s.nextBtnText}>{step === 6 ? 'Submit for Verification' : 'Continue'}</Text>
                <Ionicons name={step === 6 ? 'checkmark' : 'arrow-forward'} size={20} color={COLORS.textInverse} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryLight },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.background },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, ...TYPOGRAPHY.h3, color: COLORS.primary, textAlign: 'center' },
  stepText: { ...TYPOGRAPHY.caption, color: COLORS.primaryMedium, fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: COLORS.border },
  progressFill: { height: 4, backgroundColor: COLORS.primary },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  stepContent: {},
  stepTitle: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: SPACING.xs },
  stepDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  form: { gap: SPACING.md },
  inputGroup: { gap: SPACING.xs },
  label: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, fontSize: 12 },
  input: { height: 52, backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, fontSize: 16, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
  textArea: { height: 100, paddingVertical: SPACING.sm },
  row: { flexDirection: 'row' },
  tagInputRow: { flexDirection: 'row', gap: SPACING.sm },
  addBtn: { width: 52, height: 52, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.sm },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 6, borderRadius: RADIUS.pill },
  tagText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.sm },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, fontSize: 13 },
  chipTextActive: { color: COLORS.textInverse },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, padding: SPACING.md, borderRadius: RADIUS.md, marginTop: SPACING.md },
  toggleLabel: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.textPrimary },
  toggleDesc: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  toggle: { width: 50, height: 28, borderRadius: 14, backgroundColor: COLORS.border, padding: 2 },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleKnob: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.background },
  toggleKnobActive: { marginLeft: 22 },
  reviewIcon: { alignItems: 'center', marginBottom: SPACING.lg },
  reviewCard: { backgroundColor: COLORS.background, padding: SPACING.xl, borderRadius: RADIUS.xl, alignItems: 'center', marginBottom: SPACING.lg, ...SHADOWS.md },
  reviewName: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  reviewCollege: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  reviewHeadline: { ...TYPOGRAPHY.caption, color: COLORS.primaryMedium, marginTop: SPACING.sm, textAlign: 'center' },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.infoLight, padding: SPACING.md, borderRadius: RADIUS.md },
  infoText: { ...TYPOGRAPHY.caption, color: COLORS.info, flex: 1 },
  bottomBar: { padding: SPACING.md, backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: COLORS.border },
  nextBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, ...SHADOWS.md },
  nextBtnDisabled: { opacity: 0.6 },
  nextBtnText: { ...TYPOGRAPHY.body, color: COLORS.textInverse, fontWeight: '600', fontSize: 16 },
});
