import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  ActivityIndicator, Image, TextInput, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../src/constants/theme';
import { apiCall } from '../src/utils/api';

export default function BrowseColleges() {
  const router = useRouter();
  const [colleges, setColleges] = useState<any[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const COLLEGE_TYPES = ['All', 'IIT', 'NIT', 'IIIT', 'State University', 'Private', 'Deemed'];

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    filterColleges();
  }, [colleges, search, selectedType]);

  const fetchColleges = async () => {
    try {
      const res = await apiCall('/colleges');
      setColleges(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterColleges = () => {
    let filtered = [...colleges];
    
    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(s) ||
        c.short_name?.toLowerCase().includes(s) ||
        c.city?.toLowerCase().includes(s) ||
        c.state?.toLowerCase().includes(s)
      );
    }
    
    if (selectedType && selectedType !== 'All') {
      filtered = filtered.filter(c => c.type?.includes(selectedType));
    }
    
    setFilteredColleges(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchColleges();
  };

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={s.loadingText}>Loading colleges...</Text>
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
        <Text style={s.headerTitle}>Browse Colleges</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={s.searchSection}>
        <View style={s.searchRow}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search by name, city, state..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Type Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
          <View style={s.filterRow}>
            {COLLEGE_TYPES.map(type => (
              <TouchableOpacity
                key={type}
                style={[s.filterChip, (selectedType === type || (type === 'All' && !selectedType)) && s.filterChipActive]}
                onPress={() => setSelectedType(type === 'All' ? null : type)}
              >
                <Text style={[s.filterText, (selectedType === type || (type === 'All' && !selectedType)) && s.filterTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={s.resultsHeader}>
        <Text style={s.resultsCount}>{filteredColleges.length} Colleges</Text>
      </View>

      {/* College List */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {filteredColleges.length === 0 ? (
          <View style={s.emptyState}>
            <Ionicons name="school-outline" size={60} color={COLORS.textMuted} />
            <Text style={s.emptyTitle}>No colleges found</Text>
            <Text style={s.emptyText}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          filteredColleges.map((college) => (
            <TouchableOpacity
              key={college.id}
              style={s.collegeCard}
              onPress={() => router.push(`/college/${college.id}`)}
              activeOpacity={0.7}
            >
              <View style={s.cardTop}>
                {/* Logo */}
                <View style={s.logoContainer}>
                  {college.image_url ? (
                    <Image source={{ uri: college.image_url }} style={s.logo} resizeMode="contain" />
                  ) : (
                    <View style={s.logoPlaceholder}>
                      <Ionicons name="school" size={28} color={COLORS.primary} />
                    </View>
                  )}
                </View>
                
                {/* Info */}
                <View style={s.cardInfo}>
                  <Text style={s.collegeName} numberOfLines={2}>{college.name}</Text>
                  {college.short_name && college.short_name !== college.name && (
                    <Text style={s.shortName}>{college.short_name}</Text>
                  )}
                  
                  <View style={s.metaRow}>
                    {college.city && (
                      <View style={s.metaItem}>
                        <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
                        <Text style={s.metaText}>{college.city}, {college.state}</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                {/* Arrow */}
                <View style={s.arrowContainer}>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                </View>
              </View>
              
              {/* Tags */}
              <View style={s.tagsRow}>
                {college.type && (
                  <View style={s.typeTag}>
                    <Text style={s.typeText}>{college.type}</Text>
                  </View>
                )}
                {college.nirf_rank > 0 && (
                  <View style={s.nirfTag}>
                    <Ionicons name="trophy" size={10} color="#856404" />
                    <Text style={s.nirfText}>NIRF #{college.nirf_rank}</Text>
                  </View>
                )}
                {college.avg_package && (
                  <View style={s.packageTag}>
                    <Ionicons name="trending-up" size={10} color={COLORS.success} />
                    <Text style={s.packageText}>{college.avg_package}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginTop: SPACING.md },
  
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
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  
  searchSection: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
  },
  filterScroll: {
    marginTop: SPACING.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  
  resultsHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  resultsCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  
  collegeCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  logoContainer: {},
  logo: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  collegeName: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.primary,
    lineHeight: 20,
  },
  shortName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: SPACING.sm,
  },
  
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  typeTag: {
    backgroundColor: COLORS.primaryLavender,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  typeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  nirfTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF3CD',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  nirfText: {
    ...TYPOGRAPHY.caption,
    color: '#856404',
    fontSize: 11,
    fontWeight: '700',
  },
  packageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  packageText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '600',
  },
});
