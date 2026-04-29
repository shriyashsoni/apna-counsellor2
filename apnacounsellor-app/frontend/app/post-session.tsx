import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../src/constants/theme';
import { apiCall } from '../src/utils/api';

const MAX_PRICE = 1000;
const TOPICS = ['JEE Main', 'JEE Advanced', 'MHT-CET', 'COMEDK', 'MPDTE', 'College Selection', 'Branch Guidance', 'Career Guidance', 'Scholarship', 'Other'];
const DURATIONS = [{ label: '30 min', value: 30 }, { label: '45 min', value: 45 }, { label: '60 min', value: 60 }];
const SESSION_TYPES = [
  { label: '1:1 Private Session', value: '1:1', icon: 'person', desc: 'One student, focused guidance' },
  { label: 'Group / Batch Session', value: 'batch', icon: 'people', desc: 'Up to 10 students, more affordable' },
];
const TIME_SLOTS = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];

export default function PostSession() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'1:1' | 'batch'>('1:1');
  const [form, setForm] = useState({
    title: '',
    description: '',
    topic: '',
    price: '',
    duration: 30,
    date: '',
    timeSlot: '',
    maxStudents: '1',
  });
  const [errors, setErrors] = useState<any>({});

  function set(field: string, val: any) {
    setForm(f => ({ ...f, [field]: val }));
    setErrors((e: any) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const e: any = {};
    if (!form.title.trim()) e.title = 'Title required';
    if (!form.description.trim()) e.description = 'Description required';
    if (!form.topic) e.topic = 'Select a topic';
    if (!form.date.trim()) e.date = 'Date required (e.g. 2026-05-10)';
    if (!form.timeSlot) e.timeSlot = 'Select a time slot';

    const price = Number(form.price);
    if (!form.price || isNaN(price) || price < 50) e.price = 'Min price is ₹50';
    if (price > MAX_PRICE) e.price = `Max price is ₹${MAX_PRICE}`;

    if (type === 'batch') {
      const max = Number(form.maxStudents);
      if (isNaN(max) || max < 2) e.maxStudents = 'Min 2 students for batch';
      if (max > 20) e.maxStudents = 'Max 20 students per batch';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePost() {
    if (!validate()) return;
    setLoading(true);
    try {
      const price = Math.min(Number(form.price), MAX_PRICE);
      if (type === 'batch') {
        await apiCall('/batches', {
          method: 'POST',
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            max_students: Number(form.maxStudents),
            price,
            start_date: form.date,
            end_date: form.date,
            schedule: `${form.timeSlot} · ${form.duration} min`,
            topics: [form.topic],
          }),
        });
      } else {
        await apiCall('/mentor/sessions/post', {
          method: 'POST',
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            date: form.date,
            time_slot: form.timeSlot,
            duration: form.duration,
            price,
            topic: form.topic,
            max_students: 1,
          }),
        });
      }
      Alert.alert('Session Posted!', 'Your session is now live. Students can see and book it.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to post session');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={s.title}>Post a Session</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Session Type */}
          <Text style={s.sectionLabel}>Session Type</Text>
          <View style={s.typeRow}>
            {SESSION_TYPES.map(t => (
              <TouchableOpacity
                key={t.value}
                style={[s.typeCard, type === t.value && s.typeCardActive]}
                onPress={() => {
                  setType(t.value as any);
                  set('maxStudents', t.value === 'batch' ? '5' : '1');
                }}
              >
                <Ionicons name={t.icon as any} size={24} color={type === t.value ? COLORS.textInverse : COLORS.primary} />
                <Text style={[s.typeLabel, type === t.value && s.typeLabelActive]}>{t.label}</Text>
                <Text style={[s.typeDesc, type === t.value && { color: 'rgba(255,255,255,0.7)' }]}>{t.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Title */}
          <Text style={s.label}>Session Title *</Text>
          <TextInput
            style={[s.input, errors.title && s.inputError]}
            placeholder="e.g. JoSAA Counselling Strategy 2026"
            placeholderTextColor={COLORS.textMuted}
            value={form.title}
            onChangeText={v => set('title', v)}
          />
          {errors.title ? <Text style={s.error}>{errors.title}</Text> : null}

          {/* About / Description */}
          <Text style={s.label}>About this Session *</Text>
          <TextInput
            style={[s.input, s.textArea, errors.description && s.inputError]}
            placeholder="Describe what students will learn, your approach, what to expect..."
            placeholderTextColor={COLORS.textMuted}
            value={form.description}
            onChangeText={v => set('description', v)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description ? <Text style={s.error}>{errors.description}</Text> : null}

          {/* Topic */}
          <Text style={s.label}>Topic *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRow}>
            {TOPICS.map(t => (
              <TouchableOpacity
                key={t}
                style={[s.chip, form.topic === t && s.chipActive]}
                onPress={() => set('topic', t)}
              >
                <Text style={[s.chipText, form.topic === t && s.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.topic ? <Text style={s.error}>{errors.topic}</Text> : null}

          {/* Duration */}
          <Text style={s.label}>Duration</Text>
          <View style={s.row}>
            {DURATIONS.map(d => (
              <TouchableOpacity
                key={d.value}
                style={[s.durationBtn, form.duration === d.value && s.durationBtnActive]}
                onPress={() => set('duration', d.value)}
              >
                <Text style={[s.durationText, form.duration === d.value && s.durationTextActive]}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price */}
          <Text style={s.label}>Pricing (₹) *</Text>
          <View style={s.priceRow}>
            <View style={[s.priceInputWrap, errors.price && s.inputError]}>
              <Text style={s.rupee}>₹</Text>
              <TextInput
                style={s.priceInput}
                placeholder="Enter price"
                placeholderTextColor={COLORS.textMuted}
                value={form.price}
                onChangeText={v => set('price', v.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            <View style={s.priceLimit}>
              <Ionicons name="information-circle" size={16} color={COLORS.warning} />
              <Text style={s.priceLimitText}>Max ₹{MAX_PRICE}</Text>
            </View>
          </View>
          {errors.price ? <Text style={s.error}>{errors.price}</Text> : null}

          {/* Price Bar */}
          {form.price ? (
            <View style={s.priceBar}>
              <View style={[s.priceBarFill, { width: `${Math.min((Number(form.price) / MAX_PRICE) * 100, 100)}%` as any, backgroundColor: Number(form.price) > MAX_PRICE ? COLORS.error : COLORS.success }]} />
            </View>
          ) : null}

          {/* Max Students (batch only) */}
          {type === 'batch' && (
            <>
              <Text style={s.label}>Max Students</Text>
              <View style={s.row}>
                {[2, 5, 10, 15, 20].map(n => (
                  <TouchableOpacity
                    key={n}
                    style={[s.durationBtn, form.maxStudents === String(n) && s.durationBtnActive]}
                    onPress={() => set('maxStudents', String(n))}
                  >
                    <Text style={[s.durationText, form.maxStudents === String(n) && s.durationTextActive]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.maxStudents ? <Text style={s.error}>{errors.maxStudents}</Text> : null}
            </>
          )}

          {/* Date */}
          <Text style={s.label}>Date *</Text>
          <TextInput
            style={[s.input, errors.date && s.inputError]}
            placeholder="YYYY-MM-DD (e.g. 2026-05-15)"
            placeholderTextColor={COLORS.textMuted}
            value={form.date}
            onChangeText={v => set('date', v)}
          />
          {errors.date ? <Text style={s.error}>{errors.date}</Text> : null}

          {/* Time Slot */}
          <Text style={s.label}>Time Slot *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRow}>
            {TIME_SLOTS.map(t => (
              <TouchableOpacity
                key={t}
                style={[s.chip, form.timeSlot === t && s.chipActive]}
                onPress={() => set('timeSlot', t)}
              >
                <Text style={[s.chipText, form.timeSlot === t && s.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.timeSlot ? <Text style={s.error}>{errors.timeSlot}</Text> : null}

          {/* Summary Card */}
          {form.title && form.price ? (
            <View style={s.previewCard}>
              <Text style={s.previewTitle}>Session Preview</Text>
              <View style={s.previewRow}>
                <Ionicons name={type === 'batch' ? 'people' : 'person'} size={18} color={COLORS.primary} />
                <Text style={s.previewText}>{form.title}</Text>
              </View>
              <View style={s.previewRow}>
                <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                <Text style={s.previewMeta}>{form.duration} min · {form.topic || 'Topic TBD'}</Text>
              </View>
              <View style={s.previewRow}>
                <Ionicons name="cash-outline" size={16} color={COLORS.success} />
                <Text style={s.previewPrice}>₹{Math.min(Number(form.price) || 0, MAX_PRICE)}{type === 'batch' ? ` · ${form.maxStudents} students max` : ''}</Text>
              </View>
            </View>
          ) : null}

          {/* Submit */}
          <TouchableOpacity style={[s.btn, loading && s.btnLoading]} onPress={handlePost} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={s.btnText}>Post Session</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  scroll: { padding: SPACING.lg, paddingBottom: 60 },
  sectionLabel: { ...TYPOGRAPHY.h3, color: COLORS.primary, marginBottom: SPACING.md },
  label: { ...TYPOGRAPHY.label, color: COLORS.textPrimary, marginBottom: SPACING.xs, marginTop: SPACING.md, fontSize: 13 },
  typeRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  typeCard: { flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border, gap: 4, ...SHADOWS.sm },
  typeCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeLabel: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.primary, textAlign: 'center', fontSize: 12 },
  typeLabelActive: { color: '#fff' },
  typeDesc: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, textAlign: 'center', fontSize: 10 },
  input: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, fontSize: 15, color: COLORS.textPrimary, ...SHADOWS.sm },
  inputError: { borderColor: COLORS.error },
  textArea: { minHeight: 90, paddingTop: SPACING.md },
  error: { ...TYPOGRAPHY.caption, color: COLORS.error, marginTop: 4, fontSize: 12 },
  chipRow: { gap: SPACING.sm, paddingVertical: SPACING.xs },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: 7, borderRadius: RADIUS.pill, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  durationBtn: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  durationBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  durationText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, fontWeight: '600' },
  durationTextActive: { color: '#fff' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  priceInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, ...SHADOWS.sm },
  rupee: { fontSize: 18, color: COLORS.primary, fontWeight: '700', marginRight: 4 },
  priceInput: { flex: 1, fontSize: 18, color: COLORS.textPrimary, fontWeight: '700', paddingVertical: SPACING.md },
  priceLimit: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF8E6', borderRadius: RADIUS.md, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm, borderWidth: 1, borderColor: '#FFD700' },
  priceLimitText: { ...TYPOGRAPHY.caption, color: COLORS.warning, fontWeight: '700', fontSize: 12 },
  priceBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  priceBarFill: { height: '100%', borderRadius: 2 },
  previewCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.primaryLavender, ...SHADOWS.sm },
  previewTitle: { ...TYPOGRAPHY.label, color: COLORS.primary, marginBottom: SPACING.sm, fontSize: 12 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 4 },
  previewText: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.primary },
  previewMeta: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  previewPrice: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.success },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, paddingVertical: SPACING.md + 2, marginTop: SPACING.xl, ...SHADOWS.md },
  btnLoading: { opacity: 0.7 },
  btnText: { ...TYPOGRAPHY.body, fontWeight: '700', color: '#fff', fontSize: 16 },
});
