import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, Dimensions, Image } from 'react-native';
const { width } = Dimensions.get('window');
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [mentors, setMentors] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const fetchData = useCallback(async () => {
    try {
      setBackendStatus('checking');
      const [mentorsData, collegesData, health] = await Promise.all([
        apiCall('/mentors').catch(() => []),
        apiCall('/colleges').catch(() => []),
        apiCall('/health').catch(() => null)
      ]);
      setMentors(Array.isArray(mentorsData) ? mentorsData.slice(0, 6) : []);
      setColleges(Array.isArray(collegesData) ? collegesData.slice(0, 6) : []);
      setBackendStatus(health ? 'online' : 'offline');
    } catch (e) {
      console.log('Dashboard error:', e);
      setBackendStatus('offline');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Premium Header */}
        <View style={styles.header}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <View style={[styles.statusDot, { backgroundColor: backendStatus === 'online' ? COLORS.secondary : (backendStatus === 'checking' ? COLORS.warning : COLORS.error) }]} />
              <Text style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: '700' }}>{backendStatus.toUpperCase()}</Text>
            </View>
            <Text style={styles.userNameText}>{user?.name?.split(' ')[0] || 'Future Engineer'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.profileBtn}>
            <Ionicons name="person-circle" size={42} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* AI Copilot Glass Card */}
        <TouchableOpacity 
          style={styles.aiHeroCard} 
          onPress={() => router.push('/(tabs)/ai-chat')}
          activeOpacity={0.9}
        >
          <View style={styles.aiIconContainer}>
            <Ionicons name="sparkles" size={28} color="#FFF" />
          </View>
          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>AI Counseling Copilot</Text>
            <Text style={styles.aiDesc}>Analyze your rank & find best colleges instantly</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {/* Quick Action Grid */}
        <View style={styles.actionGrid}>
          {[
            { id: 'pred', title: 'College Predictor', icon: 'analytics', route: '/predictor', bg: '#EEF2FF' },
            { id: 'comp', title: 'Compare Tools', icon: 'git-compare', route: '/compare', bg: '#F0F9FF' },
            { id: 'coll', title: 'Browse Colleges', icon: 'school', route: '/(tabs)/colleges', bg: '#ECFDF5' },
            { id: 'res', title: 'Expert Advice', icon: 'people', route: '/(tabs)/mentorship', bg: '#FFF7ED' }
          ].map((item) => (
            <TouchableOpacity key={item.id} style={[styles.actionCard, { backgroundColor: item.bg }]} onPress={() => router.push(item.route as any)}>
              <View style={styles.actionIconBg}>
                <Ionicons name={item.icon as any} size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.actionTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Mentors Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expert Mentors</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/mentorship')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {mentors.map((m, i) => (
              <TouchableOpacity key={i} style={styles.mentorCard} onPress={() => router.push(`/mentor/${m.id}`)}>
                <View style={styles.mentorAvatarWrap}>
                  <Text style={styles.mentorAvatarText}>{m.name?.charAt(0)}</Text>
                </View>
                <Text style={styles.mentorName} numberOfLines={1}>{m.name}</Text>
                <Text style={styles.mentorSub} numberOfLines={1}>{m.college || 'IIT Alumni'}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={COLORS.accent} />
                  <Text style={styles.ratingText}>{m.rating || '4.9'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Community Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join the Community</Text>
          <View style={styles.communityGrid}>
            <TouchableOpacity 
              style={[styles.communityCard, { backgroundColor: '#E7F9ED' }]}
              onPress={() => WebBrowser.openBrowserAsync('https://chat.whatsapp.com/GjD1oH2jF0e3X8Q9L6Z5Y2')}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              <Text style={styles.communityTitle}>WhatsApp Group</Text>
              <Text style={styles.communityCount}>1.5k+ Members</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.communityCard, { backgroundColor: '#E0F2FE' }]}
              onPress={() => WebBrowser.openBrowserAsync('https://t.me/apnacounsellor')}
            >
              <Ionicons name="paper-plane" size={24} color="#0088cc" />
              <Text style={styles.communityTitle}>Telegram Channel</Text>
              <Text style={styles.communityCount}>5k+ Students</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Colleges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Trending Colleges</Text>
          {colleges.map((c, i) => (
            <TouchableOpacity key={i} style={styles.collegeListCard} onPress={() => router.push(`/college/${c.id}`)}>
              <View style={styles.collegeIcon}>
                <Ionicons name="business" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.collegeInfo}>
                <Text style={styles.collegeName}>{c.short_name || c.name}</Text>
                <Text style={styles.collegeLoc}>{c.city}, {c.state} · NIRF #{c.nirf_rank}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  greetingText: { fontSize: 16, color: COLORS.textSecondary, fontWeight: '500' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 2 },
  userNameText: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, marginTop: 4 },
  profileBtn: { padding: 4 },
  aiHeroCard: {
    marginHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.md,
    marginBottom: 24,
  },
  aiIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiContent: { flex: 1, marginLeft: 16 },
  aiTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  aiDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 48) / 2,
    height: 110,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  actionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, paddingHorizontal: 24, marginBottom: 16 },
  seeAllText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  horizontalScroll: { paddingLeft: 24, paddingRight: 8 },
  mentorCard: {
    width: 130,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  mentorAvatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mentorAvatarText: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  mentorName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  mentorSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  communityGrid: { flexDirection: 'row', paddingHorizontal: 24, gap: 16 },
  communityCard: { flex: 1, borderRadius: 20, padding: 16, alignItems: 'center', justifyContent: 'center' },
  communityTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, marginTop: 12, textAlign: 'center' },
  communityCount: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  collegeListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  collegeIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  collegeInfo: { flex: 1, marginLeft: 16 },
  collegeName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  collegeLoc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});
