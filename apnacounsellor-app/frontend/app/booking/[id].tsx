import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import GenderAvatar from '../../src/components/GenderAvatar';

export default function BookingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function loadMentor() {
      try {
        const data = await apiCall(`/mentors/${id}`);
        setMentor(data);
      } catch (e) {
        console.error('Mentor fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadMentor();
  }, [id]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      const amount = mentor?.pricing || 499;
      const res = await apiCall('/payments/create-link', {
        amount: amount,
        purpose: `Mentorship Session with ${mentor?.name}`
      }, 'POST');

      if (res.success && res.payment_url) {
        // Open Razorpay Payment Link
        await WebBrowser.openBrowserAsync(res.payment_url);
        Alert.alert('Payment Initialized', 'Please complete the payment in your browser. Once done, your session will be confirmed.');
      } else {
        throw new Error('Failed to generate payment link');
      }
    } catch (e) {
      Alert.alert('Payment Error', 'Unable to initiate payment. Please try again later.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Mentor Card */}
        <View style={styles.mentorCard}>
          <View style={styles.mentorRow}>
            <GenderAvatar gender={mentor?.gender} size={80} imageUrl={mentor?.profilePhoto || mentor?.avatar} />
            <View style={styles.mentorInfo}>
              <Text style={styles.mentorName}>{mentor?.name}</Text>
              <Text style={styles.mentorTitle}>Expert Counselor • {mentor?.college || 'IIT Alumni'}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingText}>{mentor?.rating || '4.9'} (120+ reviews)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>1x 1-on-1 Mentorship Session</Text>
            <Text style={styles.summaryValue}>₹{mentor?.pricing || 499}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>₹49</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{(mentor?.pricing || 499) + 49}</Text>
          </View>
        </View>

        {/* Trust Signals */}
        <View style={styles.trustSignals}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={20} color="#059669" />
            <Text style={styles.trustText}>Secure 256-bit SSL Payment</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="ribbon" size={20} color="#4F46E5" />
            <Text style={styles.trustText}>Verified Expert Mentors</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payBtn} 
          onPress={handlePayment}
          disabled={paying}
        >
          {paying ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.payBtnText}>Pay Securely</Text>
              <Ionicons name="lock-closed" size={18} color="#FFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.secureText}>Powered by Razorpay</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: 20 },
  mentorCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.md,
  },
  mentorRow: { flexDirection: 'row', alignItems: 'center' },
  mentorInfo: { flex: 1, marginLeft: 16 },
  mentorName: { fontSize: 20, fontWeight: '800', color: '#1E1B4B' },
  mentorTitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  ratingBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFBEB', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  ratingText: { fontSize: 12, fontWeight: '600', color: '#B45309', marginLeft: 4 },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#64748B' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#1E1B4B' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#1E1B4B' },
  totalValue: { fontSize: 22, fontWeight: '800', color: '#4F46E5' },
  trustSignals: { marginTop: 24, gap: 12 },
  trustItem: { flexDirection: 'row', alignItems: 'center' },
  trustText: { fontSize: 13, color: '#64748B', marginLeft: 8 },
  footer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  payBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  secureText: { textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 12 },
});
