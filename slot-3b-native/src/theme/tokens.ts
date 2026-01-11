export const colors = {
  // Backgrounds
  background: '#050210',
  backgroundDark: '#020013',
  glassDark: 'rgba(10, 20, 46, 0.96)',
  
  // Accents
  primary: '#7cf4ff', // Cyan
  primaryGlow: '#7ff9ff',
  secondary: '#d1e3ff',
  secondaryText: '#e2f0ff',
  
  // Borders
  borderLight: 'rgba(88, 208, 255, 0.35)',
  borderStrong: 'rgba(111, 213, 255, 0.7)',
  
  // Functional
  text: '#f5f7ff',
  success: '#4ee6ff',
  warning: '#ffd761',
  error: '#ff6b6b', // Assuming standard error color
} as const;

export const gradients = {
  // Main dashboard background
  dashboard: ['#020013', '#04081f', '#050210'] as const,
  dashboardLocations: [0, 0.4, 1] as const,
  
  // Card backgrounds
  card: ['rgba(27, 60, 112, 0.92)', 'rgba(3, 6, 19, 0.98)'] as const,
  
  // Button gradients
  buttonPrimary: ['#49e2ff', '#7f8fff'] as const,
  
  // Sidebar active item
  navActive: ['rgba(79, 205, 255, 0.22)', 'rgba(12, 28, 65, 0.96)'] as const,
};

export const shadows = {
  glow: {
    shadowColor: '#3de3ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 5,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 10,
  },
  textGlow: {
    textShadowColor: 'rgba(89, 245, 255, 0.85)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  header: 20,
};

export const typography = {
  sizes: {
    xs: 10,
    s: 11,
    m: 13,
    l: 18,
    xl: 20,
  },
  letterSpacing: {
    wide: 0.16 * 16, // approx conversion if 1em = 16px, or just use number for RN
    wider: 0.18 * 16,
  },
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
  } as const,
};
