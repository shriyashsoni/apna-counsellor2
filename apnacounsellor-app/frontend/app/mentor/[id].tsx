import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, Alert, Modal, Linking, Image, Dimensions, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MentorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;
  const isMediumScreen = width >= 400 && width < 768;
  const isLargeScreen = width >= 768;
  
  const [mentor, setMentor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => { if (id) fetchData(); }, [id]);

  async function fetchData() {
    try {
      const [mentorData, reviewsData, sessionsData] = await Promise.all([
        apiCall(`/mentors/${id}`),
        apiCall(`/reviews/${id}`).catch(() => []),
        apiCall(`/sessions/posted/${id}`).catch(() => []),
      ]);
      setMentor(mentorData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function submitReview() {
    if (!reviewComment.trim()) { Alert.alert('Error', 'Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      await apiCall('/reviews', {
        method: 'POST',
        body: JSON.stringify({ mentor_id: id, rating: reviewRating, comment: reviewComment }),
      });
      setShowReview(false);
      setReviewComment('');
      fetchData();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  }

  async function bookSession(session: any) {
    try {
      const res = await apiCall('/payments/create-link', {
        method: 'POST',
        body: JSON.stringify({
          mentor_id: id,
          date: session.date,
          time_slot: session.timeSlot,
          topic: session.topic || 'Session Booking',
        }),
      });
      if (res.payment_url) {
        Linking.openURL(res.payment_url);
      } else {
        Alert.alert('Success', 'Booking request sent!');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to book session');
    }
  }

  if (loading) return <SafeAreaView style={s.container}><View style={s.center}><ActivityIndicator size="large" color={COLORS.primary} /></View></SafeAreaView>;
  if (!mentor) return <SafeAreaView style={s.container}><View style={s.center}><Text style={s.errorText}>Mentor not found</Text></View></SafeAreaView>;

  // Filter upcoming sessions
  const upcomingSessions = sessions.filter(sess => {
    const sessionDate = new Date(sess.date);
    return sessionDate >= new Date() && sess.status !== 'booked';
  });

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={[s.scroll, isLargeScreen && { paddingHorizontal: 40 }]}>
        <TouchableOpacity testID="mentor-back-btn" style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Profile Hero - Responsive */}
        <View style={[s.hero, isLargeScreen && { flexDirection: 'row', alignItems: 'flex-start', gap: 24 }]}>
          <View style={isLargeScreen ? {} : { alignItems: 'center' }}>
            {mentor.profilePhoto || mentor.avatar ? (
              <Image source={{ uri: mentor.profilePhoto || mentor.avatar }} style={[s.avatarLarge, isSmallScreen && { width: 80, height: 80, borderRadius: 40 }]} />
            ) : (
              <View style={[s.avatarLarge, s.avatarPlaceholder, isSmallScreen && { width: 80, height: 80, borderRadius: 40 }]}>
                <Text style={[s.avatarText, isSmallScreen && { fontSize: 32 }]}>{(mentor.name || 'M')[0]}</Text>
              </View>
            )}
          </View>
          
          <View style={[isLargeScreen ? { flex: 1 } : { alignItems: 'center' }]}>
            <Text style={[s.mentorName, isSmallScreen && { fontSize: 22 }]}>{mentor.name}</Text>
            <Text style={s.mentorCollege}>{mentor.college} · {mentor.branch}</Text>
            <Text style={s.mentorYear}>{mentor.year}</Text>
            {mentor.verified && (
              <View style={s.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.textInverse} />
                <Text style={s.verifiedText}>Verified Mentor</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Row - Responsive */}
        <View style={[s.statsRow, isSmallScreen && { padding: SPACING.md }]}>
          <View style={s.stat}>
            <Text style={[s.statValue, isSmallScreen && { fontSize: 20 }]}>{mentor.rating || '4.5'}</Text>
            <Text style={s.statLabel}>Rating</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={[s.statValue, isSmallScreen && { fontSize: 20 }]}>{mentor.sessions_count || 0}</Text>
            <Text style={s.statLabel}>Sessions</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={[s.statValue, isSmallScreen && { fontSize: 20 }]}>{reviews.length}</Text>
            <Text style={s.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Available Sessions Section */}
        {upcomingSessions.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={s.sectionTitle}>Available Sessions</Text>
              <View style={s.sessionCountBadge}>
                <Text style={s.sessionCountText}>{upcomingSessions.length}</Text>
              </View>
            </View>
            
            {upcomingSessions.map((session, idx) => (
              <View key={idx} style={s.sessionCard}>
                <View style={s.sessionHeader}>
                  <View style={s.sessionDateBadge}>
                    <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
                    <Text style={s.sessionDate}>
                      {new Date(session.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <View style={s.sessionTimeBadge}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={s.sessionTime}>{session.timeSlot}</Text>
                  </View>
                </View>
                
                {session.topic && (
                  <Text style={s.sessionTopic}>{session.topic}</Text>
                )}
                
                <View style={s.sessionFooter}>
                  <View style={s.sessionPrice}>
                    <Text style={s.sessionPriceLabel}>Price</Text>
                    <Text style={s.sessionPriceValue}>₹{session.price || mentor.pricing || 500}</Text>
                  </View>
                  <TouchableOpacity 
                    style={s.bookSessionBtn}
                    onPress={() => bookSession(session)}
                  >
                    <Ionicons name="flash" size={16} color="#fff" />
                    <Text style={s.bookSessionBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* About Section */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            <Text style={s.sectionTitle}>About</Text>
          </View>
          <Text style={s.bioText}>{mentor.bio || mentor.about || 'No bio available'}</Text>
        </View>

        {/* Skills/Expertise */}
        {mentor.skills?.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
              <Text style={s.sectionTitle}>Expertise</Text>
            </View>
            <View style={s.tagsWrap}>
              {mentor.skills.map((sk: string, i: number) => (
                <View key={i} style={s.tag}>
                  <Text style={s.tagText}>{sk}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Availability */}
        {mentor.availability?.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <Text style={s.sectionTitle}>Available Days</Text>
            </View>
            <View style={s.tagsWrap}>
              {mentor.availability.map((d: string, i: number) => (
                <View key={i} style={s.dayTag}>
                  <Text style={s.dayTagText}>{d}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Pricing Card */}
        <View style={s.pricingCard}>
          <View>
            <Text style={s.pricingLabel}>Session Price</Text>
            <Text style={s.pricingValue}>₹{mentor.pricing || 500}</Text>
          </View>
          <Text style={s.pricingPer}>per session</Text>
        </View>

        {/* WhatsApp Contact */}
        <TouchableOpacity testID="whatsapp-mentor-btn" style={s.whatsappCard} onPress={() => {
          const msg = `Hi ${mentor.name}, I found you on Apna Counselor and I'd like to discuss a mentorship session!`;
          Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`);
        }}>
          <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
          <Text style={s.whatsappText}>Message on WhatsApp</Text>
          <Ionicons name="open-outline" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Book Session Button (if no posted sessions) */}
        {upcomingSessions.length === 0 && (
          <TouchableOpacity 
            style={s.mainBookBtn}
            onPress={() => {
              Alert.alert(
                'Book Session',
                `Contact ${mentor.name} via WhatsApp to schedule a session.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Open WhatsApp', onPress: () => {
                    const msg = `Hi ${mentor.name}, I'd like to book a counseling session with you!`;
                    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`);
                  }}
                ]
              );
            }}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={s.mainBookBtnText}>Book a Session</Text>
          </TouchableOpacity>
        )}

        {/* Reviews Section */}
        <View style={s.section}>
          <View style={s.reviewsHeader}>
            <View style={s.sectionHeader}>
              <Ionicons name="star-outline" size={20} color={COLORS.primary} />
              <Text style={s.sectionTitle}>Reviews ({reviews.length})</Text>
            </View>
            <TouchableOpacity testID="add-review-btn" style={s.addReviewBtn} onPress={() => setShowReview(true)}>
              <Ionicons name="create-outline" size={16} color={COLORS.primary} />
              <Text style={s.addReviewText}>Write Review</Text>
            </TouchableOpacity>
          </View>

          {reviews.length === 0 ? (
            <View style={s.noReviewsBox}>
              <Ionicons name="chatbubble-outline" size={32} color={COLORS.textMuted} />
              <Text style={s.noReviews}>No reviews yet. Be the first!</Text>
            </View>
          ) : (
            reviews.slice(0, 5).map((review, idx) => (
              <View key={idx} testID={`review-${idx}`} style={s.reviewCard}>
                <View style={s.reviewTop}>
                  <View style={s.reviewAvatar}>
                    <Text style={s.reviewAvatarText}>{(review.reviewer_name || 'U')[0]}</Text>
                  </View>
                  <View style={s.reviewInfo}>
                    <Text style={s.reviewerName}>{review.reviewer_name}</Text>
                    <View style={s.starsRow}>
                      {[1,2,3,4,5].map(star => (
                        <Ionicons key={star} name={star <= review.rating ? 'star' : 'star-outline'} size={14} color={COLORS.gold} />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={s.reviewComment}>{review.comment}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Review Modal */}
      <Modal visible={showReview} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modalContent, isSmallScreen && { padding: SPACING.md }]}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Write a Review</Text>
              <TouchableOpacity onPress={() => setShowReview(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={s.ratingLabel}>Rating</Text>
            <View style={s.ratingRow}>
              {[1,2,3,4,5].map(star => (
                <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                  <Ionicons name={star <= reviewRating ? 'star' : 'star-outline'} size={32} color={COLORS.gold} />
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={s.ratingLabel}>Comment</Text>
            <TextInput
              style={s.commentInput}
              placeholder="Share your experience..."
              placeholderTextColor={COLORS.textMuted}
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <TouchableOpacity 
              style={[s.submitReviewBtn, submittingReview && { opacity: 0.6 }]} 
              onPress={submitReview}
              disabled={submittingReview}
            >
              {submittingReview ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="send" size={18} color="#fff" />
                  <Text style={s.submitReviewText}>Submit Review</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  errorText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  scroll: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, paddingBottom: 100 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  
  hero: { alignItems: 'center', marginBottom: SPACING.xl },
  avatarLarge: { width: 96, height: 96, borderRadius: 48, marginBottom: SPACING.md },
  avatarPlaceholder: { backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...TYPOGRAPHY.h1, color: COLORS.textInverse, fontSize: 40 },
  mentorName: { ...TYPOGRAPHY.h1, color: COLORS.primary, marginBottom: SPACING.xs, textAlign: 'center' },
  mentorCollege: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center' },
  mentorYear: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.success, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.pill },
  verifiedText: { ...TYPOGRAPHY.caption, color: COLORS.textInverse, fontWeight: '600' },
  
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  
  sessionCountBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.pill, marginLeft: 'auto' },
  sessionCountText: { ...TYPOGRAPHY.caption, color: '#fff', fontWeight: '700' },
  
  sessionCard: { backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  sessionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  sessionDateBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryLavender, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.pill },
  sessionDate: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  sessionTimeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.pill },
  sessionTime: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  sessionTopic: { ...TYPOGRAPHY.body, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  sessionFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  sessionPrice: {},
  sessionPriceLabel: { ...TYPOGRAPHY.caption, color: COLORS.textMuted },
  sessionPriceValue: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  bookSessionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, ...SHADOWS.sm },
  bookSessionBtnText: { ...TYPOGRAPHY.caption, color: '#fff', fontWeight: '700' },
  
  bioText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, lineHeight: 24 },
  
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  tag: { backgroundColor: COLORS.primaryLavender, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.pill },
  tagText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  dayTag: { backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border },
  dayTagText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  
  pricingCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  pricingLabel: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.8)' },
  pricingValue: { ...TYPOGRAPHY.h1, color: '#fff' },
  pricingPer: { ...TYPOGRAPHY.caption, color: 'rgba(255,255,255,0.7)' },
  
  whatsappCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: '#25D366' },
  whatsappText: { flex: 1, ...TYPOGRAPHY.body, color: COLORS.textPrimary, fontWeight: '600' },
  
  mainBookBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.xl, ...SHADOWS.md },
  mainBookBtnText: { ...TYPOGRAPHY.body, color: '#fff', fontWeight: '700' },
  
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  addReviewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryLavender, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.pill },
  addReviewText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  
  noReviewsBox: { alignItems: 'center', padding: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl },
  noReviews: { ...TYPOGRAPHY.body, color: COLORS.textMuted, marginTop: SPACING.sm },
  
  reviewCard: { backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  reviewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryLavender, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm },
  reviewAvatarText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary },
  reviewInfo: { flex: 1 },
  reviewerName: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.textPrimary },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewComment: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontSize: 14, lineHeight: 20 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: RADIUS.xl * 2, borderTopRightRadius: RADIUS.xl * 2, padding: SPACING.xl, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg },
  modalTitle: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  ratingLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  commentInput: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, minHeight: 100, fontSize: 15, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  submitReviewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.md },
  submitReviewText: { ...TYPOGRAPHY.body, color: '#fff', fontWeight: '700' },
});
