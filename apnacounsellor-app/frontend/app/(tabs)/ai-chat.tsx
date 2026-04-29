import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

type Message = { role: 'user' | 'assistant'; content: string; timestamp: string; suggestions?: string[] };

// Quick suggestions based on conversation context
const INITIAL_SUGGESTIONS = [
  'Which colleges are best for CSE?',
  'How to prepare for JEE in 3 months?',
  'Career options after 12th Science',
  'MHT-CET vs JEE - which to choose?',
];

const FOLLOW_UP_SUGGESTIONS: Record<string, string[]> = {
  college: [
    'What is the fee structure?',
    'How is the placement record?',
    'What are the admission requirements?',
    'Campus life and facilities?',
  ],
  exam: [
    'Best books for preparation?',
    'Important topics to focus on?',
    'Time management tips?',
    'Previous year papers analysis?',
  ],
  career: [
    'Required qualifications?',
    'Average salary range?',
    'Growth opportunities?',
    'Skills needed?',
  ],
  admission: [
    'Document checklist?',
    'Counselling process?',
    'Important dates?',
    'Seat allocation criteria?',
  ],
  default: [
    'Tell me more',
    'Compare options',
    'What are the pros and cons?',
    'Next steps?',
  ],
};

function getFollowUpSuggestions(content: string): string[] {
  const lower = content.toLowerCase();
  if (lower.includes('college') || lower.includes('iit') || lower.includes('nit') || lower.includes('university')) {
    return FOLLOW_UP_SUGGESTIONS.college;
  }
  if (lower.includes('exam') || lower.includes('jee') || lower.includes('neet') || lower.includes('cet') || lower.includes('prepare')) {
    return FOLLOW_UP_SUGGESTIONS.exam;
  }
  if (lower.includes('career') || lower.includes('job') || lower.includes('engineer') || lower.includes('doctor')) {
    return FOLLOW_UP_SUGGESTIONS.career;
  }
  if (lower.includes('admission') || lower.includes('counselling') || lower.includes('seat')) {
    return FOLLOW_UP_SUGGESTIONS.admission;
  }
  return FOLLOW_UP_SUGGESTIONS.default;
}

