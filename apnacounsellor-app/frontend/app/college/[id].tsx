import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  ActivityIndicator, Image, Linking, Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { apiCall } from '../../src/utils/api';

const { width } = Dimensions.get('window');

export default function CollegeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    fetchCollege();
  }, [id]);

  const fetchCollege = async () => {
    try {
      const res = await apiCall(`/colleges/${id}`);
      setCollege(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openWebsite = () => {
    if (college?.website) {
      Linking.openURL(college.website);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={s.loadingText}>Loading college details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!college) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>College Not Found</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={s.center}>
          <Ionicons name="school-outline" size={60} color={COLORS.textMuted} />
          <Text style={s.errorText}>College not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{college.short_name || college.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={s.heroSection}>
          <View style={s.logoContainer}>
            {college.image_url && !logoError ? (
              <Image
                source={{ uri: college.image_url }}
                style={s.logo}
                onError={() => setLogoError(true)}
                resizeMode="contain"
              />
            ) : (
              <View style={s.logoPlaceholder}>
                <Ionicons name="school" size={50} color={COLORS.primary} />
              </View>
            )}
          </View>
          
          <Text style={s.collegeName}>{college.name}</Text>
          {college.short_name && college.short_name !== college.name && (
            <Text style={s.shortName}>{college.short_name}</Text>
          )}
          
          {/* Tags Row */}
          <View style={s.tagsRow}>
            {college.city && (
              <View style={s.tag}>
                <Ionicons name="location" size={14} color={COLORS.primary} />
                <Text style={s.tagText}>{college.city}, {college.state}</Text>
              </View>
            )}
            {college.type && (
              <View style={[s.tag, s.typeTag]}>
                <Text style={s.tagText}>{college.type}</Text>
              </View>
            )}
            {college.nirf_rank > 0 && (
              <View style={[s.tag, s.nirfTag]}>
                <Ionicons name="trophy" size={12} color="#856404" />
                <Text style={[s.tagText, s.nirfText]}>NIRF #{college.nirf_rank}</Text>
              </View>
            )}
          </View>

          {/* Visit Website Button */}
          {college.website && (
            <TouchableOpacity style={s.websiteBtn} onPress={openWebsite}>
              <Ionicons name="globe-outline" size={18} color="#fff" />
              <Text style={s.websiteBtnText}>Visit Website</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Cards */}
        <View style={s.statsSection}>
          <Text style={s.sectionTitle}>Key Information</Text>
          <View style={s.statsGrid}>
            {college.established > 0 && (
              <View style={s.statCard}>
                <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
                <Text style={s.statValue}>{college.established}</Text>
                <Text style={s.statLabel}>Established</Text>
              </View>
            )}
            {college.annual_fee && (
              <View style={s.statCard}>
                <Ionicons name="card-outline" size={24} color={COLORS.primaryMedium} />
                <Text style={s.statValue}>{college.annual_fee}</Text>
                <Text style={s.statLabel}>Annual Fee</Text>
              </View>
            )}
            {college.avg_package && (
              <View style={s.statCard}>
                <Ionicons name="trending-up-outline" size={24} color={COLORS.success} />
                <Text style={s.statValue}>{college.avg_package}</Text>
                <Text style={s.statLabel}>Avg Package</Text>
              </View>
            )}
            {college.highest_package && (
              <View style={s.statCard}>
                <Ionicons name="star-outline" size={24} color={COLORS.gold} />
                <Text style={s.statValue}>{college.highest_package}</Text>
                <Text style={s.statLabel}>Highest Package</Text>
              </View>
            )}
            {college.campus_area && (
              <View style={s.statCard}>
                <Ionicons name="map-outline" size={24} color={COLORS.info} />
                <Text style={s.statValue}>{college.campus_area}</Text>
                <Text style={s.statLabel}>Campus Area</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        {college.description && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>About</Text>
            <View style={s.card}>
              <Text style={s.description}>{college.description}</Text>
            </View>
          </View>
        )}

        {/* Branches */}
        {college.branches?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Branches Offered ({college.branches.length})</Text>
            <View style={s.card}>
              <View style={s.chipsContainer}>
                {college.branches.map((branch: string, idx: number) => (
                  <View key={idx} style={s.branchChip}>
                    <Ionicons name="school-outline" size={14} color={COLORS.primary} />
                    <Text style={s.branchText}>{branch}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Highlights */}
        {college.highlights?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Highlights</Text>
            <View style={s.card}>
              {college.highlights.map((highlight: string, idx: number) => (
                <View key={idx} style={s.highlightRow}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                  <Text style={s.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Counselling */}
        {college.counselling?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Admission Through</Text>
            <View style={s.card}>
              <View style={s.chipsContainer}>
                {college.counselling.map((c: string, idx: number) => (
                  <View key={idx} style={s.counsellingChip}>
                    <Ionicons name="document-text-outline" size={14} color="#fff" />
                    <Text style={s.counsellingText}>{c}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Cutoffs */}
        {college.cutoffs && Object.keys(college.cutoffs).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Cutoff Information</Text>
            <View style={s.card}>
              {Object.entries(college.cutoffs).map(([exam, cutoff]: [string, any], idx: number) => (
                <View key={idx} style={s.cutoffRow}>
                  <Text style={s.cutoffExam}>{exam}</Text>
                  <Text style={s.cutoffValue}>{typeof cutoff === 'object' ? JSON.stringify(cutoff) : cutoff}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  loadingText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginTop: SPACING.md },
  errorText: { ...TYPOGRAPHY.h3, color: COLORS.textMuted, marginTop: SPACING.md },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary, flex: 1, textAlign: 'center' },
  
  scroll: { flex: 1 },
  
  heroSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: RADIUS.xl * 2,
    borderBottomRightRadius: RADIUS.xl * 2,
    ...SHADOWS.md,
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.lg,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryLavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collegeName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  shortName: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLavender,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  typeTag: {
    backgroundColor: COLORS.surface,
  },
  nirfTag: {
    backgroundColor: '#FFF3CD',
  },
  tagText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  nirfText: {
    color: '#856404',
    fontWeight: '700',
  },
  websiteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    ...SHADOWS.md,
  },
  websiteBtnText: {
    ...TYPOGRAPHY.body,
    color: '#fff',
    fontWeight: '700',
  },
  
  statsSection: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statCard: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 2) / 3,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: SPACING.xs,
    textAlign: 'center',
    fontSize: 13,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  branchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLavender,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
  },
  branchText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  highlightText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  
  counsellingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
  },
  counsellingText: {
    ...TYPOGRAPHY.caption,
    color: '#fff',
    fontWeight: '700',
  },
  
  cutoffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cutoffExam: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  cutoffValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
