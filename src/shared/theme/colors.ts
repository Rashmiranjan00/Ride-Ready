// Design token: Color palette
// Source: Stitch project 1088682422893672661 — RideReady design system

export const Colors = {
  // Backgrounds
  background: '#131313',
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#3a3939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353534',

  // On-surface
  onBackground: '#e5e2e1',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#b9cacb',

  // Inverse
  inverseSurface: '#e5e2e1',
  inverseOnSurface: '#313030',

  // Outline
  outline: '#849495',
  outlineVariant: '#3b494b',

  // Primary — Neon Cyan
  primary: '#dbfcff',
  primaryContainer: '#00f0ff', // Main accent
  onPrimary: '#00363a',
  onPrimaryContainer: '#006970',
  primaryFixed: '#7df4ff',
  primaryFixedDim: '#00dbe9',
  onPrimaryFixed: '#002022',
  onPrimaryFixedVariant: '#004f54',
  inversePrimary: '#006970',
  surfaceTint: '#00dbe9',

  // Secondary — Electric Green
  secondary: '#d7ffc5',
  secondaryContainer: '#2ff801',
  onSecondary: '#053900',
  onSecondaryContainer: '#0f6d00',
  secondaryFixed: '#79ff5b',
  secondaryFixedDim: '#2ae500',
  onSecondaryFixed: '#022100',
  onSecondaryFixedVariant: '#095300',

  // Tertiary — Neutral
  tertiary: '#f8f5f5',
  tertiaryContainer: '#dcd9d8',
  onTertiary: '#313030',
  onTertiaryContainer: '#5f5e5e',
  tertiaryFixed: '#e5e2e1',
  tertiaryFixedDim: '#c8c6c5',
  onTertiaryFixed: '#1c1b1b',
  onTertiaryFixedVariant: '#474746',

  // Error
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onError: '#690005',
  onErrorContainer: '#ffdad6',
} as const;

export type ColorToken = keyof typeof Colors;
