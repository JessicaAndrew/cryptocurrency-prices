/**
 * Application-wide constants
 */

export const API = {
  BASE_URL: 'https://api.coingecko.com/api/v3',
  TIMEOUT: 10000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const

export const CRYPTO = {
  DEFAULT_LIMIT: 10,
  DEFAULT_CURRENCY: 'zar',
  SUPPORTED_CURRENCIES: ['zar', 'usd', 'eur', 'gbp', 'btc'] as const,
} as const

export const TIMEFRAMES = [
  { label: '24H', days: 1, value: 'day' },
  { label: '7D', days: 7, value: 'week' },
  { label: '30D', days: 30, value: 'month' },
  { label: '1Y', days: 365, value: 'year' },
] as const

export const CURRENCY_SYMBOLS: Record<string, string> = {
  zar: 'R',
  usd: '$',
  eur: '€',
  gbp: '£',
  btc: '₿',
} as const

export const COLORS = {
  primary: '#0066cc',
  danger: '#ff3333',
  success: '#00cc66',
  dark: '#0a0e27',
  darker: '#050813',
} as const

export const ROUTES = {
  HOME: '/',
  CRYPTO_DETAIL: (id: string) => `/crypto/${id}`,
} as const

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch data. Please try again.',
  NO_DATA: 'No data available at the moment.',
  INVALID_CRYPTO: 'Cryptocurrency not found.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const
