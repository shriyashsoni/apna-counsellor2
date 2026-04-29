import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, ActivityIndicator, Animated, Alert, KeyboardAvoidingView,
  Platform, Image, Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../src/constants/theme';
import { apiCall } from '../src/utils/api';

const SINGLE_STEPS = [
  { id: 1, label: 'Validating URL', icon: 'link-outline' },
  { id: 2, label: 'Fetching college page', icon: 'cloud-download-outline' },
  { id: 3, label: 'AI analyzing content', icon: 'sparkles-outline' },
  { id: 4, label: 'Extracting data + logo', icon: 'document-text-outline' },
];

type BulkItem = {
  url: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  college?: any;
  error?: string;
};

export default function AdminAddCollegeAI() {
  const router = useRouter();

  // Single mode
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [college, setCollege] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [logoError, setLogoError] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Bulk mode
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkDone, setBulkDone] = useState(false);

  function startPulse() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }
  function stopPulse() { pulseAnim.stopAnimation(); pulseAnim.setValue(1); }

  function validateUrl(val: string) {
    if (!val) { setUrlError('Please enter a URL'); return false; }
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      setUrlError('URL must start with https://'); return false;
    }
    const KW = ['.ac.in', '.edu', 'iit', 'nit', 'iiit', 'bits', 'vit', 'srm', 'manipal',
      'university', 'college', 'institute', 'coep', 'vjti', 'iisc', 'engineering', 'technology'];
    if (!KW.some(kw => val.toLowerCase().includes(kw))) {
      setUrlError('Only official college/university website URLs are accepted');
      return false;
    }
    setUrlError('');
    return true;
  }

  async function handleExtract() {
    if (!validateUrl(url)) return;
    setCollege(null); setSaved(false); setLoading(true); setCurrentStep(1); setLogoError(false);
    startPulse();
    const stepTimings = [0, 800, 2000, 5000];
    stepTimings.forEach((delay, i) => setTimeout(() => setCurrentStep(i + 1), delay));
    try {
      const result = await apiCall('/admin/colleges/ai-scrape', {
        method: 'POST',
        body: JSON.stringify({ url: url.trim(), save: false }),
      });
      stopPulse(); setCurrentStep(4); setCollege(result.college);
    } catch (e: any) {
      stopPulse(); setCurrentStep(0); setUrlError(e.message || 'Failed to extract college data');
    } finally { setLoading(false); }
  }

  async function handleSave() {
    if (!college) return;
    setSaving(true);
    try {
      await apiCall('/admin/colleges/ai-scrape', {
        method: 'POST',
        body: JSON.stringify({ url: url.trim(), save: true }),
      });
      setSaved(true);
      Alert.alert(
        '✅ College Added!',
        `${college.name} has been added to the database.`,
        [{ text: 'Add Another', onPress: () => { setCollege(null); setUrl(''); setCurrentStep(0); setSaved(false); } },
         { text: 'Done', onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save college');
    } finally { setSaving(false); }
  }

  // ── Bulk Mode ─────────────────────────────────────────
  async function handleBulkExtract() {
    const urls = bulkText.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    if (urls.length === 0) { Alert.alert('No URLs', 'Please paste at least one URL.'); return; }
    if (urls.length > 20) { Alert.alert('Too many', 'Max 20 URLs at a time.'); return; }

    const initial: BulkItem[] = urls.map(u => ({ url: u, status: 'pending' }));
    setBulkItems(initial);
    setBulkRunning(true);
    setBulkDone(false);

    for (let i = 0; i < urls.length; i++) {
      setBulkItems(prev => prev.map((item, idx) =>
        idx === i ? { ...item, status: 'processing' } : item
      ));
      try {
        const result = await apiCall('/admin/colleges/ai-scrape', {
          method: 'POST',
          body: JSON.stringify({ url: urls[i], save: true }),
        });
        setBulkItems(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'success', college: result.college } : item
        ));
      } catch (e: any) {
        setBulkItems(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'error', error: e.message || 'Failed' } : item
        ));
      }
    }
    setBulkRunning(false);
    setBulkDone(true);
  }

  function resetBulk() {
    setBulkText(''); setBulkItems([]); setBulkDone(false); setBulkRunning(false);
  }

  const bulkSuccessCount = bulkItems.filter(i => i.status === 'success').length;
  const bulkFailCount = bulkItems.filter(i => i.status === 'error').length;

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Ionicons name="sparkles" size={18} color={COLORS.primary} />
          <Text style={s.headerTitle}>AI College Adder</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Hero Banner */}
          <View style={s.heroBanner}>
            <Animated.View style={[s.heroIcon, { transform: [{ scale: (loading || bulkRunning) ? pulseAnim : 1 }] }]}>
              <Ionicons name="school" size={36} color={COLORS.primary} />
            </Animated.View>
            <Text style={s.heroTitle}>Add College with AI</Text>
            <Text style={s.heroDesc}>
              {isBulkMode
                ? 'Paste multiple college URLs (one per line). AI extracts all data & logos automatically.'
                : 'Paste an official college website URL. Claude AI will extract all real data and the college logo.'}
            </Text>
          </View>

          {/* Mode Toggle */}
          <View style={s.modeToggle}>
            <TouchableOpacity
              style={[s.modeBtn, !isBulkMode && s.modeBtnActive]}
              onPress={() => { setIsBulkMode(false); resetBulk(); }}
            >
              <Ionicons name="link" size={15} color={!isBulkMode ? '#fff' : COLORS.primary} />
              <Text style={[s.modeBtnText, !isBulkMode && s.modeBtnTextActive]}>Single URL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.modeBtn, isBulkMode && s.modeBtnActive]}
              onPress={() => { setIsBulkMode(true); setCollege(null); setCurrentStep(0); }}
            >
              <Ionicons name="list" size={15} color={isBulkMode ? '#fff' : COLORS.primary} />
              <Text style={[s.modeBtnText, isBulkMode && s.modeBtnTextActive]}>Bulk URLs</Text>
            </TouchableOpacity>
          </View>

          {/* ── SINGLE MODE ─────────────────────────────────── */}
          {!isBulkMode && (
            <>
              {/* URL Input */}
              <View style={s.inputSection}>
                <Text style={s.label}>College Website URL</Text>
                <View style={[s.urlRow, urlError ? s.urlRowError : null]}>
                  <Ionicons name="globe-outline" size={20} color={urlError ? COLORS.error : COLORS.primary} style={{ marginLeft: SPACING.md }} />
                  <TextInput
                    style={s.urlInput}
                    placeholder="https://www.iitbombay.ac.in"
                    placeholderTextColor={COLORS.textMuted}
                    value={url}
                    onChangeText={v => { setUrl(v); setUrlError(''); setCollege(null); setSaved(false); setCurrentStep(0); }}
                    autoCapitalize="none" autoCorrect={false} keyboardType="url"
                  />
                  {url.length > 0 && (
                    <TouchableOpacity onPress={() => { setUrl(''); setUrlError(''); setCollege(null); setCurrentStep(0); }} style={s.clearBtn}>
                      <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
                {urlError ? (
                  <View style={s.errorRow}>
                    <Ionicons name="alert-circle" size={14} color={COLORS.error} />
                    <Text style={s.errorText}>{urlError}</Text>
                  </View>
                ) : (
                  <Text style={s.hint}>✓ Also extracts college logo automatically</Text>
                )}
              </View>

              {/* Quick examples */}
              {!loading && !college && (
                <View style={s.examplesSection}>
                  <Text style={s.examplesLabel}>Try these examples:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.examplesRow}>
                    {['https://www.iitb.ac.in', 'https://www.nitk.ac.in', 'https://coep.org.in', 'https://www.vjti.ac.in'].map(ex => (
                      <TouchableOpacity key={ex} style={s.exampleChip} onPress={() => { setUrl(ex); setUrlError(''); }}>
                        <Text style={s.exampleText} numberOfLines={1}>{ex.replace('https://', '').replace('www.', '')}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Extract Button */}
              {!college && (
                <TouchableOpacity
                  style={[s.extractBtn, loading && s.extractBtnLoading]}
                  onPress={handleExtract} disabled={loading} activeOpacity={0.85}
                >
                  {loading ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="sparkles" size={20} color="#fff" />}
                  <Text style={s.extractBtnText}>{loading ? 'AI Extracting...' : 'Extract with AI'}</Text>
                </TouchableOpacity>
              )}

              {/* Step Progress */}
              {loading && currentStep > 0 && (
                <View style={s.stepsCard}>
                  <Text style={s.stepsTitle}>AI is working...</Text>
                  {SINGLE_STEPS.map(step => {
                    const done = currentStep > step.id;
                    const active = currentStep === step.id;
                    return (
                      <View key={step.id} style={s.stepRow}>
                        <View style={[s.stepIcon, done ? s.stepDone : active ? s.stepActive : s.stepPending]}>
                          {done ? <Ionicons name="checkmark" size={14} color="#fff" />
                            : active ? <ActivityIndicator size="small" color="#fff" style={{ transform: [{ scale: 0.7 }] }} />
                            : <Ionicons name={step.icon as any} size={14} color={COLORS.textMuted} />}
                        </View>
                        <Text style={[s.stepLabel, done && s.stepLabelDone, active && s.stepLabelActive]}>{step.label}</Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Extracted College Preview */}
              {college && !loading && (
                <View style={s.previewSection}>
                  <View style={s.previewHeader}>
                    <View style={s.previewBadge}>
                      <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                      <Text style={s.previewBadgeText}>Data + Logo Extracted</Text>
                    </View>
                  </View>

                  <View style={s.collegeCard}>
                    <View style={s.collegeCardTop}>
                      {/* Logo */}
                      <View style={s.collegeLogo}>
                        {college.image_url && !logoError ? (
                          <Image
                            source={{ uri: college.image_url }}
                            style={s.logoImage}
                            onError={() => setLogoError(true)}
                            resizeMode="contain"
                          />
                        ) : (
                          <Ionicons name="school" size={28} color={COLORS.primary} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.collegeName}>{college.name}</Text>
                        {college.short_name !== college.name && (
                          <Text style={s.collegeShort}>{college.short_name}</Text>
                        )}
                        <View style={s.metaRow}>
                          {college.city ? <View style={s.metaTag}><Ionicons name="location" size={12} color={COLORS.primary} /><Text style={s.metaText}>{college.city}, {college.state}</Text></View> : null}
                          {college.type ? <View style={s.metaTag}><Text style={s.metaText}>{college.type}</Text></View> : null}
                          {college.nirf_rank ? <View style={[s.metaTag, { backgroundColor: '#FFF3CD' }]}><Text style={[s.metaText, { color: '#856404', fontWeight: '700' }]}>NIRF #{college.nirf_rank}</Text></View> : null}
                        </View>
                      </View>
                    </View>

                    {college.image_url && !logoError && (
                      <View style={s.logoUrlRow}>
                        <Ionicons name="image" size={12} color={COLORS.success} />
                        <Text style={s.logoUrlText} numberOfLines={1}>Logo extracted: {college.image_url}</Text>
                      </View>
                    )}

                    {college.description ? <Text style={s.collegeDesc}>{college.description}</Text> : null}

                    <View style={s.statsRow}>
                      {college.annual_fee ? <StatBox icon="card" label="Annual Fee" value={college.annual_fee} /> : null}
                      {college.avg_package ? <StatBox icon="trending-up" label="Avg Package" value={college.avg_package} /> : null}
                      {college.highest_package ? <StatBox icon="star" label="Highest" value={college.highest_package} /> : null}
                    </View>

                    {college.branches?.length > 0 && (
                      <View style={s.fieldSection}>
                        <Text style={s.fieldLabel}>Branches ({college.branches.length})</Text>
                        <View style={s.chipWrap}>
                          {college.branches.map((b: string) => <View key={b} style={s.branch}><Text style={s.branchText}>{b}</Text></View>)}
                        </View>
                      </View>
                    )}

                    {college.highlights?.length > 0 && (
                      <View style={s.fieldSection}>
                        <Text style={s.fieldLabel}>Highlights</Text>
                        {college.highlights.map((h: string, i: number) => (
                          <View key={i} style={s.highlightRow}>
                            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                            <Text style={s.highlightText}>{h}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {college.counselling?.length > 0 && (
                      <View style={s.fieldSection}>
                        <Text style={s.fieldLabel}>Counselling Process</Text>
                        <View style={s.chipWrap}>
                          {college.counselling.map((c: string) => (
                            <View key={c} style={[s.branch, { backgroundColor: COLORS.primaryLavender }]}>
                              <Text style={[s.branchText, { color: COLORS.primary }]}>{c}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={s.actionRow}>
                    <TouchableOpacity style={s.retryBtn} onPress={() => { setCollege(null); setCurrentStep(0); }}>
                      <Ionicons name="refresh" size={18} color={COLORS.primary} />
                      <Text style={s.retryText}>Try Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.saveBtn, saved && s.saveBtnDone, saving && s.saveBtnLoading]}
                      onPress={handleSave} disabled={saving || saved} activeOpacity={0.85}
                    >
                      {saving ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name={saved ? 'checkmark-circle' : 'cloud-upload'} size={20} color="#fff" />}
                      <Text style={s.saveBtnText}>{saved ? 'Added!' : saving ? 'Saving...' : 'Add to Database'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}

          {/* ── BULK MODE ───────────────────────────────────── */}
          {isBulkMode && (
            <>
              <View style={s.inputSection}>
                <Text style={s.label}>College URLs (one per line, max 20)</Text>
                <TextInput
                  style={s.bulkInput}
                  placeholder={`https://www.iitb.ac.in\nhttps://www.nitk.ac.in\nhttps://coep.org.in\nhttps://www.vjti.ac.in`}
                  placeholderTextColor={COLORS.textMuted}
                  value={bulkText}
                  onChangeText={setBulkText}
                  multiline
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!bulkRunning}
                />
                <Text style={s.hint}>AI extracts data + logo for each college automatically</Text>
              </View>

              {/* Bulk Action Buttons */}
              {!bulkRunning && !bulkDone && (
                <TouchableOpacity style={s.extractBtn} onPress={handleBulkExtract} activeOpacity={0.85}>
                  <Ionicons name="flash" size={20} color="#fff" />
                  <Text style={s.extractBtnText}>Extract & Save All with AI</Text>
                </TouchableOpacity>
              )}

              {/* Bulk Progress List */}
              {bulkItems.length > 0 && (
                <View style={s.bulkListCard}>
                  <Text style={s.stepsTitle}>
                    {bulkRunning ? `Processing ${bulkItems.length} colleges...` : `Done — ${bulkSuccessCount} saved, ${bulkFailCount} failed`}
                  </Text>
                  {bulkItems.map((item, idx) => (
                    <View key={idx} style={s.bulkItemRow}>
                      <View style={[
                        s.bulkStatusIcon,
                        item.status === 'success' && s.stepDone,
                        item.status === 'error' && s.bulkIconError,
                        item.status === 'processing' && s.stepActive,
                        item.status === 'pending' && s.stepPending,
                      ]}>
                        {item.status === 'success' && <Ionicons name="checkmark" size={12} color="#fff" />}
                        {item.status === 'error' && <Ionicons name="close" size={12} color="#fff" />}
                        {item.status === 'processing' && <ActivityIndicator size="small" color="#fff" style={{ transform: [{ scale: 0.65 }] }} />}
                        {item.status === 'pending' && <Text style={{ fontSize: 10, color: COLORS.textMuted }}>{idx + 1}</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        {item.status === 'success' && item.college ? (
                          <View style={s.bulkSuccessRow}>
                            {item.college.image_url ? (
                              <Image source={{ uri: item.college.image_url }} style={s.bulkLogo} resizeMode="contain" />
                            ) : (
                              <Ionicons name="school" size={14} color={COLORS.primary} />
                            )}
                            <Text style={s.bulkCollegeName} numberOfLines={1}>{item.college.name}</Text>
                            <View style={s.bulkSavedBadge}><Text style={s.bulkSavedText}>Saved</Text></View>
                          </View>
                        ) : item.status === 'error' ? (
                          <Text style={s.bulkErrorText} numberOfLines={2}>{item.error || 'Failed'}</Text>
                        ) : item.status === 'processing' ? (
                          <Text style={[s.bulkUrlText, { color: COLORS.primary }]} numberOfLines={1}>{item.url}</Text>
                        ) : (
                          <Text style={s.bulkUrlText} numberOfLines={1}>{item.url}</Text>
                        )}
                      </View>
                    </View>
                  ))}

                  {bulkDone && (
                    <View style={s.bulkSummary}>
                      <View style={s.bulkSummaryItem}>
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                        <Text style={[s.bulkSumText, { color: COLORS.success }]}>{bulkSuccessCount} Added</Text>
                      </View>
                      {bulkFailCount > 0 && (
                        <View style={s.bulkSummaryItem}>
                          <Ionicons name="close-circle" size={20} color={COLORS.error} />
                          <Text style={[s.bulkSumText, { color: COLORS.error }]}>{bulkFailCount} Failed</Text>
                        </View>
                      )}
                      <TouchableOpacity style={s.bulkResetBtn} onPress={resetBulk}>
                        <Ionicons name="add-circle" size={16} color={COLORS.primary} />
                        <Text style={s.bulkResetText}>Add More</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StatBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={s.statBox}>
      <Ionicons name={icon as any} size={16} color={COLORS.primary} />
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  scroll: { padding: SPACING.lg, paddingBottom: 60 },

  heroBanner: { alignItems: 'center', paddingVertical: SPACING.xl, backgroundColor: COLORS.background, borderRadius: RADIUS.xl, marginBottom: SPACING.lg, ...SHADOWS.sm },
  heroIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryLavender, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  heroTitle: { ...TYPOGRAPHY.h2, color: COLORS.primary, textAlign: 'center' },
  heroDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: SPACING.lg, marginTop: 6, lineHeight: 20 },

  modeToggle: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: 4, marginBottom: SPACING.lg, ...SHADOWS.sm },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: RADIUS.lg },
  modeBtnActive: { backgroundColor: COLORS.primary },
  modeBtnText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  modeBtnTextActive: { color: '#fff' },

  inputSection: { marginBottom: SPACING.sm },
  label: { ...TYPOGRAPHY.label, color: COLORS.textPrimary, marginBottom: SPACING.xs, fontSize: 13 },
  urlRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.border, gap: SPACING.sm, ...SHADOWS.sm },
  urlRowError: { borderColor: COLORS.error },
  urlInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: SPACING.md, paddingRight: SPACING.sm },
  clearBtn: { paddingRight: SPACING.md, paddingVertical: SPACING.md },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  errorText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontSize: 12 },
  hint: { ...TYPOGRAPHY.caption, color: COLORS.success, marginTop: 6, fontSize: 12 },

  bulkInput: { backgroundColor: COLORS.background, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.border, padding: SPACING.md, fontSize: 14, color: COLORS.textPrimary, minHeight: 160, textAlignVertical: 'top', ...SHADOWS.sm },

  examplesSection: { marginBottom: SPACING.md },
  examplesLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  examplesRow: { gap: SPACING.sm },
  exampleChip: { paddingHorizontal: SPACING.md, paddingVertical: 6, backgroundColor: COLORS.background, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.primaryLavender },
  exampleText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontSize: 12 },

  extractBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: SPACING.md + 2, marginBottom: SPACING.md, ...SHADOWS.md },
  extractBtnLoading: { opacity: 0.8 },
  extractBtnText: { ...TYPOGRAPHY.body, fontWeight: '700', color: '#fff', fontSize: 16 },

  stepsCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.sm, gap: SPACING.md },
  stepsTitle: { ...TYPOGRAPHY.label, color: COLORS.primary, marginBottom: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  stepIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepPending: { backgroundColor: COLORS.border },
  stepActive: { backgroundColor: COLORS.primary },
  stepDone: { backgroundColor: COLORS.success },
  stepLabel: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
  stepLabelActive: { color: COLORS.primary, fontWeight: '600' },
  stepLabelDone: { color: COLORS.success, fontWeight: '600' },

  previewSection: { gap: SPACING.md },
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  previewBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F5E9', paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.pill },
  previewBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.success, fontWeight: '700' },

  collegeCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOWS.md, gap: SPACING.md },
  collegeCardTop: { flexDirection: 'row', gap: SPACING.md, alignItems: 'flex-start' },
  collegeLogo: { width: 56, height: 56, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLavender, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoImage: { width: 56, height: 56, borderRadius: RADIUS.md },
  logoUrlRow: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E8F5E9', borderRadius: RADIUS.sm, padding: SPACING.xs, paddingHorizontal: SPACING.sm },
  logoUrlText: { ...TYPOGRAPHY.caption, color: COLORS.success, fontSize: 11, flex: 1 },
  collegeName: { ...TYPOGRAPHY.h3, color: COLORS.primary, flex: 1, flexWrap: 'wrap' },
  collegeShort: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: SPACING.xs },
  metaTag: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.primaryLavender, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 3 },
  metaText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontSize: 11 },
  collegeDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, lineHeight: 20, fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  statBox: { flex: 1, backgroundColor: COLORS.surfacePink, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center', gap: 2 },
  statValue: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.primary, textAlign: 'center', fontSize: 12 },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, fontSize: 10, textAlign: 'center' },
  fieldSection: { gap: SPACING.xs },
  fieldLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontWeight: '700', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  branch: { backgroundColor: '#F0F4FF', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.pill },
  branchText: { ...TYPOGRAPHY.caption, color: '#3D6FD6', fontSize: 12 },
  highlightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  highlightText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, flex: 1, lineHeight: 18 },

  actionRow: { flexDirection: 'row', gap: SPACING.sm },
  retryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: SPACING.md, borderRadius: RADIUS.xl, borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.background },
  retryText: { ...TYPOGRAPHY.body, color: COLORS.primary, fontWeight: '600' },
  saveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: SPACING.md, borderRadius: RADIUS.xl, backgroundColor: COLORS.primary, ...SHADOWS.md },
  saveBtnDone: { backgroundColor: COLORS.success },
  saveBtnLoading: { opacity: 0.8 },
  saveBtnText: { ...TYPOGRAPHY.body, fontWeight: '700', color: '#fff' },

  // Bulk styles
  bulkListCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOWS.md, gap: SPACING.sm },
  bulkItemRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  bulkStatusIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bulkIconError: { backgroundColor: COLORS.error },
  bulkSuccessRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bulkLogo: { width: 20, height: 20, borderRadius: 4 },
  bulkCollegeName: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, fontWeight: '600', flex: 1, fontSize: 13 },
  bulkSavedBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.pill },
  bulkSavedText: { ...TYPOGRAPHY.caption, color: COLORS.success, fontSize: 10, fontWeight: '700' },
  bulkUrlText: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, fontSize: 12 },
  bulkErrorText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontSize: 12 },
  bulkSummary: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  bulkSummaryItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bulkSumText: { ...TYPOGRAPHY.body, fontWeight: '700', fontSize: 14 },
  bulkResetBtn: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.pill, backgroundColor: COLORS.primaryLavender },
  bulkResetText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
});
