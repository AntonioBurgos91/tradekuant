/**
 * Validation utilities
 * Validate inputs, CSV data, API responses
 */

import { parseISO, isValid } from 'date-fns';

// =============================================
// TYPE GUARDS
// =============================================

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && isValid(value);
}

// =============================================
// DATE VALIDATION
// =============================================

/**
 * Validate ISO date string (YYYY-MM-DD)
 */
export function isValidDateString(dateStr: string): boolean {
  if (!isString(dateStr)) return false;

  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoRegex.test(dateStr)) return false;

  const date = parseISO(dateStr);
  return isValid(date);
}

/**
 * Validate date is not in the future
 */
export function isNotFutureDate(dateStr: string): boolean {
  if (!isValidDateString(dateStr)) return false;

  const date = parseISO(dateStr);
  const now = new Date();
  return date <= now;
}

// =============================================
// NUMBER VALIDATION
// =============================================

/**
 * Validate positive number
 */
export function isPositive(value: number): boolean {
  return isNumber(value) && value > 0;
}

/**
 * Validate non-negative number
 */
export function isNonNegative(value: number): boolean {
  return isNumber(value) && value >= 0;
}

/**
 * Validate number in range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return isNumber(value) && value >= min && value <= max;
}

// =============================================
// CSV VALIDATION
// =============================================

export interface CsvValidationError {
  row: number;
  field: string;
  message: string;
}

export interface EtoroCsvRow {
  date: string;
  equity: number;
  daily_pnl: number;
  total_pnl: number;
  copiers?: number;
  aum?: number;
  notes?: string;
}

/**
 * Validate eToro CSV row
 */
export function validateEtoroCsvRow(
  row: Record<string, string>,
  rowIndex: number
): { valid: boolean; errors: CsvValidationError[]; data?: EtoroCsvRow } {
  const errors: CsvValidationError[] = [];

  // Validate date
  if (!row.date) {
    errors.push({
      row: rowIndex,
      field: 'date',
      message: 'Fecha es requerida',
    });
  } else if (!isValidDateString(row.date)) {
    errors.push({
      row: rowIndex,
      field: 'date',
      message: 'Formato de fecha inválido (usar YYYY-MM-DD)',
    });
  } else if (!isNotFutureDate(row.date)) {
    errors.push({
      row: rowIndex,
      field: 'date',
      message: 'La fecha no puede ser futura',
    });
  }

  // Validate equity
  const equity = parseFloat(row.equity);
  if (isNaN(equity)) {
    errors.push({
      row: rowIndex,
      field: 'equity',
      message: 'Equity debe ser un número',
    });
  } else if (!isPositive(equity)) {
    errors.push({
      row: rowIndex,
      field: 'equity',
      message: 'Equity debe ser mayor a 0',
    });
  }

  // Validate daily_pnl
  const dailyPnl = parseFloat(row.daily_pnl || '0');
  if (isNaN(dailyPnl)) {
    errors.push({
      row: rowIndex,
      field: 'daily_pnl',
      message: 'Daily P&L debe ser un número',
    });
  }

  // Validate total_pnl
  const totalPnl = parseFloat(row.total_pnl || '0');
  if (isNaN(totalPnl)) {
    errors.push({
      row: rowIndex,
      field: 'total_pnl',
      message: 'Total P&L debe ser un número',
    });
  }

  // Optional: copiers
  const copiers = row.copiers ? parseInt(row.copiers) : 0;
  if (row.copiers && (isNaN(copiers) || !isNonNegative(copiers))) {
    errors.push({
      row: rowIndex,
      field: 'copiers',
      message: 'Copiers debe ser un número entero no negativo',
    });
  }

  // Optional: aum
  const aum = row.aum ? parseFloat(row.aum) : 0;
  if (row.aum && (isNaN(aum) || !isNonNegative(aum))) {
    errors.push({
      row: rowIndex,
      field: 'aum',
      message: 'AUM debe ser un número no negativo',
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      date: row.date,
      equity,
      daily_pnl: dailyPnl,
      total_pnl: totalPnl,
      copiers,
      aum,
      notes: row.notes || undefined,
    },
  };
}

// =============================================
// API VALIDATION
// =============================================

/**
 * Validate environment variables
 */
export function validateEnvVars(
  required: string[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Validate CRON secret
 */
export function validateCronSecret(secret: string | null): boolean {
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    console.warn('CRON_SECRET not configured');
    return false;
  }

  return secret === expectedSecret;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
