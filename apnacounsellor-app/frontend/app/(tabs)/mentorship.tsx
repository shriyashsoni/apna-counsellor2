import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import GenderAvatar from '../../src/components/GenderAvatar';

export default function MentorshipScreen() {
  const router = useRouter();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMentors() {
      try {
        const data = await apiCall('/mentors');
        setMentors(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log('Mentors fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadMentors();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expert Mentors</Text>
        <Text style={styles.subtitle}>Get 1-on-1 guidance from top IIT/NIT alumni</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {mentors.map((mentor, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.mentorCard}
              onPress={() => router.push(`/mentor/${mentor.id}`)}
              activeOpacity={0.9}
            >
              <View style={styles.mentorRow}>
                <GenderAvatar gender={mentor.gender} size={60} imageUrl={mentor.profilePhoto || mentor.avatar} />
                <View style={styles.mentorInfo}>
                  <Text style={styles.mentorName}>{mentor.name}</Text>
                  <Text style={styles.mentorCollege}>{mentor.college || 'Premier Institute'}</Text>
                  <View style={styles.tagContainer}>
                    <View style={styles.tag}><Text style={styles.tagText}>{mentor.expertise || 'Engineering'}</Text></View>
                    <View style={[styles.tag, { backgroundColor: COLORS.successLight }]}><Text style={[styles.tagText, { color: COLORS.success }]}>{mentor.rating || '4.8'} ★</Text></View>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>₹{mentor.pricing || 499}</Text>
                  <Text style={styles.priceLabel}>/ session</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.bookBtn}
                onPress={() => router.push(`/booking/${mentor.id}`)}
              >
                <Text style={styles.bookBtnText}>Book 1-on-1 Session</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  header: { padding: SPACING.lg, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  title: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  subtitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: 100 },
  mentorCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOWS.md, borderWidth: 1, borderColor: COLORS.border },
  mentorRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  mentorInfo: { flex: 1 },
  mentorName: { ...TYPOGRAPHY.h3, color: COLORS.textPrimary },
  mentorCollege: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: 8 },
  tagContainer: { flexDirection: 'row', gap: 6 },
  tag: { backgroundColor: COLORS.primaryLavender, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.pill },
  tagText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontSize: 10, fontWeight: '700' },
  priceContainer: { alignItems: 'flex-end' },
  price: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  priceLabel: { ...TYPOGRAPHY.caption, fontSize: 10 },
  bookBtn: { backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: RADIUS.lg, marginTop: SPACING.md, alignItems: 'center' },
  bookBtnText: { ...TYPOGRAPHY.body, color: COLORS.textInverse, fontWeight: '700' },
});