// Markdown styles
const markdownStyles = StyleSheet.create({
  body: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 10,
    marginBottom: 6,
  },
  heading3: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 24,
  },
  bullet_list: {
    marginBottom: 10,
  },
  ordered_list: {
    marginBottom: 10,
  },
  list_item: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet_list_icon: {
    color: COLORS.primary,
    fontSize: 16,
    marginRight: 8,
  },
  ordered_list_icon: {
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 8,
  },
  code_inline: {
    backgroundColor: COLORS.primaryLavender,
    color: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
  },
  code_block: {
    backgroundColor: '#1E1E1E',
    color: '#D4D4D4',
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    marginVertical: 8,
    overflow: 'hidden',
  },
  fence: {
    backgroundColor: '#1E1E1E',
    color: '#D4D4D4',
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    marginVertical: 8,
  },
  blockquote: {
    backgroundColor: COLORS.primaryLavender,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  strong: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: COLORS.info,
    textDecorationLine: 'underline',
  },
  hr: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: COLORS.primaryLavender,
  },
  th: {
    padding: 8,
    fontWeight: '600',
  },
  td: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const flatListRef = useRef<FlatList>(null);

  async function sendMessage(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: 'user', content: msg, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await apiCall('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: msg, session_id: sessionId || undefined }),
      });
      if (data.session_id && !sessionId) setSessionId(data.session_id);
      
      // Generate follow-up suggestions based on AI response
      const suggestions = getFollowUpSuggestions(data.response);
      
      const aiMsg: Message = { 
        role: 'assistant', 
        content: data.response, 
        timestamp: new Date().toISOString(),
        suggestions 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e: any) {
      const errMsg: Message = { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error. Please try again.', 
        timestamp: new Date().toISOString() 
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  function renderMessage({ item, index }: { item: Message; index: number }) {
    const isUser = item.role === 'user';
    const isLastMessage = index === messages.length - 1;
    
    return (
      <View>
        <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
          {!isUser && (
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={16} color={COLORS.textInverse} />
            </View>
          )}
          <View style={[styles.msgBubble, isUser ? styles.userBubble : styles.aiBubble]}>
            {isUser ? (
              <Text style={[styles.msgText, styles.userText]}>{item.content}</Text>
            ) : (
              <Markdown style={markdownStyles}>{item.content}</Markdown>
            )}
          </View>
        </View>
        
        {/* Show suggestions after AI response (only for last message and not loading) */}
        {!isUser && isLastMessage && !loading && item.suggestions && item.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>Quick follow-ups:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
              <View style={styles.suggestionsRow}>
                {item.suggestions.map((suggestion, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.quickSuggestion}
                    onPress={() => sendMessage(suggestion)}
                  >
                    <Text style={styles.quickSuggestionText}>{suggestion}</Text>
                    <Ionicons name="arrow-forward" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiHeaderIcon}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerSub}>Your 24/7 career guide</Text>
          </View>
        </View>
        {messages.length > 0 && (
          <TouchableOpacity
            testID="new-chat-btn"
            style={styles.newChatBtn}
            onPress={() => { setMessages([]); setSessionId(''); }}
          >
            <Ionicons name="refresh" size={18} color={COLORS.primary} />
            <Text style={styles.newChatText}>New</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex} keyboardVerticalOffset={90}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="chatbubbles-outline" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>Hi! I'm your AI Guide 👋</Text>
            <Text style={styles.emptyDesc}>Ask me about colleges, exams, career paths, admission processes, and study tips!</Text>
            
            <View style={styles.featureCards}>
              <View style={styles.featureCard}>
                <Ionicons name="school-outline" size={24} color={COLORS.primary} />
                <Text style={styles.featureTitle}>College Info</Text>
                <Text style={styles.featureDesc}>Rankings, fees, placements</Text>
              </View>
              <View style={styles.featureCard}>
                <Ionicons name="trophy-outline" size={24} color={COLORS.primary} />
                <Text style={styles.featureTitle}>Exam Tips</Text>
                <Text style={styles.featureDesc}>Prep strategies & resources</Text>
              </View>
              <View style={styles.featureCard}>
                <Ionicons name="rocket-outline" size={24} color={COLORS.primary} />
                <Text style={styles.featureTitle}>Career Guide</Text>
                <Text style={styles.featureDesc}>Paths & opportunities</Text>
              </View>
            </View>
            
            <Text style={styles.tryAskingLabel}>Try asking:</Text>
            <View style={styles.suggestionsWrap}>
              {INITIAL_SUGGESTIONS.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  testID={`suggestion-${i}`}
                  style={styles.suggestionChip}
                  onPress={() => sendMessage(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                  <Ionicons name="arrow-forward-circle" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {loading && (
          <View style={styles.typingIndicator}>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
            <Text style={styles.typingText}>AI is thinking...</Text>
          </View>
        )}

        <View style={styles.inputBar}>
          <TextInput
            testID="ai-chat-input"
            style={styles.textInput}
            placeholder="Ask me anything about your career..."
            placeholderTextColor={COLORS.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            testID="ai-send-btn"
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfacePink },
  flex: { flex: 1 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.md, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border, 
    backgroundColor: COLORS.background 
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  aiHeaderIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: COLORS.primary, 
    alignItems: 'center', 
    justifyContent: 'center',
    ...SHADOWS.sm 
  },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary },
  headerSub: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  newChatBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
    paddingHorizontal: SPACING.md, 
    paddingVertical: 8, 
    borderRadius: RADIUS.pill, 
    backgroundColor: COLORS.primaryLavender 
  },
  newChatText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  emptyIconWrap: { 
    marginBottom: SPACING.md, 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: COLORS.primaryLavender, 
    alignItems: 'center', 
    justifyContent: 'center', 
    ...SHADOWS.md 
  },
  emptyTitle: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: SPACING.xs },
  emptyDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.lg, paddingHorizontal: SPACING.md },
  
  featureCards: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  featureCard: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    borderRadius: RADIUS.lg, 
    padding: SPACING.md, 
    alignItems: 'center',
    ...SHADOWS.sm 
  },
  featureTitle: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.xs },
  featureDesc: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, fontSize: 10, textAlign: 'center' },
  
  tryAskingLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontWeight: '600', marginBottom: SPACING.sm, alignSelf: 'flex-start' },
  suggestionsWrap: { gap: SPACING.sm, width: '100%' },
  suggestionChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: COLORS.background, 
    borderRadius: RADIUS.lg, 
    padding: SPACING.md, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    ...SHADOWS.sm 
  },
  suggestionText: { ...TYPOGRAPHY.body, color: COLORS.textPrimary, fontSize: 14, flex: 1 },
  
  messageList: { padding: SPACING.md, paddingBottom: SPACING.sm },
  msgRow: { flexDirection: 'row', marginBottom: SPACING.md, alignItems: 'flex-start', gap: SPACING.sm },
  msgRowUser: { justifyContent: 'flex-end' },
  aiAvatar: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: COLORS.primary, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 4 
  },
  msgBubble: { maxWidth: '85%', padding: SPACING.md, borderRadius: RADIUS.xl },
  userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4, ...SHADOWS.sm },
  aiBubble: { backgroundColor: COLORS.background, borderBottomLeftRadius: 4, ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border },
  msgText: { ...TYPOGRAPHY.body, fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff' },
  
  suggestionsContainer: { marginLeft: 40, marginBottom: SPACING.md },
  suggestionsLabel: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginBottom: SPACING.xs, fontSize: 11 },
  suggestionsScroll: { marginHorizontal: -SPACING.md },
  suggestionsRow: { flexDirection: 'row', gap: SPACING.xs, paddingHorizontal: SPACING.md },
  quickSuggestion: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
    backgroundColor: COLORS.primaryLavender, 
    paddingHorizontal: SPACING.md, 
    paddingVertical: 8, 
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.primary + '30'
  },
  quickSuggestionText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '500', fontSize: 12 },
  
  typingIndicator: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.sm, 
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.sm,
    marginLeft: 40 
  },
  typingDots: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, opacity: 0.4 },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.8 },
  typingText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  
  inputBar: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    gap: SPACING.sm, 
    padding: SPACING.md, 
    paddingHorizontal: SPACING.lg, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.border, 
    backgroundColor: COLORS.background 
  },
  textInput: { 
    flex: 1, 
    minHeight: 44, 
    maxHeight: 100, 
    backgroundColor: COLORS.surface, 
    borderRadius: RADIUS.xl, 
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.sm, 
    fontSize: 15, 
    color: COLORS.textPrimary, 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
  sendBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: COLORS.primary, 
    alignItems: 'center', 
    justifyContent: 'center', 
    ...SHADOWS.md 
  },
  sendBtnDisabled: { opacity: 0.4 },
});
