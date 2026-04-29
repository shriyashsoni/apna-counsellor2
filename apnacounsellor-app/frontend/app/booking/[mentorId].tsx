import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Alert, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Booking() {
  const { mentorId } = useLocalSearchParams<{ mentorId: string }>();
  const router = useRouter();
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => { if (mentorId) fetchMentor(); }, [mentorId]);

  async function fetchMentor() {
    try { setMentor(await apiCall(`/mentors/${mentorId}`)); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function handlePayment() {
    setPaying(true);
    try {
      const data = await apiCall('/payments/create-link', {
        method: 'POST',
        body: JSON.stringify({ mentor_id: mentorId, amount: mentor?.pricing || 500 }),
      });
      if (data.payment_url) {
        Alert.alert(
          'Razorpay Payment',
          `Pay ₹${mentor?.pricing || 500} to book session with ${mentor?.name}.\n\nYou'll be redirected to Razorpay's secure payment page.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Pay Now', onPress: () => Linking.openURL(data.payment_url) },
          ]
        );
      } else {
        Alert.alert('Error', 'Could not create payment link');
      }
    } catch (e: any) {
      Alert.alert('Payment Error', e.message || 'Failed to create payment');
    } finally { setPaying(false); }
  }

  async function openWhatsApp() {
    const msg = `Hi ${mentor?.name}, I'm interested in a mentorship session via Apna Counselor!`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  }

  if (loading) return <SafeAreaView style={s.container}><View style={s.center}><ActivityIndicator size="large" color={COLORS.primary} /></View></SafeAreaView>;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity testID="booking-back-btn" style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={s.title}>Book Session</Text>
        {mentor && (
          <View style={s.mentorInfo}>
            <View style={s.mentorAvatar}><Text style={s.mentorAvatarText}>{(mentor.name || 'M')[0]}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.mentorName}>{mentor.name}</Text>
              <Text style={s.mentorCollege}>{mentor.college} · {mentor.branch}</Text>
            </View>
            <TouchableOpacity testID="whatsapp-btn" style={s.whatsappBtn} onPress={openWhatsApp}>
              <Ionicons name="logo-whatsapp" size={22} color={COLORS.whatsapp} />
            </TouchableOpacity>
          </View>
        )}

        {/* About Mentor */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>About the Session</Text>
          <Text style={s.aboutText}>Book a 1-on-1 mentorship session with {mentor?.name}. Get personalized guidance on college admissions, exam preparation, and career planning.</Text>
        </View>

        {/* What you get */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>What You Get</Text>
          {['45 min 1-on-1 session', 'Personalized advice', 'College strategy planning', 'Follow-up support via WhatsApp'].map((item, i) => (
            <View key={i} style={s.checkRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
              <Text style={s.checkText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={s.paymentCard}>
          <Text style={s.paymentTitle}>Payment Summary</Text>
          <View style={s.payRow}><Text style={s.payLabel}>Session Fee</Text><Text style={s.payValue}>₹{mentor?.pricing || 500}</Text></View>
          <View style={s.payRow}><Text style={s.payLabel}>Platform Fee</Text><Text style={s.payValue}>₹0</Text></View>
          <View style={[s.payRow, s.totalRow]}><Text style={s.totalLabel}>Total</Text><Text style={s.totalValue}>₹{mentor?.pricing || 500}</Text></View>
          <View style={s.secureBadge}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />
            <Text style={s.secureText}>Secured by Razorpay</Text>
          </View>
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        <TouchableOpacity testID="pay-btn" style={[s.payBtn, paying && s.payBtnDisabled]} onPress={handlePayment} disabled={paying} activeOpacity={0.8}>
          {paying ? <ActivityIndicator color={COLORS.textInverse} /> :
            <><Ionicons name="card" size={20} color={COLORS.textInverse} /><Text style={s.payBtnText}>Pay ₹{mentor?.pricing || 500} via Razorpay</Text></>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xl, paddingBottom: 100 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  title: { ...TYPOGRAPHY.h1, color: COLORS.primary, marginBottom: SPACING.lg },
  mentorInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surfaceElevated, padding: SPACING.lg, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
  mentorAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  mentorAvatarText: { ...TYPOGRAPHY.h3, color: COLORS.textInverse },
  mentorName: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.textPrimary, fontSize: 17 },
  mentorCollege: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  whatsappBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.textPrimary, marginBottom: SPACING.md, fontSize: 17 },
  aboutText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, lineHeight: 24 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  checkText: { ...TYPOGRAPHY.body, color: COLORS.textPrimary, fontSize: 15 },
  paymentCard: { backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  paymentTitle: { ...TYPOGRAPHY.h3, color: COLORS.textPrimary, marginBottom: SPACING.md, fontSize: 16 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  payLabel: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontSize: 14 },
  payValue: { ...TYPOGRAPHY.body, color: COLORS.textPrimary, fontSize: 14 },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm, marginTop: SPACING.sm },
  totalLabel: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.textPrimary },
  totalValue: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  secureBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.md, justifyContent: 'center' },
  secureText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  bottomBar: { padding: SPACING.lg, paddingBottom: SPACING.xl, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.background },
  payBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm },
  payBtnDisabled: { opacity: 0.6 },
  payBtnText: { ...TYPOGRAPHY.body, color: COLORS.textInverse, fontWeight: '700', fontSize: 17 },
});
