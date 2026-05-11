import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import GenderAvatar from '../../src/components/GenderAvatar';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [mentors, setMentors] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [mentorsData, sessionsData, batchesData, collegesData] = await Promise.all([
        apiCall('/mentors').catch(() => []),
        apiCall('/sessions').catch(() => []),
        apiCall('/batches').catch(() => []),
        apiCall('/colleges').catch(() => []),
      ]);
      setMentors(Array.isArray(mentorsData) ? mentorsData.slice(0, 4) : []);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setBatches(Array.isArray(batchesData) ? batchesData.slice(0, 3) : []);
      setCourses(Array.isArray(collegesData) ? collegesData.slice(0, 5) : []);
    } catch (e) {
      console.log('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const isMentor = user?.role === 'mentor';
  const greeting = getGreeting();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        testID="dashboard-scroll"
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Header - Premium Redesign */}
        <View style={styles.premiumHeader}>
          <View>
            <Text style={styles.premiumGreeting}>{greeting},</Text>
            <Text style={styles.premiumUserName}>{user?.name || 'Future IITian'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <GenderAvatar gender={user?.gender} size={54} imageUrl={user?.profilePhoto || user?.avatar} />
          </TouchableOpacity>
        </View>

        {/* AI Action Card - Glassmorphism style */}
        <TouchableOpacity
          style={styles.aiGlassCard}
          onPress={() => router.push('/(tabs)/ai-chat')}
          activeOpacity={0.9}
        >
          <View style={styles.aiGlassContent}>
            <View style={styles.aiIconBg}>
              <Ionicons name="sparkles" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.aiTextContainer}>
              <Text style={styles.aiGlassTitle}>AI Counseling Copilot</Text>
              <Text style={styles.aiGlassDesc}>Instant rank analysis & college suggestions</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        {/* Quick Actions Grid - Modern Cards */}
        <View style={styles.actionGrid}>
          {[
            { id: 'pred', title: 'Predictor', icon: 'analytics', route: '/predictor', color: '#E0E7FF' },
            { id: 'comp', title: 'Compare', icon: 'git-compare', route: '/compare', color: '#F0F9FF' },
            { id: 'coll', title: 'Colleges', icon: 'business', route: '/browse-colleges', color: '#ECFDF5' },
            { id: 'res', title: 'Expert', icon: 'people', route: '/(tabs)/mentorship', color: '#FFF7ED' }
          ].map((item) => (
            <TouchableOpacity key={item.id} style={[styles.actionCard, { backgroundColor: item.color }]} onPress={() => router.push(item.route as any)}>
              <View style={styles.actionIconBg}><Ionicons name={item.icon as any} size={22} color={COLORS.primary} /></View>
              <Text style={styles.actionCardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Role-specific Actions */}
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.adminBanner}
            onPress={() => router.push('/admin-dashboard')}
          >
            <Ionicons name="shield-checkmark" size={20} color={COLORS.textInverse} />
            <Text style={styles.adminBannerText}>Admin Management Console</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.textInverse} />
          </TouchableOpacity>
        )}


        {/* Upcoming Sessions */}
        {sessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sessionScroll}>
              {sessions.filter(s => s.status !== 'completed' && s.status !== 'cancelled').slice(0, 5).map((session, idx) => (
                <View key={idx} style={styles.sessionCard}>
                  <Text style={styles.sessionMentor}>{isMentor ? session.student_name : session.mentor_name}</Text>
                  <Text style={styles.sessionTopic}>{session.topic}</Text>
                  <View style={styles.sessionMeta}>
                    <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.sessionDate}>{session.date}</Text>
                    <Text style={styles.sessionTime}>{session.time_slot}</Text>
                  </View>
                  <View style={[styles.statusBadge, session.status === 'accepted' ? styles.statusAccepted : styles.statusPending]}>
                    <Text style={styles.statusText}>{session.status}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recommended Mentors */}
        {!isMentor && mentors.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Mentors</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mentorGrid}>
              {mentors.map((mentor, idx) => (
                <TouchableOpacity
                  key={idx}
                  testID={`mentor-card-${idx}`}
                  style={styles.mentorCard}
                  onPress={() => router.push(`/mentor/${mentor.id}`)}
                  activeOpacity={0.8}
                >
                  <GenderAvatar gender={mentor.gender} size={44} imageUrl={mentor.profilePhoto || mentor.avatar} />
                  <Text style={styles.mentorName} numberOfLines={1}>{mentor.name}</Text>
                  <Text style={styles.mentorCollege} numberOfLines={1}>{mentor.college}</Text>
                  <View style={styles.mentorMeta}>
                    <Ionicons name="star" size={12} color={COLORS.primary} />
                    <Text style={styles.mentorRating}>{mentor.rating || '4.5'}</Text>
                    <Text style={styles.mentorPrice}>₹{mentor.pricing || 500}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Mentor Dashboard Section */}
        {isMentor && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{user?.sessions_count || 0}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>₹{user?.earnings || 0}</Text>
                <Text style={styles.statLabel}>Earnings</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{user?.rating || '4.5'}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{user?.reviews_count || 0}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </View>
          </View>
        )}

        {/* Top Colleges */}
        {courses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Colleges</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/colleges')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sessionScroll}>
              {courses.map((college: any, idx: number) => (
                <TouchableOpacity key={idx} testID={`dash-college-${idx}`} style={styles.courseSmallCard} onPress={() => router.push(`/college/${college.id}`)} activeOpacity={0.8}>
                  <View style={styles.courseBadge}><Text style={styles.courseBadgeText}>#{college.nirf_rank}</Text></View>
                  <Text style={styles.courseSmallTitle} numberOfLines={2}>{college.short_name || college.name}</Text>
                  <Text style={styles.courseSmallMeta}>{college.city}, {college.state}</Text>
                  <Text style={styles.courseSmallPrice}>{college.avg_package}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Upcoming Batches */}
        {batches.length > 0 && !isMentor && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Batch Programs</Text>
            {batches.map((batch, idx) => (
              <TouchableOpacity key={idx} testID={`dash-batch-${idx}`} style={styles.batchCard} onPress={() => router.push(`/batch/${batch.id}`)} activeOpacity={0.8}>
                <View style={styles.batchTop}>
                  <Text style={styles.batchTitle}>{batch.title}</Text>
                  <View style={[styles.batchStatus, batch.status === 'ongoing' ? styles.ongoingStatus : styles.upcomingStatus]}>
                    <Text style={styles.batchStatusText}>{batch.status}</Text>
                  </View>
                </View>
                <Text style={styles.batchMentor}>{batch.mentor_name} · {batch.schedule}</Text>
                <View style={styles.batchBottom}>
                  <Text style={styles.batchSpots}>{batch.current_students}/{batch.max_students} students</Text>
                  <Text style={styles.batchPrice}>₹{batch.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  greeting: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 14 },
  userName: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', ...SHADOWS.sm },
  avatarText: { ...TYPOGRAPHY.h3, color: COLORS.textInverse },
  aiCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.md },
  aiCardContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  aiCardText: { flex: 1 },
  aiCardTitle: { ...TYPOGRAPHY.h3, color: COLORS.textInverse, marginBottom: 2 },
  aiCardDesc: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  quickActions: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  quickAction: { flex: 1, alignItems: 'center', gap: SPACING.xs },
  quickActionIcon: { width: 56, height: 56, borderRadius: RADIUS.lg, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  quickActionText: { ...TYPOGRAPHY.caption, textAlign: 'center', fontSize: 11, color: COLORS.textPrimary },
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary, marginBottom: SPACING.md },
  seeAll: { ...TYPOGRAPHY.label, color: COLORS.primaryMedium, fontSize: 12 },
  sessionScroll: { gap: SPACING.md },
  sessionCard: { width: 220, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  sessionMentor: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary, marginBottom: 2 },
  sessionTopic: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.sm },
  sessionDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  sessionTime: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '500' },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.pill, alignSelf: 'flex-start' },
  statusAccepted: { backgroundColor: COLORS.successLight },
  statusPending: { backgroundColor: COLORS.warningLight },
  statusText: { ...TYPOGRAPHY.caption, fontSize: 11, textTransform: 'capitalize' },
  mentorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  mentorCard: { width: '47%' as any, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  mentorAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLavender, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  mentorAvatarText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary },
  mentorName: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary, fontSize: 15 },
  mentorCollege: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  mentorMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  mentorRating: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  mentorPrice: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginLeft: 'auto' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  statCard: { width: '47%' as any, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', ...SHADOWS.sm },
  statValue: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: 2 },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  courseSmallCard: { width: 200, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  courseBadge: { backgroundColor: COLORS.primaryMedium, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.pill, alignSelf: 'flex-start', marginBottom: SPACING.sm },
  courseBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontSize: 10, fontWeight: '700' },
  courseSmallTitle: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary, fontSize: 14, marginBottom: 4 },
  courseSmallMeta: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  courseSmallPrice: { ...TYPOGRAPHY.body, fontWeight: '800', color: COLORS.success },
  batchCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm, ...SHADOWS.sm },
  batchTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xs },
  batchTitle: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary, flex: 1, marginRight: SPACING.sm },
  batchStatus: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.pill },
  ongoingStatus: { backgroundColor: COLORS.success },
  upcomingStatus: { backgroundColor: COLORS.primaryLavender },
  batchStatusText: { ...TYPOGRAPHY.caption, fontSize: 10, fontWeight: '700', textTransform: 'capitalize', color: COLORS.textInverse },
  batchMentor: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  batchBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  batchSpots: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  batchPrice: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary },
  roleCard: { backgroundColor: COLORS.primaryMedium, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.md },
  roleCardContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  roleCardText: { flex: 1 },
  roleCardTitle: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.textInverse, marginBottom: 2 },
  roleCardDesc: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  premiumHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, marginBottom: 20 },
  premiumGreeting: { fontSize: 16, color: '#6366F1', fontFamily: 'Lexend_400Regular', opacity: 0.8 },
  premiumUserName: { fontSize: 28, fontWeight: '800', color: '#1E1B4B', fontFamily: 'Lexend_700Bold', marginTop: 2 },
  aiGlassCard: { marginHorizontal: 24, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 2, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5, marginBottom: 24 },
  aiGlassContent: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 22 },
  aiIconBg: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  aiTextContainer: { flex: 1, marginLeft: 16 },
  aiGlassTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  aiGlassDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 24 },
  actionCard: { width: (width - 64) / 2, height: 100, borderRadius: 20, padding: 16, marginBottom: 16, justifyContent: 'space-between' },
  actionIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  actionCardText: { fontSize: 15, fontWeight: '600', color: '#1E1B4B' },
  adminBanner: { marginHorizontal: 24, backgroundColor: '#1E1B4B', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  adminBannerText: { color: '#FFFFFF', fontWeight: '700', marginHorizontal: 10 },
  premiumCourseCard: { width: 220, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginRight: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  courseIconBg: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  courseTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 4 },
  courseMentor: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  coursePrice: { fontSize: 15, fontWeight: '800', color: '#4F46E5' },
});
