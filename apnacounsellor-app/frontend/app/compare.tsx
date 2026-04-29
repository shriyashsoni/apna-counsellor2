import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { apiCall } from '../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Compare() {
  const router = useRouter();
  const [allColleges, setAllColleges] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [compared, setCompared] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);

  useEffect(() => { loadColleges(); }, []);

  async function loadColleges() {
    try { const d = await apiCall('/colleges'); setAllColleges(Array.isArray(d) ? d : []); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  function toggleSelect(id: string) {
    if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
    else if (selected.length < 4) setSelected([...selected, id]);
  }

  async function doCompare() {
    if (selected.length < 2) return;
    setComparing(true);
    try {
      const data = await apiCall('/colleges/compare', { method: 'POST', body: JSON.stringify({ college_ids: selected }) });
      setCompared(Array.isArray(data) ? data : []);
    } catch (e) { console.log(e); }
    finally { setComparing(false); }
  }

  const FIELDS = [
    { key: 'nirf_rank', label: 'NIRF Rank', fmt: (v: any) => `#${v}` },
    { key: 'type', label: 'Type', fmt: (v: any) => v },
    { key: 'annual_fee', label: 'Annual Fee', fmt: (v: any) => v },
    { key: 'avg_package', label: 'Avg Package', fmt: (v: any) => v },
    { key: 'highest_package', label: 'Highest Pkg', fmt: (v: any) => v },
    { key: 'total_students', label: 'Students', fmt: (v: any) => v?.toLocaleString() },
    { key: 'campus_area', label: 'Campus', fmt: (v: any) => v },
    { key: 'state', label: 'State', fmt: (v: any) => v },
  ];

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <TouchableOpacity testID="compare-back" style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={s.title}>Compare Colleges</Text>
        <Text style={s.subtitle}>Select 2-4 colleges to compare side by side</Text>

        {compared.length === 0 ? (
          <>
            {loading ? <ActivityIndicator size="large" color={COLORS.primary} /> : (
              <View style={s.selectGrid}>
                {allColleges.map((c, i) => (
                  <TouchableOpacity key={i} testID={`sel-${i}`} style={[s.selectCard, selected.includes(c.id) && s.selectCardActive]} onPress={() => toggleSelect(c.id)}>
                    {selected.includes(c.id) && <Ionicons name="checkmark-circle" size={20} color={COLORS.textInverse} style={s.checkIcon} />}
                    <Text style={[s.selectName, selected.includes(c.id) && s.selectNameActive]}>{c.short_name}</Text>
                    <Text style={[s.selectLoc, selected.includes(c.id) && s.selectLocActive]}>#{c.nirf_rank} · {c.state}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {selected.length >= 2 && (
              <TouchableOpacity testID="do-compare-btn" style={[s.compareBtn, comparing && s.compareBtnDisabled]} onPress={doCompare} disabled={comparing}>
                {comparing ? <ActivityIndicator color={COLORS.textInverse} /> : <Text style={s.compareBtnText}>Compare {selected.length} Colleges</Text>}
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity testID="reset-compare" style={s.resetBtn} onPress={() => { setCompared([]); setSelected([]); }}>
              <Ionicons name="refresh" size={16} color={COLORS.primary} />
              <Text style={s.resetText}>Reset</Text>
            </TouchableOpacity>

            {/* Comparison Table */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={s.table}>
                {/* Header row */}
                <View style={s.tableRow}>
                  <View style={[s.tableCell, s.labelCell]}><Text style={s.tableLabelText}>Metric</Text></View>
                  {compared.map((c, i) => (
                    <TouchableOpacity key={i} style={[s.tableCell, s.headerCell]} onPress={() => router.push(`/college/${c.id}`)}>
                      <Text style={s.headerText}>{c.short_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {FIELDS.map((f, fi) => (
                  <View key={fi} style={[s.tableRow, fi % 2 === 0 && s.tableRowAlt]}>
                    <View style={[s.tableCell, s.labelCell]}><Text style={s.tableLabelText}>{f.label}</Text></View>
                    {compared.map((c, ci) => (
                      <View key={ci} style={s.tableCell}><Text style={s.tableValText}>{f.fmt(c[f.key])}</Text></View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xl, paddingBottom: 40 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  title: { ...TYPOGRAPHY.h1, color: COLORS.primary, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  selectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  selectCard: { width: '48%' as any, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  selectCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkIcon: { position: 'absolute', top: SPACING.sm, right: SPACING.sm },
  selectName: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary, fontSize: 14 },
  selectNameActive: { color: COLORS.textInverse },
  selectLoc: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  selectLocActive: { color: 'rgba(255,255,255,0.7)' },
  compareBtn: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.pill, alignItems: 'center', marginTop: SPACING.lg },
  compareBtnDisabled: { opacity: 0.6 },
  compareBtnText: { ...TYPOGRAPHY.body, color: COLORS.textInverse, fontWeight: '700', fontSize: 17 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, alignSelf: 'flex-end', marginBottom: SPACING.lg },
  resetText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '700' },
  table: { minWidth: '100%' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableRowAlt: { backgroundColor: COLORS.surface },
  tableCell: { width: 120, padding: SPACING.sm, justifyContent: 'center' },
  labelCell: { width: 100, backgroundColor: COLORS.surfaceElevated },
  headerCell: { backgroundColor: COLORS.primary },
  tableLabelText: { ...TYPOGRAPHY.caption, fontWeight: '600', color: COLORS.textPrimary, fontSize: 12 },
  headerText: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.textInverse, fontSize: 12 },
  tableValText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, fontWeight: '500', fontSize: 13 },
});
