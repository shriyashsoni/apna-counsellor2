import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { apiCall } from '../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const EXAMS = ['JEE Advanced', 'JEE Mains', 'MHT-CET', 'COMEDK', 'AKTU', 'BITSAT'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];

export default function Predictor() {
  const router = useRouter();
  const [exam, setExam] = useState('JEE Advanced');
  const [rank, setRank] = useState('');
  const [percentile, setPercentile] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  async function predict() {
    if (!rank && !percentile) return;
    setLoading(true);
    try {
      const body: any = { exam, category };
      if (rank) body.rank = parseInt(rank);
      if (percentile) body.percentile = parseFloat(percentile);
      const data = await apiCall('/colleges/predict', { method: 'POST', body: JSON.stringify(body) });
      setResults(Array.isArray(data) ? data : []);
      setShowResults(true);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll}>
          <TouchableOpacity testID="pred-back" style={s.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <View style={s.header}>
            <Ionicons name="analytics" size={32} color={COLORS.primary} />
            <Text style={s.title}>College Predictor</Text>
            <Text style={s.subtitle}>Enter your JEE rank to find your best-fit colleges</Text>
          </View>

          {!showResults ? (
            <View style={s.form}>
              <Text style={s.label}>EXAM</Text>
              <View style={s.chipRow}>
                {EXAMS.map(e => (
                  <TouchableOpacity key={e} testID={`exam-${e}`} style={[s.chip, exam === e && s.chipActive]} onPress={() => setExam(e)}>
                    <Text style={[s.chipText, exam === e && s.chipTextActive]}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.label}>CATEGORY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRow}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity key={c} testID={`cat-${c}`} style={[s.chip, category === c && s.chipActive]} onPress={() => setCategory(c)}>
                    <Text style={[s.chipText, category === c && s.chipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {exam === 'JEE Mains' && (
                <View style={s.field}>
                  <Text style={s.label}>PERCENTILE</Text>
                  <TextInput testID="percentile-input" style={s.input} placeholder="e.g., 98.5" placeholderTextColor={COLORS.textSecondary} value={percentile} onChangeText={setPercentile} keyboardType="decimal-pad" />
                </View>
              )}
              <View style={s.field}>
                <Text style={s.label}>{exam === 'JEE Mains' ? 'RANK (Optional)' : 'AIR RANK'}</Text>
                <TextInput testID="rank-input" style={s.input} placeholder="e.g., 5000" placeholderTextColor={COLORS.textSecondary} value={rank} onChangeText={setRank} keyboardType="number-pad" />
              </View>

              <TouchableOpacity testID="predict-btn" style={[s.submitBtn, loading && s.submitDisabled]} onPress={predict} disabled={loading}>
                {loading ? <ActivityIndicator color={COLORS.textInverse} /> : <>
                  <Ionicons name="sparkles" size={20} color={COLORS.textInverse} />
                  <Text style={s.submitText}>Predict My Colleges</Text>
                </>}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.resultsSection}>
              <View style={s.resultsHeader}>
                <Text style={s.resultsTitle}>{results.length} Colleges Found</Text>
                <TouchableOpacity testID="try-again" onPress={() => setShowResults(false)}>
                  <Text style={s.tryAgain}>Change Input</Text>
                </TouchableOpacity>
              </View>
              <View style={s.inputSummary}>
                <Text style={s.summaryText}>{exam} · Rank {rank || `~${Math.max(1, Math.round((100 - parseFloat(percentile || '0')) * 12000))}`} · {category}</Text>
              </View>

              {results.map((r, i) => (
                <TouchableOpacity key={i} testID={`result-${i}`} style={s.resultCard} onPress={() => router.push(`/college/${r.college_id}`)} activeOpacity={0.8}>
                  <View style={s.resultTop}>
                    <View style={s.resultRank}><Text style={s.resultRankText}>{i + 1}</Text></View>
                    <View style={s.resultInfo}>
                      <Text style={s.resultName}>{r.short_name || r.name}</Text>
                      <Text style={s.resultBranch}>{r.branch} · {r.state}</Text>
                    </View>
                    <View style={s.probBadge}>
                      <Text style={s.probText}>{r.probability}%</Text>
                    </View>
                  </View>
                  <View style={s.resultMeta}>
                    <Text style={s.metaItem}>Cutoff: {r.cutoff_rank}</Text>
                    <Text style={s.metaItem}>Fee: {r.annual_fee}</Text>
                    <Text style={s.metaItem}>Pkg: {r.avg_package}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xl, paddingBottom: 40 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  header: { marginBottom: SPACING.xl },
  title: { ...TYPOGRAPHY.h1, color: COLORS.primary, marginTop: SPACING.sm },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  form: { gap: SPACING.md },
  label: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, fontSize: 11, marginBottom: SPACING.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, fontSize: 13 },
  chipTextActive: { color: COLORS.textInverse },
  field: { marginBottom: SPACING.md },
  input: { height: 50, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, fontSize: 16, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
  submitBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.md },
  submitDisabled: { opacity: 0.6 },
  submitText: { ...TYPOGRAPHY.body, color: COLORS.textInverse, fontWeight: '600', fontSize: 17 },
  resultsSection: {},
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  resultsTitle: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  tryAgain: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, fontSize: 12 },
  inputSummary: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg },
  summaryText: { ...TYPOGRAPHY.body, color: COLORS.textPrimary, fontWeight: '500', textAlign: 'center' },
  resultCard: { backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md },
  resultTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
  resultRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  resultRankText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '800' },
  resultInfo: { flex: 1 },
  resultName: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary },
  resultBranch: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  probBadge: { backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.pill, borderWidth: 2, borderColor: COLORS.primary },
  probText: { ...TYPOGRAPHY.body, fontWeight: '800', color: COLORS.primary, fontSize: 15 },
  resultMeta: { flexDirection: 'row', gap: SPACING.lg },
  metaItem: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontSize: 12 },
});
