/**
 * Global constants
 */

// App configuration
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'TradeKuant';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const INITIAL_CAPITAL = parseFloat(process.env.INITIAL_CAPITAL || '300');
export const CURRENCY = process.env.CURRENCY || 'EUR';

// Time periods for metrics
export const METRIC_PERIODS = ['all', '1m', '3m', '6m', '1y', 'ytd'] as const;
export type MetricPeriod = (typeof METRIC_PERIODS)[number];

// Platform slugs
export const PLATFORMS = ['bitget', 'darwinex', 'etoro'] as const;
export type PlatformSlug = (typeof PLATFORMS)[number];

// Platform colors
export const PLATFORM_COLORS = {
  bitget: '#00C896',
  darwinex: '#1E3A5F',
  etoro: '#69C53E',
} as const;

// Chart colors
export const CHART_COLORS = {
  positive: '#10b981', // green
  negative: '#ef4444', // red
  neutral: '#6b7280', // gray
  background: '#1a1a1a',
  grid: '#333333',
} as const;

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';

// CSV headers for eToro
export const ETORO_CSV_HEADERS = [
  'date',
  'equity',
  'daily_pnl',
  'total_pnl',
  'copiers',
  'aum',
  'notes',
] as const;

// API rate limits (requests per minute)
export const RATE_LIMITS = {
  bitget: 20,
  darwinex: 10,
  default: 60,
} as const;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  metrics: 3600, // 1 hour
  snapshots: 300, // 5 minutes
  trades: 300, // 5 minutes
} as const;
