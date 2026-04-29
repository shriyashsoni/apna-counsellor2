import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  SafeAreaView, Alert, ActivityIndicator, Modal, Image, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import GenderAvatar from '../../src/components/GenderAvatar';

export default function Profile() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreviewOk, setPhotoPreviewOk] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    academic_class: user?.academicClass || user?.academic_class || '',
    exam: user?.exam || '',
    marks: user?.marks || '',
    rank: user?.rank || '',
    interests: (user?.interests || []).join(', '),
    budget: user?.budget || '',
    preferred_location: user?.preferredLocation || user?.preferred_location || '',
    college: user?.college || '',
    branch: user?.branch || '',
    year: user?.year || '',
    skills: (user?.skills || []).join(', '),
    pricing: String(user?.pricing || ''),
    linkedin: user?.linkedin || '',
  });

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave() {
    setSaving(true);
    try {
      const body: any = { ...form };
      if (body.interests) body.interests = body.interests.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (body.skills) body.skills = body.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (body.pricing) body.pricing = parseInt(body.pricing) || 500;
      else delete body.pricing;
      await apiCall('/profile', { method: 'PUT', body: JSON.stringify(body) });
      await refreshUser();
      setEditing(false);
      Alert.alert('Saved!', 'Profile updated successfully.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePhoto() {
    if (!photoUrl || !photoPreviewOk) {
      Alert.alert('Invalid Image', 'Please paste a valid image URL and wait for the preview to load.');
      return;
    }
    setPhotoSaving(true);
    try {
      await apiCall('/profile', {
        method: 'PUT',
        body: JSON.stringify({ profilePhoto: photoUrl, avatar: photoUrl }),
      });
      await refreshUser();
      setPhotoModal(false);
      setPhotoUrl('');
      setPhotoPreviewOk(false);
      Alert.alert('✅ Photo Updated!', 'Your profile photo has been saved.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save photo');
    } finally {
      setPhotoSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  const isMentor = user?.role === 'mentor';
  const currentPhoto = user?.profilePhoto || user?.avatar || '';

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>My Profile</Text>
            <TouchableOpacity 
              style={[s.editBtn, editing && s.saveBtn]} 
              onPress={() => editing ? handleSave() : setEditing(true)}
            >
              {saving ? (
                <ActivityIndicator size="small" color={editing ? '#fff' : COLORS.primary} />
              ) : (
                <>
                  <Ionicons name={editing ? "checkmark" : "create-outline"} size={18} color={editing ? '#fff' : COLORS.primary} />
                  <Text style={[s.editBtnText, editing && s.saveBtnText]}>{editing ? 'Save' : 'Edit'}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Cancel button when editing */}
          {editing && (
            <TouchableOpacity 
              style={s.cancelEditBtn} 
              onPress={() => setEditing(false)}
            >
              <Ionicons name="close" size={16} color={COLORS.error} />
              <Text style={s.cancelEditText}>Cancel Editing</Text>
            </TouchableOpacity>
          )}

          {/* Profile Photo Card */}
          <View style={s.photoCard}>
            <TouchableOpacity style={s.avatarWrap} onPress={() => setPhotoModal(true)} activeOpacity={0.8}>
              <GenderAvatar
                gender={user?.gender}
                role={user?.role}
                imageUrl={currentPhoto}
                size={96}
              />
              <View style={s.cameraOverlay}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>

            {editing ? (
              <TextInput style={s.nameInput} value={form.name} onChangeText={v => set('name', v)} placeholder="Your name" />
            ) : (
              <Text style={s.nameText}>{user?.name || 'User'}</Text>
            )}
            <Text style={s.roleText}>{user?.role?.charAt(0).toUpperCase() + (user?.role || '').slice(1)}</Text>
            <TouchableOpacity style={s.changePhotoBtn} onPress={() => setPhotoModal(true)}>
              <Ionicons name="image-outline" size={14} color={COLORS.primary} />
              <Text style={s.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Bio */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>About</Text>
            {editing
              ? <TextInput style={[s.input, s.textArea]} value={form.bio} onChangeText={v => set('bio', v)} placeholder="Write a short bio..." multiline numberOfLines={3} textAlignVertical="top" />
              : <Text style={s.value}>{user?.bio || 'No bio added yet.'}</Text>}
          </View>

          {/* Contact Info */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Contact</Text>
            <Row label="Phone" value={user?.phone} editing={editing} field="phone" form={form} set={set} keyboardType="phone-pad" />
            <Row label="LinkedIn" value={user?.linkedin} editing={editing} field="linkedin" form={form} set={set} placeholder="https://linkedin.com/in/..." />
          </View>

          {/* Gender */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Gender</Text>
            {editing ? (
              <View style={s.genderRow}>
                {['male', 'female', 'other'].map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[s.genderBtn, form.gender === g && s.genderBtnActive]}
                    onPress={() => set('gender', g)}
                  >
                    <Ionicons
                      name={g === 'female' ? 'woman' : g === 'male' ? 'man' : 'person'}
                      size={18}
                      color={form.gender === g ? '#fff' : COLORS.primary}
                    />
                    <Text style={[s.genderText, form.gender === g && s.genderTextActive]}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={s.genderDisplay}>
                <GenderAvatar gender={user?.gender} size={28} />
                <Text style={s.value}>{user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set'}</Text>
              </View>
            )}
          </View>

          {/* Student fields */}
          {!isMentor && (
            <View style={s.section}>
              <Text style={s.sectionLabel}>Academic Info</Text>
              <Row label="Class / Year" value={user?.academicClass} editing={editing} field="academic_class" form={form} set={set} placeholder="e.g. 12th / Dropper" />
              <Row label="Target Exam" value={user?.exam} editing={editing} field="exam" form={form} set={set} placeholder="JEE / MHT-CET / COMEDK" />
              <Row label="Marks / %ile" value={user?.marks} editing={editing} field="marks" form={form} set={set} placeholder="e.g. 95.4 percentile" />
              <Row label="Rank" value={user?.rank} editing={editing} field="rank" form={form} set={set} keyboardType="numeric" />
              <Row label="Interests" value={(user?.interests || []).join(', ')} editing={editing} field="interests" form={form} set={set} placeholder="CSE, ECE, Mechanical..." />
              <Row label="Budget" value={user?.budget} editing={editing} field="budget" form={form} set={set} placeholder="e.g. ₹2-5 Lakhs/year" />
              <Row label="Preferred Location" value={user?.preferredLocation} editing={editing} field="preferred_location" form={form} set={set} placeholder="e.g. Maharashtra, Delhi" />
            </View>
          )}

          {/* Mentor fields */}
          {isMentor && (
            <View style={s.section}>
              <Text style={s.sectionLabel}>Mentor Info</Text>
              <Row label="College" value={user?.college} editing={editing} field="college" form={form} set={set} />
              <Row label="Branch" value={user?.branch} editing={editing} field="branch" form={form} set={set} placeholder="e.g. CSE, ECE, ME" />
              <Row label="Year" value={user?.year} editing={editing} field="year" form={form} set={set} placeholder="e.g. 3rd Year" />
              <Row label="Skills / Topics" value={(user?.skills || []).join(', ')} editing={editing} field="skills" form={form} set={set} placeholder="JEE, College Guidance..." />
              <Row label="Session Price (₹)" value={String(user?.pricing || '')} editing={editing} field="pricing" form={form} set={set} keyboardType="numeric" placeholder="Max ₹1000" />
            </View>
          )}

          {/* Logout */}
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
            <Text style={s.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Photo URL Modal */}
      <Modal visible={photoModal} transparent animationType="slide" onRequestClose={() => setPhotoModal(false)}>
        <View style={s.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={s.modalCard}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>📸 Update Profile Photo</Text>
                <TouchableOpacity onPress={() => { setPhotoModal(false); setPhotoUrl(''); setPhotoPreviewOk(false); }}>
                  <Ionicons name="close" size={22} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={s.modalDesc}>
                Paste a direct image link below. Use any public image URL.
              </Text>

              {/* Tips */}
              <View style={s.tipBox}>
                <Text style={s.tipTitle}>💡 How to get a direct image link:</Text>
                <Text style={s.tipItem}>• Upload to <Text style={s.tipBold}>imgbb.com</Text> → copy "Direct link"</Text>
                <Text style={s.tipItem}>• Upload to <Text style={s.tipBold}>imgur.com</Text> → right-click → "Copy image address"</Text>
                <Text style={s.tipItem}>• Use <Text style={s.tipBold}>postimages.org</Text> → copy "Direct link"</Text>
              </View>

              {/* URL Input */}
              <Text style={s.inputLabel}>Image URL</Text>
              <View style={s.urlInputWrap}>
                <Ionicons name="link-outline" size={18} color={COLORS.primary} />
                <TextInput
                  style={s.urlInput}
                  placeholder="https://i.ibb.co/your-image.jpg"
                  placeholderTextColor={COLORS.textMuted}
                  value={photoUrl}
                  onChangeText={v => { setPhotoUrl(v.trim()); setPhotoPreviewOk(false); }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
                {photoUrl.length > 0 && (
                  <TouchableOpacity onPress={() => { setPhotoUrl(''); setPhotoPreviewOk(false); }}>
                    <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Live Preview */}
              {photoUrl.startsWith('http') && (
                <View style={s.previewWrap}>
                  <Text style={s.previewLabel}>Preview</Text>
                  <View style={s.previewRow}>
                    <Image
                      source={{ uri: photoUrl }}
                      style={s.previewImg}
                      onLoad={() => setPhotoPreviewOk(true)}
                      onError={() => setPhotoPreviewOk(false)}
                    />
                    {photoPreviewOk ? (
                      <View style={s.previewStatus}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                        <Text style={[s.previewStatusText, { color: COLORS.success }]}>Image loaded successfully!</Text>
                      </View>
                    ) : (
                      <View style={s.previewStatus}>
                        <Ionicons name="hourglass-outline" size={18} color={COLORS.textMuted} />
                        <Text style={s.previewStatusText}>Loading preview...</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={s.modalActions}>
                <TouchableOpacity style={s.cancelBtn} onPress={() => { setPhotoModal(false); setPhotoUrl(''); setPhotoPreviewOk(false); }}>
                  <Text style={s.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.savePhotoBtn, (!photoPreviewOk || photoSaving) && s.saveBtnDisabled]}
                  onPress={handleSavePhoto}
                  disabled={!photoPreviewOk || photoSaving}
                >
                  {photoSaving
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Ionicons name="cloud-upload" size={18} color="#fff" />}
                  <Text style={s.savePhotoText}>{photoSaving ? 'Saving...' : 'Save Photo'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Row({ label, value, editing, field, form, set, placeholder = '', keyboardType = 'default' }: any) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      {editing
        ? <TextInput style={s.rowInput} value={form[field]} onChangeText={(v: string) => set(field, v)} placeholder={placeholder || label} placeholderTextColor={COLORS.textMuted} keyboardType={keyboardType} />
        : <Text style={s.rowValue}>{value || '—'}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  scroll: { paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primaryLavender, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, minWidth: 80, justifyContent: 'center' },
  editBtnText: { ...TYPOGRAPHY.body, color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  saveBtn: { backgroundColor: COLORS.primary },
  saveBtnText: { color: '#fff' },
  cancelEditBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginHorizontal: SPACING.lg, marginBottom: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: COLORS.error },
  cancelEditText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontWeight: '600' },
  photoCard: { alignItems: 'center', backgroundColor: COLORS.background, marginHorizontal: SPACING.lg, borderRadius: RADIUS.xl, paddingVertical: SPACING.xl, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.sm },
  avatarWrap: { position: 'relative', marginBottom: SPACING.md },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  nameText: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginTop: 4 },
  nameInput: { ...TYPOGRAPHY.h2, color: COLORS.primary, borderBottomWidth: 1, borderBottomColor: COLORS.primary, textAlign: 'center', minWidth: 160, paddingVertical: 4 },
  roleText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: 4, textTransform: 'capitalize' },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.md, backgroundColor: COLORS.primaryLavender, paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.pill },
  changePhotoText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600', fontSize: 12 },
  section: { backgroundColor: COLORS.background, marginHorizontal: SPACING.lg, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.sm },
  sectionLabel: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11, marginBottom: SPACING.sm },
  value: { ...TYPOGRAPHY.body, color: COLORS.textPrimary },
  input: { backgroundColor: COLORS.surfacePink, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, fontSize: 14, color: COLORS.textPrimary },
  textArea: { minHeight: 72, textAlignVertical: 'top' },
  genderRow: { flexDirection: 'row', gap: SPACING.sm },
  genderBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfacePink },
  genderBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  genderText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  genderTextActive: { color: '#fff' },
  genderDisplay: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border + '40' },
  rowLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, flex: 1 },
  rowValue: { ...TYPOGRAPHY.body, color: COLORS.textPrimary, flex: 2, textAlign: 'right' },
  rowInput: { flex: 2, textAlign: 'right', fontSize: 14, color: COLORS.textPrimary, backgroundColor: COLORS.surfacePink, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.primaryLavender },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, margin: SPACING.lg, paddingVertical: SPACING.md, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.error },
  logoutText: { ...TYPOGRAPHY.body, color: COLORS.error, fontWeight: '600' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.background, borderTopLeftRadius: RADIUS.xl * 1.5, borderTopRightRadius: RADIUS.xl * 1.5, padding: SPACING.xl, paddingBottom: SPACING.xl + 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  modalDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontSize: 13, marginBottom: SPACING.md },
  tipBox: { backgroundColor: '#FFFDE7', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderLeftWidth: 3, borderLeftColor: '#FFC107' },
  tipTitle: { ...TYPOGRAPHY.caption, fontWeight: '700', color: '#5D4037', marginBottom: 4 },
  tipItem: { ...TYPOGRAPHY.caption, color: '#5D4037', lineHeight: 18 },
  tipBold: { fontWeight: '700' },
  inputLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '600' },
  urlInputWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surfacePink, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.md },
  urlInput: { flex: 1, fontSize: 13, color: COLORS.textPrimary },
  previewWrap: { marginBottom: SPACING.md },
  previewLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontWeight: '600', marginBottom: 8 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  previewImg: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.border },
  previewStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  previewStatusText: { ...TYPOGRAPHY.caption, color: COLORS.textMuted },
  modalActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  cancelBtn: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border },
  cancelText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontWeight: '600' },
  savePhotoBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: SPACING.md, borderRadius: RADIUS.xl, backgroundColor: COLORS.primary, ...SHADOWS.sm },
  saveBtnDisabled: { opacity: 0.4 },
  savePhotoText: { ...TYPOGRAPHY.body, fontWeight: '700', color: '#fff' },
});
