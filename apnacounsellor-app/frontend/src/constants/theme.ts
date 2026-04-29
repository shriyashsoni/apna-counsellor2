// Apna Counsellor Brand Colors - Derived from Logo
export const COLORS = {
  // Primary Brand Colors (from logo)
  primary: '#5F378F',           // Dark Purple - Main brand color
  primaryDark: '#4A2B70',       // Darker Purple for pressed states
  primaryLight: '#F6E5ED',      // Light Pink Background from logo
  primaryMedium: '#9063B8',     // Medium Purple from logo
  primaryLavender: '#B9A2D5',   // Light Lavender from logo
  
  // Backgrounds
  background: '#FFFFFF',
  surface: '#FAF5FF',           // Very light purple tint
  surfaceElevated: '#FFFFFF',
  surfacePink: '#F6E5ED',       // Logo background pink
  
  // Borders
  border: '#E8DFF2',            // Light purple-tinted border
  borderLight: '#F0E6F6',
  
  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textInverse: '#FFFFFF',
  textMuted: '#9CA3AF',
  
  // Overlays
  overlay: 'rgba(95, 55, 143, 0.4)',
  overlayLight: 'rgba(95, 55, 143, 0.1)',
  
  // Status Colors
  success: '#059669',
  successLight: '#ECFDF5',
  error: '#DC2626',
  errorLight: '#FEF2F2',
  warning: '#D97706',
  warningLight: '#FFFBEB',
  info: '#0284C7',
  infoLight: '#F0F9FF',
  
  // Special
  whatsapp: '#25D366',
  gold: '#F59E0B',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 100,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '800' as const, letterSpacing: -1 },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  h3: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  bodyLarge: { fontSize: 18, lineHeight: 26, fontWeight: '400' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const, textTransform: 'uppercase' as const, letterSpacing: 1 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const, color: '#6B7280' },
};

export const SHADOWS = {
  sm: {
    // iOS shadows
    shadowColor: '#5F378F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    // Android elevation
    elevation: 2,
  },
  md: {
    shadowColor: '#5F378F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#5F378F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};
