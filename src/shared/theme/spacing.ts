// Design token: Spacing — 4px baseline grid

export const Spacing = {
  unit: 4,
  gutter: 16,
  marginEdge: 24,
  touchTargetMin: 48,
  cardGap: 12,

  // Named multiples for convenience
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
