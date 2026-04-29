import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiCall } from '../../src/utils/api';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function BatchDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => { if (id) fetchBatch(); }, [id]);

  async function fetchBatch() {
    try {
      const data = await apiCall(`/batches/${id}`);
      setBatch(data);
      setJoined((data.students || []).includes(user?.id));
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function handleJoin() {
    setJoining(true);
    try {
      await apiCall(`/batches/${id}/join`, { method: 'POST' });
      setJoined(true);
      setBatch((prev: any) => ({ ...prev, current_students: (prev?.current_students || 0) + 1 }));
      Alert.alert('Joined!', 'You have joined this batch.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to join');
    } finally { setJoining(false); }
  }

  if (loading) return <SafeAreaView style={styles.container}><View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View></SafeAreaView>;
  if (!batch) return <SafeAreaView style={styles.container}><View style={styles.center}><Text style={styles.errText}>Batch not found</Text></View></SafeAreaView>;

  const spotsLeft = batch.max_students - batch.current_students;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity testID="batch-back-btn" style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={[styles.statusBadge, batch.status === 'ongoing' ? styles.ongoingBadge : styles.upcomingBadge]}>
          <Text style={styles.statusText}>{batch.status}</Text>
        </View>
        <Text style={styles.title}>{batch.title}</Text>
        <Text style={styles.description}>{batch.description}</Text>

        <View style={styles.mentorRow}>
          <View style={styles.mentorAvatar}><Text style={styles.mentorAvatarText}>{(batch.mentor_name || 'M')[0]}</Text></View>
          <View>
            <Text style={styles.mentorName}>{batch.mentor_name}</Text>
            {batch.mentor_college ? <Text style={styles.mentorCollege}>{batch.mentor_college}</Text> : null}
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Ionicons name="calendar" size={18} color={COLORS.primary} />
            <Text style={styles.detailLabel}>Schedule</Text>
            <Text style={styles.detailValue}>{batch.schedule}</Text>
          </View>
          <View style={styles.detailCard}>
            <Ionicons name="people" size={18} color={COLORS.primary} />
            <Text style={styles.detailLabel}>Students</Text>
            <Text style={styles.detailValue}>{batch.current_students}/{batch.max_students}</Text>
          </View>
          <View style={styles.detailCard}>
            <Ionicons name="time" size={18} color={COLORS.primary} />
            <Text style={styles.detailLabel}>Starts</Text>
            <Text style={styles.detailValue}>{batch.start_date}</Text>
          </View>
          <View style={styles.detailCard}>
            <Ionicons name="flag" size={18} color={COLORS.primary} />
            <Text style={styles.detailLabel}>Ends</Text>
            <Text style={styles.detailValue}>{batch.end_date}</Text>
          </View>
        </View>

        {batch.topics && batch.topics.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Topics Covered</Text>
            <View style={styles.topicsWrap}>
              {batch.topics.map((t: string, i: number) => (
                <View key={i} style={styles.topicTag}><Text style={styles.topicText}>{t}</Text></View>
              ))}
            </View>
          </View>
        )}

        {spotsLeft <= 5 && spotsLeft > 0 && (
          <View style={styles.urgencyBanner}>
            <Ionicons name="flame" size={16} color={COLORS.primary} />
            <Text style={styles.urgencyText}>Only {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left!</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>₹{batch.price}</Text>
        </View>
        <TouchableOpacity
          testID="join-batch-btn"
          style={[styles.joinBtn, (joined || spotsLeft <= 0) && styles.joinedBtn]}
          onPress={joined || spotsLeft <= 0 ? undefined : handleJoin}
          disabled={joining || joined || spotsLeft <= 0}
        >
          {joining ? <ActivityIndicator color={COLORS.textInverse} /> :
            <Text style={styles.joinBtnText}>{joined ? 'Joined' : spotsLeft <= 0 ? 'Full' : 'Join Batch'}</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  scroll: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xl, paddingBottom: 120 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  statusBadge: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.pill, alignSelf: 'flex-start', marginBottom: SPACING.sm },
  upcomingBadge: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  ongoingBadge: { backgroundColor: COLORS.primary },
  statusText: { ...TYPOGRAPHY.caption, fontWeight: '700', fontSize: 12, textTransform: 'capitalize', color: COLORS.textPrimary },
  title: { ...TYPOGRAPHY.h1, color: COLORS.primary, marginBottom: SPACING.sm },
  description: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, lineHeight: 24, marginBottom: SPACING.lg },
  mentorRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xl },
  mentorAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  mentorAvatarText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary },
  mentorName: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary },
  mentorCollege: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  detailCard: { width: '48%' as any, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, gap: 4 },
  detailLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  detailValue: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary, fontSize: 14 },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary, marginBottom: SPACING.md },
  topicsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  topicTag: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, backgroundColor: COLORS.primary },
  topicText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '600' },
  urgencyBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  urgencyText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingBottom: SPACING.xl, borderTopWidth: 1, borderTopColor: COLORS.border },
  priceLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  priceValue: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  joinBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: SPACING.xl, borderRadius: RADIUS.pill },
  joinedBtn: { backgroundColor: COLORS.textSecondary },
  joinBtnText: { ...TYPOGRAPHY.body, color: COLORS.textInverse, fontWeight: '700', fontSize: 16 },
});
