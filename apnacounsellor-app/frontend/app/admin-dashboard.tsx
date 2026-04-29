import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator, Image, Alert } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { apiCall } from '../src/utils/api';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'applications' | 'colleges'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await apiCall('/admin/dashboard');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiCall('/admin/users');
      setUsers(res || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchColleges = async () => {
    try {
      const res = await apiCall('/colleges');
      setColleges(res || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPendingMentors = async () => {
    try {
      const res = await apiCall('/admin/pending-mentors');
      setPendingMentors(res || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user === undefined) return; // Auth still loading
    if (user?.role === 'admin') {
      fetchDashboard();
      fetchUsers();
      fetchColleges();
      fetchPendingMentors();
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
    fetchUsers();
    fetchColleges();
    fetchPendingMentors();
  };

  const handleDeleteCollege = async (collegeId: string, collegeName: string) => {
    Alert.alert(
      'Delete College',
      `Remove "${collegeName}" from the database? The data will be permanently deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiCall(`/admin/colleges/${collegeId}`, { method: 'DELETE' });
              setColleges(prev => prev.filter(c => c.id !== collegeId));
              Alert.alert('Deleted', `${collegeName} has been removed.`);
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Failed to delete college');
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
          await apiCall(`/admin/users/${userId}/action`, { method: 'PUT', body: JSON.stringify({ action: 'delete' }) });
            fetchUsers();
            Alert.alert('Success', 'User deleted');
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      await apiCall(`/admin/users/${userId}/action`, { method: 'PUT', body: JSON.stringify({ action: isBlocked ? 'unblock' : 'block', reason: 'Admin action' }) });
      fetchUsers();
      Alert.alert('Success', isBlocked ? 'User unblocked' : 'User blocked');
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveApplication = async (userId: string) => {
    try {
      await apiCall(`/admin/users/${userId}/action`, { method: 'PUT', body: JSON.stringify({ action: 'approve' }) });
      fetchDashboard();
      fetchPendingMentors();
      Alert.alert('Success', 'Mentor approved!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectApplication = async (userId: string, reason?: string) => {
    try {
      await apiCall(`/admin/users/${userId}/action`, { method: 'PUT', body: JSON.stringify({ action: 'reject', reason }) });
      fetchDashboard();
      fetchPendingMentors();
      Alert.alert('Success', 'Application rejected');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAllColleges = () => {
    Alert.alert(
      'Delete All Colleges',
      `Are you sure you want to delete ALL ${colleges.length} colleges from the database? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete all colleges one by one
              for (const college of colleges) {
                await apiCall(`/admin/colleges/${college.id}`, { method: 'DELETE' });
              }
              setColleges([]);
              Alert.alert('Success', 'All colleges have been deleted.');
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Failed to delete all colleges');
              fetchColleges(); // Refresh to show remaining
            }
          },
        },
      ]
    );
  };

  // Show loading while auth is checking
  if (authLoading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Auth guard — redirect non-admins
  if (!user || user.role !== 'admin') {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  // Show loading while fetching dashboard data
  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const stats = data?.stats || {};

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Link href="/(tabs)/dashboard" asChild>
          <TouchableOpacity style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </Link>
        <Text style={s.headerTitle}>Admin Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll}>
        <View style={s.tabs}>
          {(['overview', 'users', 'applications', 'colleges'] as const).map((tab) => (
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
      </ScrollView>

      <ScrollView
        style={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <View style={s.statsGrid}>
              <View style={s.statCard}>
                <Ionicons name="people-outline" size={24} color={COLORS.primary} />
                <Text style={s.statValue}>{stats.total_students || 0}</Text>
                <Text style={s.statLabel}>Students</Text>
              </View>
              <View style={s.statCard}>
                <Ionicons name="school-outline" size={24} color={COLORS.primaryMedium} />
                <Text style={s.statValue}>{stats.total_mentors || 0}</Text>
                <Text style={s.statLabel}>Mentors</Text>
              </View>
              <View style={s.statCard}>
                <Ionicons name="briefcase-outline" size={24} color={COLORS.info} />
                <Text style={s.statValue}>{stats.total_counsellors || 0}</Text>
                <Text style={s.statLabel}>Counsellors</Text>
              </View>
              <View style={s.statCard}>
                <Ionicons name="business-outline" size={24} color={COLORS.warning} />
                <Text style={s.statValue}>{stats.total_colleges || 0}</Text>
                <Text style={s.statLabel}>Colleges</Text>
              </View>
              <View style={s.statCard}>
                <Ionicons name="calendar-outline" size={24} color={COLORS.success} />
                <Text style={s.statValue}>{stats.total_sessions || 0}</Text>
                <Text style={s.statLabel}>Sessions</Text>
              </View>
              <View style={s.statCard}>
                <Ionicons name="wallet-outline" size={24} color={COLORS.gold} />
                <Text style={s.statValue}>₹{stats.total_revenue || 0}</Text>
                <Text style={s.statLabel}>Revenue</Text>
              </View>
            </View>

            {/* Pending Applications */}
            {data?.pending_applications?.length > 0 && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Pending Counsellor Applications ({stats.pending_applications})</Text>
                {data.pending_applications.map((app: any) => (
                  <View key={app.id} style={s.appCard}>
                    <View style={s.appInfo}>
                      <Text style={s.appName}>{app.name}</Text>
                      <Text style={s.appEmail}>{app.email}</Text>
                      <Text style={s.appDetail}>{app.qualification} • {app.experience}</Text>
                      <View style={s.specTags}>
                        {app.specialization?.slice(0, 3).map((spec: string, i: number) => (
                          <View key={i} style={s.specTag}>
                            <Text style={s.specTagText}>{spec}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View style={s.appActions}>
                      <TouchableOpacity
                        style={[s.actionBtn, s.approveBtn]}
                        onPress={() => handleApproveApplication(app.id)}
                      >
                        <Ionicons name="checkmark" size={18} color={COLORS.textInverse} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.actionBtn, s.rejectBtn]}
                        onPress={() => handleRejectApplication(app.id)}
                      >
                        <Ionicons name="close" size={18} color={COLORS.textInverse} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Recent Users */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Recent Users</Text>
              {data?.recent_users?.slice(0, 5).map((u: any) => (
                <View key={u.id} style={s.userCard}>
                  <View style={s.userAvatar}>
                    <Text style={s.userAvatarText}>{u.name?.[0]?.toUpperCase() || '?'}</Text>
                  </View>
                  <View style={s.userInfo}>
                    <Text style={s.userName}>{u.name}</Text>
                    <Text style={s.userEmail}>{u.email}</Text>
                  </View>
                  <View style={[s.roleBadge, u.role === 'mentor' && s.mentorBadge, u.role === 'admin' && s.adminBadge]}>
                    <Text style={s.roleBadgeText}>{u.role}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'users' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>All Users ({users.length})</Text>
            {users.map((u: any) => (
              <View key={u.id} style={[s.userCard, u.blocked && s.userCardBlocked]}>
                <View style={s.userAvatar}>
                  <Text style={s.userAvatarText}>{u.name?.[0]?.toUpperCase() || '?'}</Text>
                </View>
                <View style={s.userInfo}>
                  <View style={s.userNameRow}>
                    <Text style={s.userName}>{u.name}</Text>
                    {u.blocked && (
                      <View style={s.blockedBadge}>
                        <Text style={s.blockedBadgeText}>Blocked</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.userEmail}>{u.email}</Text>
                </View>
                <View style={[s.roleBadge, u.role === 'mentor' && s.mentorBadge, u.role === 'admin' && s.adminBadge]}>
                  <Text style={s.roleBadgeText}>{u.role}</Text>
                </View>
                {u.role !== 'admin' && (
                  <View style={s.userActions}>
                    <TouchableOpacity onPress={() => handleBlockUser(u.id, u.blocked)} style={s.actionIconBtn}>
                      <Ionicons name={u.blocked ? 'lock-open-outline' : 'lock-closed-outline'} size={16} color={u.blocked ? COLORS.success : COLORS.warning} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteUser(u.id)} style={s.actionIconBtn}>
                      <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'applications' && (
          <View style={s.section}>
            {/* Pending Mentors Section */}
            <Text style={s.sectionTitle}>Pending Mentor Approvals ({pendingMentors.length})</Text>
            {pendingMentors.length === 0 && (
              <Text style={s.emptyText}>No pending mentor applications</Text>
            )}
            {pendingMentors.map((mentor: any) => (
              <View key={mentor.id} style={s.appCardFull}>
                <Text style={s.appName}>{mentor.name}</Text>
                <Text style={s.appEmail}>{mentor.email} • {mentor.phone}</Text>
                <Text style={s.appDetail}>{mentor.college} - {mentor.branch}</Text>
                <Text style={s.appDetail}>Year: {mentor.year}</Text>
                {mentor.headline && <Text style={s.appBio}>{mentor.headline}</Text>}
                {mentor.about && <Text style={[s.appDetail, {marginTop: 4}]}>{mentor.about}</Text>}
                <View style={s.specTags}>
                  {mentor.help_categories?.slice(0, 5).map((cat: string, i: number) => (
                    <View key={i} style={s.specTag}>
                      <Text style={s.specTagText}>{cat}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.appActionsRow}>
                  <TouchableOpacity
                    style={[s.actionBtnFull, s.approveBtn]}
                    onPress={() => handleApproveApplication(mentor.id)}
                  >
                    <Ionicons name="checkmark" size={18} color={COLORS.textInverse} />
                    <Text style={s.actionBtnText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.actionBtnFull, s.rejectBtn]}
                    onPress={() => handleRejectApplication(mentor.id, 'Profile incomplete or not suitable')}
                  >
                    <Ionicons name="close" size={18} color={COLORS.textInverse} />
                    <Text style={s.actionBtnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Old Counsellor Applications */}
            {data?.pending_applications?.length > 0 && (
              <>
                <Text style={[s.sectionTitle, {marginTop: SPACING.lg}]}>Counsellor Applications</Text>
                {data?.pending_applications?.map((app: any) => (
                  <View key={app.id} style={s.appCardFull}>
                    <Text style={s.appName}>{app.name}</Text>
                    <Text style={s.appEmail}>{app.email} • {app.phone}</Text>
                    <Text style={s.appDetail}>{app.qualification}</Text>
                    <Text style={s.appDetail}>Experience: {app.experience}</Text>
                    <Text style={s.appBio}>{app.bio}</Text>
                    <View style={s.specTags}>
                      {app.specialization?.map((spec: string, i: number) => (
                        <View key={i} style={s.specTag}>
                          <Text style={s.specTagText}>{spec}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={s.appActionsRow}>
                      <TouchableOpacity
                        style={[s.actionBtnFull, s.approveBtn]}
                        onPress={() => handleApproveApplication(app.id)}
                      >
                        <Ionicons name="checkmark" size={18} color={COLORS.textInverse} />
                        <Text style={s.actionBtnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.actionBtnFull, s.rejectBtn]}
                        onPress={() => handleRejectApplication(app.id)}
                      >
                        <Ionicons name="close" size={18} color={COLORS.textInverse} />
                        <Text style={s.actionBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {activeTab === 'colleges' && (
          <View style={s.section}>
            <View style={s.sectionHeaderRow}>
              <Text style={s.sectionTitle}>Colleges ({colleges.length})</Text>
              <View style={s.collegeActionsRow}>
                {colleges.length > 0 && (
                  <TouchableOpacity style={s.deleteAllBtn} onPress={handleDeleteAllColleges}>
                    <Ionicons name="trash-outline" size={14} color={COLORS.error} />
                    <Text style={s.deleteAllBtnText}>Delete All</Text>
                  </TouchableOpacity>
                )}
                <Link href="/admin-add-college" asChild>
                  <TouchableOpacity style={s.aiAddBtn}>
                    <Ionicons name="sparkles" size={14} color="#fff" />
                    <Text style={s.aiAddBtnText}>+ AI Add</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
            {colleges.length === 0 && (
              <View style={s.emptyCollegeBox}>
                <Ionicons name="business-outline" size={40} color={COLORS.textMuted} />
                <Text style={s.emptyCollegeTitle}>No Colleges Yet</Text>
                <Text style={s.emptyCollegeText}>Use "AI Add" to scrape college websites and add them here. The data is used for predictor tool — not shown to students.</Text>
                <Link href="/admin-add-college" asChild>
                  <TouchableOpacity style={s.aiAddBtnLg}>
                    <Ionicons name="sparkles" size={16} color="#fff" />
                    <Text style={s.aiAddBtnLgText}>Add College with AI</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
            {colleges.map((c: any) => (
              <View key={c.id} style={s.collegeCard}>
                {/* Logo */}
                <View style={s.collegeLogoWrap}>
                  {c.image_url ? (
                    <Image source={{ uri: c.image_url }} style={s.collegeLogo} resizeMode="contain" />
                  ) : (
                    <Ionicons name="school" size={22} color={COLORS.primary} />
                  )}
                </View>
                <View style={s.collegeInfo}>
                  <Text style={s.collegeName} numberOfLines={1}>{c.short_name || c.name}</Text>
                  <Text style={s.collegeLocation}>{c.city ? `${c.city}, ` : ''}{c.state}</Text>
                  <View style={s.collegeMeta}>
                    <Text style={s.collegeType}>{c.type}</Text>
                    {c.nirf_rank > 0 && <Text style={s.collegeRank}>NIRF #{c.nirf_rank}</Text>}
                    {c.website ? (
                      <Text style={s.collegeWebsite} numberOfLines={1}>{c.website.replace('https://', '').replace('http://', '').split('/')[0]}</Text>
                    ) : null}
                  </View>
                </View>
                <TouchableOpacity
                  style={s.deleteCollegeBtn}
                  onPress={() => handleDeleteCollege(c.id, c.short_name || c.name)}
                >
                  <Ionicons name="trash-outline" size={17} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}
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
  tabsScroll: { backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.sm },
  tab: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 13 },
  tabTextActive: { color: COLORS.primary, fontWeight: '600' },
  scroll: { flex: 1, padding: SPACING.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: { width: '31%', backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOWS.sm },
  statValue: { ...TYPOGRAPHY.h3, color: COLORS.primary, marginTop: SPACING.xs },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 10 },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary, marginBottom: SPACING.md },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  aiAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: 6 },
  aiAddBtnText: { ...TYPOGRAPHY.caption, color: '#fff', fontWeight: '700', fontSize: 12 },
  appCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  appCardFull: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  appInfo: { flex: 1 },
  appName: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary },
  appEmail: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  appDetail: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginTop: 2 },
  appBio: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginVertical: SPACING.sm, fontSize: 14 },
  specTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: SPACING.xs },
  specTag: { backgroundColor: COLORS.primaryLavender, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.pill },
  specTagText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontSize: 10 },
  appActions: { flexDirection: 'row', gap: SPACING.sm },
  appActionsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  actionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  actionBtnFull: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.sm, borderRadius: RADIUS.md },
  actionBtnText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '600' },
  approveBtn: { backgroundColor: COLORS.success },
  rejectBtn: { backgroundColor: COLORS.error },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLavender, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm },
  userAvatarText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary },
  userInfo: { flex: 1 },
  userName: { ...TYPOGRAPHY.body, fontWeight: '500', color: COLORS.textPrimary },
  userEmail: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  roleBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface },
  mentorBadge: { backgroundColor: COLORS.primaryLavender },
  adminBadge: { backgroundColor: COLORS.primary },
  roleBadgeText: { ...TYPOGRAPHY.caption, fontSize: 10, fontWeight: '600', color: COLORS.textPrimary, textTransform: 'capitalize' },
  deleteBtn: { padding: SPACING.sm, marginLeft: SPACING.sm },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: SPACING.xl },
  collegeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm, gap: SPACING.sm },
  collegeLogoWrap: { width: 44, height: 44, borderRadius: RADIUS.sm, backgroundColor: COLORS.primaryLavender, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  collegeLogo: { width: 44, height: 44 },
  collegeInfo: { flex: 1 },
  collegeName: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary },
  collegeLocation: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 12 },
  collegeMeta: { flexDirection: 'row', gap: SPACING.sm, marginTop: 2, flexWrap: 'wrap', alignItems: 'center' },
  collegeType: { ...TYPOGRAPHY.caption, color: COLORS.primaryMedium, fontWeight: '500', fontSize: 11 },
  collegeRank: { ...TYPOGRAPHY.caption, color: COLORS.gold, fontWeight: '500', fontSize: 11 },
  collegeWebsite: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, fontSize: 10, flex: 1 },
  deleteCollegeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  emptyCollegeBox: { alignItems: 'center', padding: SPACING.xl, backgroundColor: COLORS.background, borderRadius: RADIUS.xl, ...SHADOWS.sm, gap: SPACING.md },
  emptyCollegeTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  emptyCollegeText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, fontSize: 14 },
  aiAddBtnLg: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, ...SHADOWS.md },
  aiAddBtnLgText: { ...TYPOGRAPHY.body, color: '#fff', fontWeight: '700' },
  userCardBlocked: { opacity: 0.7, borderLeftWidth: 3, borderLeftColor: COLORS.error },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  blockedBadge: { backgroundColor: COLORS.errorLight, paddingHorizontal: 6, paddingVertical: 1, borderRadius: RADIUS.pill },
  blockedBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontSize: 9, fontWeight: '600' },
  userActions: { flexDirection: 'row', gap: SPACING.xs },
  actionIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  collegeActionsRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  deleteAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF0F0', borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.error },
  deleteAllBtnText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontWeight: '700', fontSize: 12 },
});
