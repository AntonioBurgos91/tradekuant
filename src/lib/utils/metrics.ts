/**
 * Trading metrics calculations
 * All formulas for calculating trading performance metrics
 */

import type { Snapshot, Trade } from '@/lib/db/types';
import { differenceInDays, parseISO } from 'date-fns';

// =============================================
// RETURN METRICS
// =============================================

/**
 * Calculate total return percentage
 */
export function totalReturn(initialCapital: number, currentEquity: number): number {
  if (initialCapital === 0) return 0;
  return ((currentEquity - initialCapital) / initialCapital) * 100;
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 */
export function cagr(initialCapital: number, finalEquity: number, years: number): number {
  if (initialCapital === 0 || years === 0) return 0;
  return (Math.pow(finalEquity / initialCapital, 1 / years) - 1) * 100;
}

/**
 * Calculate average monthly return
 */
export function avgMonthlyReturn(snapshots: Snapshot[]): number {
  const monthlyReturns = calculateMonthlyReturns(snapshots);
  if (monthlyReturns.length === 0) return 0;

  const sum = monthlyReturns.reduce((acc, val) => acc + val, 0);
  return sum / monthlyReturns.length;
}

/**
 * Calculate monthly returns from snapshots
 */
export function calculateMonthlyReturns(snapshots: Snapshot[]): number[] {
  const monthlyMap = calculateMonthlyReturnsMap(snapshots);
  return Array.from(monthlyMap.values());
}

/**
 * Calculate monthly returns as a Map with year-month keys
 */
export function calculateMonthlyReturnsMap(snapshots: Snapshot[]): Map<string, number> {
  const sortedSnapshots = [...snapshots].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const monthlyData = new Map<string, { start: number; end: number }>();

  for (const snapshot of sortedSnapshots) {
    const date = parseISO(snapshot.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData.has(key)) {
      monthlyData.set(key, { start: snapshot.equity, end: snapshot.equity });
    } else {
      const current = monthlyData.get(key)!;
      monthlyData.set(key, { ...current, end: snapshot.equity });
    }
  }

  const returns = new Map<string, number>();
  let prevEnd: number | null = null;

  for (const [key, { start, end }] of monthlyData) {
    const base = prevEnd || start;
    if (base > 0) {
      returns.set(key, ((end - base) / base) * 100);
    }
    prevEnd = end;
  }

  return returns;
}

// =============================================
// RISK METRICS
// =============================================

/**
 * Calculate maximum drawdown from snapshots
 */
export function maxDrawdown(snapshots: Snapshot[]): number {
  if (snapshots.length === 0) return 0;

  const sortedSnapshots = [...snapshots].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let peak = sortedSnapshots[0].equity;
  let maxDD = 0;

  for (const snapshot of sortedSnapshots) {
    if (snapshot.equity > peak) {
      peak = snapshot.equity;
    }
    const dd = ((peak - snapshot.equity) / peak) * 100;
    if (dd > maxDD) {
      maxDD = dd;
    }
  }

  return maxDD;
}

/**
 * Calculate current drawdown
 */
export function currentDrawdown(snapshots: Snapshot[]): number {
  if (snapshots.length === 0) return 0;

  const sortedSnapshots = [...snapshots].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let peak = sortedSnapshots[0].equity;

  for (const snapshot of sortedSnapshots) {
    if (snapshot.equity > peak) {
      peak = snapshot.equity;
    }
  }

  const currentEquity = sortedSnapshots[sortedSnapshots.length - 1].equity;
  return ((peak - currentEquity) / peak) * 100;
}

/**
 * Calculate volatility (standard deviation of returns)
 */
export function volatility(snapshots: Snapshot[]): number {
  const returns = snapshots.map(s => s.daily_pnl / s.equity * 100).filter(r => !isNaN(r));

  if (returns.length === 0) return 0;

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / returns.length;

  // Annualized volatility (assuming ~252 trading days)
  return Math.sqrt(variance) * Math.sqrt(252);
}

// =============================================
// RATIO METRICS
// =============================================

/**
 * Calculate Sharpe Ratio (assuming risk-free rate = 0)
 */
export function sharpeRatio(snapshots: Snapshot[]): number {
  const returns = snapshots.map(s => s.daily_pnl / s.equity * 100).filter(r => !isNaN(r));

  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  );

  if (stdDev === 0) return 0;

  // Annualized Sharpe Ratio
  return (avgReturn / stdDev) * Math.sqrt(252);
}

