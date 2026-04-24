// Design token: Typography
// Space Grotesk → headings, metrics, hero numbers
// Inter → body text, labels, captions

export const Typography = {
  displayHero: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 84,
    lineHeight: 90,
    letterSpacing: -3.36, // -0.04em at 84px
    fontWeight: '700' as const,
  },
  metricLarge: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: -0.96, // -0.02em at 48px
    fontWeight: '600' as const,
  },
  headlineMd: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '500' as const,
  },
  bodyLg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  labelCaps: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2, // 0.1em at 12px
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
  },
  labelSm: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
  },
} as const;
