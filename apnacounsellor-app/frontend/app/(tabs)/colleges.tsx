import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const TYPES = ['All', 'IIT', 'NIT', 'IIIT', 'Private', 'State'];

export default function Colleges() {
  const router = useRouter();
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => { fetch(); }, [search, filterType]);

  async function fetch() {
    setLoading(true);
    try {
      const p: string[] = [];
      if (search) p.push(`search=${encodeURIComponent(search)}`);
      if (filterType !== 'All') p.push(`college_type=${encodeURIComponent(filterType)}`);
      const data = await apiCall('/colleges' + (p.length ? '?' + p.join('&') : ''));
      setColleges(Array.isArray(data) ? data : []);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.title}>Colleges</Text>
          <TouchableOpacity testID="predictor-btn" style={s.predictBtn} onPress={() => router.push('/predictor')}>
            <Ionicons name="analytics" size={18} color={COLORS.textInverse} />
            <Text style={s.predictBtnText}>Predict</Text>
          </TouchableOpacity>
        </View>
        <View style={s.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput testID="college-search" style={s.searchInput} placeholder="Search colleges..." placeholderTextColor={COLORS.textSecondary} value={search} onChangeText={setSearch} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.typeScroll}>
          {TYPES.map(t => (
            <TouchableOpacity key={t} testID={`type-${t}`} style={[s.typeChip, filterType === t && s.typeChipActive]} onPress={() => setFilterType(t)}>
              <Text style={[s.typeText, filterType === t && s.typeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? <View style={s.center}><ActivityIndicator size="large" color={COLORS.primary} /></View> : (
        <ScrollView contentContainerStyle={s.list}>
          <TouchableOpacity testID="compare-btn" style={s.compareCard} onPress={() => router.push('/compare')}>
            <Ionicons name="git-compare" size={24} color={COLORS.primary} />
            <View style={s.compareText}><Text style={s.compareTitle}>Compare Colleges</Text><Text style={s.compareSub}>Side-by-side comparison of any colleges</Text></View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          {colleges.map((c, i) => (
            <TouchableOpacity key={i} testID={`college-${i}`} style={s.card} onPress={() => router.push(`/college/${c.id}`)} activeOpacity={0.8}>
              <View style={s.cardTop}>
                <View style={s.rankBadge}><Text style={s.rankText}>#{c.nirf_rank}</Text></View>
                <View style={s.typeBadge}><Text style={s.typeBadgeText}>{c.type}</Text></View>
              </View>
              <Text style={s.collegeName}>{c.short_name || c.name}</Text>
              <Text style={s.collegeLocation}>{c.city}, {c.state}</Text>
              <View style={s.statsRow}>
                <View style={s.statItem}><Text style={s.statLabel}>Fee</Text><Text style={s.statVal}>{c.annual_fee}</Text></View>
                <View style={s.statItem}><Text style={s.statLabel}>Avg Package</Text><Text style={s.statVal}>{c.avg_package}</Text></View>
                <View style={s.statItem}><Text style={s.statLabel}>Highest</Text><Text style={s.statVal}>{c.highest_package}</Text></View>
              </View>
              <View style={s.branchesWrap}>
                {(c.branches || []).slice(0, 4).map((b: string, j: number) => <View key={j} style={s.branchTag}><Text style={s.branchTagText}>{b}</Text></View>)}
                {(c.branches || []).length > 4 && <Text style={s.moreText}>+{(c.branches || []).length - 4}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, backgroundColor: COLORS.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  predictBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, ...SHADOWS.sm },
  predictBtnText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '700', fontSize: 13 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, height: 44, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm, marginBottom: SPACING.md, ...SHADOWS.sm },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  typeScroll: { gap: SPACING.sm, paddingBottom: SPACING.md },
  typeChip: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  typeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, fontSize: 13 },
  typeTextActive: { color: COLORS.textInverse },
  list: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 100 },
  compareCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  compareText: { flex: 1 },
  compareTitle: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary },
  compareSub: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  card: { backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  rankBadge: { backgroundColor: COLORS.primaryMedium, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.pill },
  rankText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '800', fontSize: 12 },
  typeBadge: { backgroundColor: COLORS.primaryLavender, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.pill },
  typeBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600', fontSize: 11 },
  collegeName: { ...TYPOGRAPHY.h3, color: COLORS.primary, marginBottom: 2 },
  collegeLocation: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.md },
  statsRow: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.md },
  statItem: {},
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 11 },
  statVal: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary, fontSize: 14 },
  branchesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, alignItems: 'center' },
  branchTag: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface },
  branchTagText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, fontSize: 10 },
  moreText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
});