/**
 * Calculate Sortino Ratio (only downside volatility)
 */
export function sortinoRatio(snapshots: Snapshot[]): number {
  const returns = snapshots.map(s => s.daily_pnl / s.equity * 100).filter(r => !isNaN(r));

  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const negativeReturns = returns.filter(r => r < 0);

  if (negativeReturns.length === 0) return 0;

  const downside = Math.sqrt(
    negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length
  );

  if (downside === 0) return 0;

  // Annualized Sortino Ratio
  return (avgReturn / downside) * Math.sqrt(252);
}

/**
 * Calculate Calmar Ratio (CAGR / Max Drawdown)
 */
export function calmarRatio(cagrValue: number, maxDrawdown: number): number {
  if (maxDrawdown === 0) return 0;
  return cagrValue / maxDrawdown;
}

/**
 * Calculate Profit Factor
 */
export function profitFactor(trades: Trade[]): number {
  const grossProfit = trades
    .filter(t => t.pnl && t.pnl > 0)
    .reduce((sum, t) => sum + (t.pnl || 0), 0);

  const grossLoss = Math.abs(
    trades
      .filter(t => t.pnl && t.pnl < 0)
      .reduce((sum, t) => sum + (t.pnl || 0), 0)
  );

  if (grossLoss === 0) return grossProfit > 0 ? Infinity : 0;
  return grossProfit / grossLoss;
}

// =============================================
// TRADING METRICS
// =============================================

/**
 * Calculate win rate
 */
export function winRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const winners = trades.filter(t => t.pnl && t.pnl > 0).length;
  return (winners / trades.length) * 100;
}

/**
 * Calculate average win
 */
export function avgWin(trades: Trade[]): number {
  const winningTrades = trades.filter(t => t.pnl && t.pnl > 0);
  if (winningTrades.length === 0) return 0;

  const sum = winningTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  return sum / winningTrades.length;
}

/**
 * Calculate average loss
 */
export function avgLoss(trades: Trade[]): number {
  const losingTrades = trades.filter(t => t.pnl && t.pnl < 0);
  if (losingTrades.length === 0) return 0;

  const sum = losingTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  return sum / losingTrades.length;
}

/**
 * Calculate average trade duration in hours
 */
export function avgTradeDuration(trades: Trade[]): number {
  const closedTrades = trades.filter(t => t.closed_at);
  if (closedTrades.length === 0) return 0;

  const durations = closedTrades.map(t => {
    const opened = parseISO(t.opened_at);
    const closed = parseISO(t.closed_at!);
    return differenceInDays(closed, opened);
  });

  const sum = durations.reduce((acc, val) => acc + val, 0);
  return sum / durations.length;
}

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Get best month return
 */
export function bestMonth(snapshots: Snapshot[]): number {
  const monthlyReturns = calculateMonthlyReturns(snapshots);
  return monthlyReturns.length > 0 ? Math.max(...monthlyReturns) : 0;
}

/**
 * Get worst month return
 */
export function worstMonth(snapshots: Snapshot[]): number {
  const monthlyReturns = calculateMonthlyReturns(snapshots);
  return monthlyReturns.length > 0 ? Math.min(...monthlyReturns) : 0;
}

/**
 * Count positive months
 */
export function positiveMonths(snapshots: Snapshot[]): number {
  const monthlyReturns = calculateMonthlyReturns(snapshots);
  return monthlyReturns.filter(r => r > 0).length;
}

/**
 * Count negative months
 */
export function negativeMonths(snapshots: Snapshot[]): number {
  const monthlyReturns = calculateMonthlyReturns(snapshots);
  return monthlyReturns.filter(r => r < 0).length;
}

/**
 * Calculate years from date range
 */
export function yearsFromDateRange(startDate: Date, endDate: Date): number {
  const days = differenceInDays(endDate, startDate);
  return days / 365.25;
}
