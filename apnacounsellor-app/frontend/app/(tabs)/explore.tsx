import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Explore() {
  const router = useRouter();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const skills = ['JEE Advanced', 'JEE Mains', 'MHT-CET', 'COMEDK', 'Programming', 'Career Guidance'];

  useEffect(() => { fetchMentors(); }, [search, selectedSkill]);

  async function fetchMentors() {
    setLoading(true);
    try {
      let url = '/mentors';
      const params: string[] = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (selectedSkill) params.push(`skill=${encodeURIComponent(selectedSkill)}`);
      if (params.length) url += '?' + params.join('&');
      const data = await apiCall(url);
      setMentors(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log('Fetch mentors error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Explore Mentors</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            testID="explore-search-input"
            style={styles.searchInput}
            placeholder="Search by name, college, branch..."
            placeholderTextColor={COLORS.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.skillScroll}>
          {skills.map((skill) => (
            <TouchableOpacity
              key={skill}
              testID={`skill-filter-${skill}`}
              style={[styles.skillChip, selectedSkill === skill && styles.skillChipActive]}
              onPress={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
            >
              <Text style={[styles.skillChipText, selectedSkill === skill && styles.skillChipTextActive]}>{skill}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {mentors.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={COLORS.border} />
              <Text style={styles.emptyText}>No mentors found</Text>
            </View>
          ) : (
            mentors.map((mentor, idx) => (
              <TouchableOpacity
                key={idx}
                testID={`explore-mentor-${idx}`}
                style={styles.mentorCard}
                onPress={() => router.push(`/mentor/${mentor.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.mentorRow}>
                  <View style={styles.mentorAvatar}>
                    <Text style={styles.mentorAvatarText}>{(mentor.name || 'M')[0]}</Text>
                  </View>
                  <View style={styles.mentorInfo}>
                    <View style={styles.mentorNameRow}>
                      <Text style={styles.mentorName}>{mentor.name}</Text>
                      {mentor.verified && <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />}
                    </View>
                    <Text style={styles.mentorCollege}>{mentor.college} · {mentor.branch}</Text>
                    <View style={styles.mentorTags}>
                      {(mentor.skills || []).slice(0, 3).map((s: string, i: number) => (
                        <View key={i} style={styles.tag}>
                          <Text style={styles.tagText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                <View style={styles.mentorFooter}>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={COLORS.primary} />
                    <Text style={styles.ratingText}>{mentor.rating || '4.5'}</Text>
                    <Text style={styles.reviewCount}>({mentor.reviews_count || 0})</Text>
                  </View>
                  <Text style={styles.price}>₹{mentor.pricing || 500}/session</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerSection: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md, backgroundColor: COLORS.background },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: SPACING.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, height: 48, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm, marginBottom: SPACING.md, ...SHADOWS.sm },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  skillScroll: { gap: SPACING.sm, paddingRight: SPACING.lg },
  skillChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  skillChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  skillChipText: { ...TYPOGRAPHY.caption, color: COLORS.textPrimary, fontSize: 13 },
  skillChipTextActive: { color: COLORS.textInverse },
  list: { padding: SPACING.lg, gap: SPACING.md },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xxl * 2, gap: SPACING.md },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  mentorCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  mentorRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  mentorAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primaryLavender, alignItems: 'center', justifyContent: 'center' },
  mentorAvatarText: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  mentorInfo: { flex: 1 },
  mentorNameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  mentorName: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary, fontSize: 17 },
  mentorCollege: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  mentorTags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  tag: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.sm, backgroundColor: COLORS.surface },
  tagText: { ...TYPOGRAPHY.caption, fontSize: 11, color: COLORS.textPrimary },
  mentorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  ratingText: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.gold, fontSize: 14 },
  reviewCount: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  price: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary, fontSize: 16 },
});
