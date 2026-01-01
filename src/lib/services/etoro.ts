/**
 * eToro CSV parser
 * Parses manually uploaded CSV files from eToro
 */

import { parse } from 'csv-parse/sync';
import { validateEtoroCsvRow, type CsvValidationError, type EtoroCsvRow } from '../utils/validators';
import { ETORO_CSV_HEADERS } from '../constants';

export interface ParseResult {
  success: boolean;
  data: EtoroCsvRow[];
  errors: CsvValidationError[];
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
}

/**
 * Parse eToro CSV file
 */
export async function parseEtoroCsv(
  csvContent: string
): Promise<ParseResult> {
  const errors: CsvValidationError[] = [];
  const validData: EtoroCsvRow[] = [];

  try {
    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Validate each row
    records.forEach((row, index) => {
      const validation = validateEtoroCsvRow(row as Record<string, string>, index + 2); // +2 for header + 0-index

      if (validation.valid && validation.data) {
        validData.push(validation.data);
      } else {
        errors.push(...validation.errors);
      }
    });

    return {
      success: errors.length === 0,
      data: validData,
      errors,
      summary: {
        totalRows: records.length,
        validRows: validData.length,
        invalidRows: errors.length,
      },
    };
  } catch (error) {
    console.error('Error parsing CSV:', error);

    return {
      success: false,
      data: [],
      errors: [
        {
          row: 0,
          field: 'file',
          message: error instanceof Error ? error.message : 'Error parsing CSV file',
        },
      ],
      summary: {
        totalRows: 0,
        validRows: 0,
        invalidRows: 1,
      },
    };
  }
}

/**
 * Generate CSV template for eToro
 */
export function generateCsvTemplate(): string {
  const headers = ETORO_CSV_HEADERS.join(',');
  const example = '2024-01-07,312.45,12.45,12.45,0,0,"Primera semana"';

  return `${headers}\n${example}`;
}

/**
 * Validate CSV headers
 */
export function validateCsvHeaders(csvContent: string): {
  valid: boolean;
  missing: string[];
  extra: string[];
} {
  try {
    const firstLine = csvContent.split('\n')[0];
    const headers = firstLine.split(',').map(h => h.trim().toLowerCase());

    const requiredHeaders = ['date', 'equity', 'daily_pnl', 'total_pnl'];
    const missing = requiredHeaders.filter(h => !headers.includes(h));
    const extra = headers.filter(h => !ETORO_CSV_HEADERS.includes(h as any));

    return {
      valid: missing.length === 0,
      missing,
      extra,
    };
  } catch (error) {
    return {
      valid: false,
      missing: ['all'],
      extra: [],
    };
  }
}

/**
 * Convert EtoroCsvRow to Snapshot insert format
 */
export function csvRowToSnapshot(row: EtoroCsvRow, platformId: number) {
  const initialCapital = parseFloat(process.env.INITIAL_CAPITAL || '300');
  const totalPnlPercent = (row.total_pnl / initialCapital) * 100;

  // Calculate peak equity for drawdown
  const peakEquity = row.equity >= initialCapital ? row.equity : initialCapital;
  const drawdown = ((peakEquity - row.equity) / peakEquity) * 100;

  return {
    platform_id: platformId,
    date: row.date,
    equity: row.equity,
    daily_pnl: row.daily_pnl,
    total_pnl: row.total_pnl,
    total_pnl_percent: totalPnlPercent,
    peak_equity: peakEquity,
    drawdown: drawdown,
    copiers: row.copiers || 0,
    aum: row.aum || 0,
    source: 'manual' as const,
    notes: row.notes || null,
    raw_data: row as any,
  };
}
