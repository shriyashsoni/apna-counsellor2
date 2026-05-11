export const COLORS = {
  // Premium Brand Indigo
  primary: '#4F46E5',           
  primaryDark: '#3730A3',       
  primaryLight: '#EEF2FF',      
  primaryMedium: '#6366F1',     
  primaryLavender: '#F5F3FF',   
  
  // Premium Obsidian Neutrals
  background: '#F8FAFC',        
  surface: '#FFFFFF',           
  surfaceElevated: '#F1F5F9',   
  surfaceGlass: 'rgba(255, 255, 255, 0.9)',
  
  // High Contrast Text
  textPrimary: '#1E1B4B',       // Very Dark Indigo
  textSecondary: '#475569',     // Slate 600
  textMuted: '#94A3B8',         // Slate 400
  textInverse: '#FFFFFF',
  
  // Borders
  border: '#E2E8F0',            
  borderLight: '#F1F5F9',
  
  // Accent & Status
  secondary: '#10B981',         
  accent: '#F59E0B',            
  success: '#059669',
  error: '#EF4444',
  warning: '#D97706',
  info: '#3B82F6',
  
  // Special
  whatsapp: '#25D366',
  telegram: '#0088cc',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '800' as const, color: '#1E1B4B', letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, color: '#1E1B4B', letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '700' as const, color: '#1E1B4B' },
  bodyLarge: { fontSize: 18, fontWeight: '400' as const, color: '#475569' },
  body: { fontSize: 16, fontWeight: '400' as const, color: '#475569' },
  label: { fontSize: 14, fontWeight: '600' as const, color: '#4F46E5', letterSpacing: 0.5 },
  caption: { fontSize: 12, fontWeight: '500' as const, color: '#94A3B8' },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
};

