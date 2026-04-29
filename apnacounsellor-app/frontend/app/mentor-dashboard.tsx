import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { apiCall } from '../src/utils/api';
import GenderAvatar from '../src/components/GenderAvatar';

export default function MentorDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'earnings' | 'reviews'>('overview');

  const fetchDashboard = async () => {
    try {
      const res = await apiCall('/mentor/dashboard');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'mentor' || user?.role === 'counsellor') {
      fetchDashboard();
    } else {
      router.replace('/(tabs)/dashboard');
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const handleSessionAction = async (sessionId: string, status: string) => {
    try {
      await apiCall(`/sessions/${sessionId}/status?status=${status}`, { method: 'PUT' });
      fetchDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const stats = data?.stats || {};

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <GenderAvatar gender={user?.gender} size={36} imageUrl={user?.profilePhoto || user?.avatar} />
          <Text style={s.headerTitle}>My Dashboard</Text>
        </View>
        <TouchableOpacity
          style={s.postBtn}
          onPress={() => router.push('/post-session')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={s.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {(['overview', 'sessions', 'earnings', 'reviews'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <View style={s.statsGrid}>
              <View style={s.statCard}>
                <Ionicons name="wallet-outline" size={24} color={COLORS.success} />
                <Text style={s.statValue}>₹{stats.total_earnings || 0}</Text>
                <Text style={s.statLabel}>Total Earnings</Text>
              </View>
              <View style={s.statCard}>
                <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
                <Text style={s.statValue}>{stats.total_sessions || 0}</Text>
                <Text style={s.statLabel}>Total Sessions</Text>
              </View>
              <View style={s.statCard}>
                <Ionicons name="time-outline" size={24} color={COLORS.warning} />
                <Text style={s.statValue}>{stats.pending_requests || 0}</Text>
                <Text style={s.statLabel}>Pending Requests</Text>
              </View>
              <View style={s.statCard}>
                <Ionicons name="star-outline" size={24} color={COLORS.gold} />
                <Text style={s.statValue}>{stats.rating || 4.5}</Text>
                <Text style={s.statLabel}>Rating ({stats.reviews_count || 0})</Text>
              </View>
            </View>

            {/* Pending Requests */}
            {data?.pending_requests?.length > 0 && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Pending Requests</Text>
                {data.pending_requests.map((session: any) => (
                  <View key={session.id} style={s.sessionCard}>
                    <View style={s.sessionInfo}>
                      <Text style={s.sessionStudent}>{session.student_name}</Text>
                      <Text style={s.sessionTopic}>{session.topic}</Text>
                      <Text style={s.sessionMeta}>{session.date} • {session.time_slot}</Text>
                    </View>
                    <View style={s.sessionActions}>
                      <TouchableOpacity
                        style={[s.actionBtn, s.acceptBtn]}
                        onPress={() => handleSessionAction(session.id, 'accepted')}
                      >
                        <Ionicons name="checkmark" size={18} color={COLORS.textInverse} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.actionBtn, s.rejectBtn]}
                        onPress={() => handleSessionAction(session.id, 'rejected')}
                      >
                        <Ionicons name="close" size={18} color={COLORS.textInverse} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Upcoming Sessions */}
            {data?.upcoming_sessions?.length > 0 && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Upcoming Sessions</Text>
                {data.upcoming_sessions.map((session: any) => (
                  <View key={session.id} style={s.sessionCard}>
                    <View style={s.sessionInfo}>
                      <Text style={s.sessionStudent}>{session.student_name}</Text>
                      <Text style={s.sessionTopic}>{session.topic}</Text>
                      <Text style={s.sessionMeta}>{session.date} • {session.time_slot}</Text>
                    </View>
                    <View style={[s.statusBadge, s.statusConfirmed]}>
                      <Text style={s.statusText}>Confirmed</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {activeTab === 'sessions' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>All Sessions</Text>
            {[...(data?.pending_requests || []), ...(data?.upcoming_sessions || [])].map((session: any) => (
              <View key={session.id} style={s.sessionCard}>
                <View style={s.sessionInfo}>
                  <Text style={s.sessionStudent}>{session.student_name}</Text>
                  <Text style={s.sessionTopic}>{session.topic}</Text>
                  <Text style={s.sessionMeta}>{session.date} • {session.time_slot} • ₹{session.price}</Text>
                </View>
                <View style={[s.statusBadge, session.status === 'pending' ? s.statusPending : s.statusConfirmed]}>
                  <Text style={s.statusText}>{session.status}</Text>
                </View>
              </View>
            ))}
            {(!data?.pending_requests?.length && !data?.upcoming_sessions?.length) && (
              <Text style={s.emptyText}>No sessions yet</Text>
            )}
          </View>
        )}

        {activeTab === 'earnings' && (
          <View style={s.section}>
            <View style={s.earningsCard}>
              <Text style={s.earningsLabel}>Total Earnings</Text>
              <Text style={s.earningsValue}>₹{stats.total_earnings || 0}</Text>
              <Text style={s.earningsMonth}>This Month: ₹{stats.monthly_earnings || 0}</Text>
            </View>
            <Text style={s.sectionTitle}>Recent Transactions</Text>
            {data?.recent_payments?.map((payment: any) => (
              <View key={payment.id} style={s.paymentCard}>
                <View>
                  <Text style={s.paymentStudent}>{payment.user_name}</Text>
                  <Text style={s.paymentDate}>{new Date(payment.created_at).toLocaleDateString()}</Text>
                </View>
                <Text style={s.paymentAmount}>+₹{payment.amount}</Text>
              </View>
            ))}
            {!data?.recent_payments?.length && (
              <Text style={s.emptyText}>No earnings yet</Text>
            )}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={s.section}>
            <View style={s.ratingCard}>
              <Text style={s.ratingValue}>{stats.rating || 4.5}</Text>
              <View style={s.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.round(stats.rating || 4.5) ? 'star' : 'star-outline'}
                    size={24}
                    color={COLORS.gold}
                  />
                ))}
              </View>
              <Text style={s.reviewsCount}>{stats.reviews_count || 0} reviews</Text>
            </View>
            <Text style={s.sectionTitle}>Recent Reviews</Text>
            {data?.recent_reviews?.map((review: any) => (
              <View key={review.id} style={s.reviewCard}>
                <View style={s.reviewHeader}>
                  <Text style={s.reviewerName}>{review.reviewer_name}</Text>
                  <View style={s.reviewRating}>
                    <Ionicons name="star" size={14} color={COLORS.gold} />
                    <Text style={s.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={s.reviewComment}>{review.comment}</Text>
                <Text style={s.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</Text>
              </View>
            ))}
            {!data?.recent_reviews?.length && (
              <Text style={s.emptyText}>No reviews yet</Text>
            )}
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  postBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  postBtnText: { ...TYPOGRAPHY.caption, color: '#fff', fontWeight: '700', fontSize: 13 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 13 },
  tabTextActive: { color: COLORS.primary, fontWeight: '600' },
  scroll: { flex: 1, padding: SPACING.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: { width: '48%', backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOWS.sm },
  statValue: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginTop: SPACING.xs },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary, marginBottom: SPACING.md },
  sessionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  sessionInfo: { flex: 1 },
  sessionStudent: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary },
  sessionTopic: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  sessionMeta: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginTop: 2 },
  sessionActions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  acceptBtn: { backgroundColor: COLORS.success },
  rejectBtn: { backgroundColor: COLORS.error },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.pill },
  statusPending: { backgroundColor: COLORS.warningLight },
  statusConfirmed: { backgroundColor: COLORS.successLight },
  statusText: { ...TYPOGRAPHY.caption, fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: SPACING.xl },
  earningsCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg },
  earningsLabel: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.7)' },
  earningsValue: { ...TYPOGRAPHY.h1, color: COLORS.textInverse, marginVertical: SPACING.xs },
  earningsMonth: { ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.8)' },
  paymentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  paymentStudent: { ...TYPOGRAPHY.body, fontWeight: '500', color: COLORS.textPrimary },
  paymentDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  paymentAmount: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.success },
  ratingCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg, ...SHADOWS.sm },
  ratingValue: { ...TYPOGRAPHY.h1, color: COLORS.primary, fontSize: 48 },
  starsRow: { flexDirection: 'row', gap: 4, marginVertical: SPACING.sm },
  reviewsCount: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  reviewCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  reviewerName: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  reviewRatingText: { ...TYPOGRAPHY.caption, color: COLORS.gold, fontWeight: '600' },
  reviewComment: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  reviewDate: { ...TYPOGRAPHY.caption, color: COLORS.textMuted },
});
