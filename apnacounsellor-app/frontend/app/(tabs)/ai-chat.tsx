import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { apiCall } from '../../src/utils/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

type Message = { role: 'user' | 'assistant'; content: string; timestamp: string };

export default function AIChat() {
  const router = useRouter();
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
      
      const aiMsg: Message = { 
        role: 'assistant', 
        content: data.response, 
        timestamp: new Date().toISOString()
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E1B4B" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Counseling Copilot</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>AI Agent Online</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => { setMessages([]); setSessionId(''); }} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.messageWrapper, item.role === 'user' ? styles.userWrapper : styles.aiWrapper]}>
            <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <View style={styles.messageContent}>
                {item.role === 'user' ? (
                  <Text style={styles.userText}>{item.content}</Text>
                ) : (
                  <Markdown style={markdownStyles}>{item.content}</Markdown>
                )}
              </View>
              <Text style={[styles.timestamp, item.role === 'user' ? styles.userTimestamp : styles.aiTimestamp]}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <View style={styles.inputArea}>
          <View style={styles.glassInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask about NITs, IIITs, cutoffs..."
              placeholderTextColor="#94A3B8"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} 
              onPress={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const markdownStyles = {
  body: { color: '#1E1B4B', fontSize: 15, lineHeight: 22 },
  strong: { fontWeight: '700' as any },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { padding: 8 },
  headerTitleContainer: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E1B4B' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
  statusText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  clearBtn: { padding: 8 },
  chatList: { padding: 20, paddingBottom: 40 },
  messageWrapper: { marginBottom: 16, flexDirection: 'row' },
  userWrapper: { justifyContent: 'flex-end' },
  aiWrapper: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', padding: 14, borderRadius: 20 },
  userBubble: { backgroundColor: '#4F46E5', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, ...SHADOWS.sm, borderWidth: 1, borderColor: '#F1F5F9' },
  messageContent: { marginBottom: 4 },
  userText: { color: '#FFFFFF', fontSize: 15, lineHeight: 22 },
  timestamp: { fontSize: 10, alignSelf: 'flex-end' },
  userTimestamp: { color: 'rgba(255,255,255,0.7)' },
  aiTimestamp: { color: '#94A3B8' },
  inputArea: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  glassInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: { flex: 1, minHeight: 40, maxHeight: 100, fontSize: 15, color: '#1E1B4B', paddingHorizontal: 8, paddingVertical: 4 },
  sendBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendBtnDisabled: { backgroundColor: '#94A3B8' },
});
