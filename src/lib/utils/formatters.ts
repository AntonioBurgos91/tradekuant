/**
 * Formatting utilities
 * Format numbers, dates, currencies, percentages
 */

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// =============================================
// NUMBER FORMATTING
// =============================================

/**
 * Format number with thousands separator
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format currency (EUR by default)
 */
export function formatCurrency(
  value: number,
  currency: string = 'EUR',
  decimals: number = 2
): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercent(
  value: number,
  decimals: number = 2,
  showSign: boolean = false
): string {
  const formatted = new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: showSign ? 'always' : 'auto',
  }).format(value / 100);

  return formatted;
}

/**
 * Format compact number (1.2K, 1.5M, etc.)
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

// =============================================
// DATE FORMATTING
// =============================================

/**
 * Format date to readable string
 */
export function formatDate(
  date: string | Date,
  formatStr: string = 'dd/MM/yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Format datetime to readable string
 */
export function formatDateTime(
  date: string | Date,
  formatStr: string = 'dd/MM/yyyy HH:mm'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

/**
 * Format relative time (hace 2 horas, hace 3 días)
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;

  return formatDate(dateObj, 'dd MMM yyyy');
}

// =============================================
// SPECIAL FORMATTERS
// =============================================

/**
 * Format P&L with color (positive/negative)
 */
export function formatPnL(value: number, decimals: number = 2): {
  formatted: string;
  color: 'green' | 'red' | 'gray';
  sign: '+' | '-' | '';
} {
  const formatted = formatNumber(Math.abs(value), decimals);

  if (value > 0) {
    return { formatted, color: 'green', sign: '+' };
  } else if (value < 0) {
    return { formatted, color: 'red', sign: '-' };
  } else {
    return { formatted, color: 'gray', sign: '' };
  }
}

/**
 * Format percentage with color
 */
export function formatPercentColor(value: number, decimals: number = 2): {
  formatted: string;
  color: 'green' | 'red' | 'gray';
} {
  const formatted = formatPercent(value, decimals, true);

  if (value > 0) {
    return { formatted, color: 'green' };
  } else if (value < 0) {
    return { formatted, color: 'red' };
  } else {
    return { formatted, color: 'gray' };
  }
}

/**
 * Format trade duration
 */
export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
}

/**
 * Shorten wallet address
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format large numbers with suffix (K, M, B)
 */
export function formatLargeNumber(value: number, decimals: number = 1): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}
