import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const url = `${API_BASE}/api${endpoint}`;
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail));
  }
  return response.json();
}

export async function login(email: string, password: string) {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await AsyncStorage.setItem('access_token', data.access_token);
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function register(name: string, email: string, password: string, role: string) {
  const data = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
  await AsyncStorage.setItem('access_token', data.access_token);
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function logout() {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('user');
}

export async function getUser() {
  const data = await apiCall('/auth/me');
  return data.user;
}
