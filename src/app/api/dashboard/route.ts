/**
 * GET /api/dashboard
 * Aggregated dashboard data endpoint
 * Supports period filtering: ?period=1m|3m|6m|1y|ytd|all
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import type { Platform, Snapshot, MetricsCache, GlobalMetricsCache } from '@/lib/db/types';

type Period = '1m' | '3m' | '6m' | '1y' | 'ytd' | 'all';

function getPeriodStartDate(period: Period): Date {
  const now = new Date();
  switch (period) {
    case '1m':
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case '3m':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    case '6m':
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    case '1y':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    case 'ytd':
      return new Date(now.getFullYear(), 0, 1);
    case 'all':
    default:
      return new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()); // 2 years back
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get period from query params
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get('period') || 'all') as Period;
    const validPeriods: Period[] = ['1m', '3m', '6m', '1y', 'ytd', 'all'];
    const selectedPeriod = validPeriods.includes(period) ? period : 'all';

    const periodStartDate = getPeriodStartDate(selectedPeriod);

    // Get platforms
    const { data: platforms, error: platformsError } = await supabase
      .from('platforms')
      .select('*')
      .order('id');

    if (platformsError) throw platformsError;

    const platformList = (platforms || []) as Platform[];

    // Get latest snapshot for each platform
    const latestSnapshots = await Promise.all(
      platformList.map(async (platform) => {
        const { data } = await supabase
          .from('snapshots')
          .select('*')
          .eq('platform_id', platform.id)
          .order('date', { ascending: false })
          .limit(1)
          .single();
        return { platform, snapshot: data as Snapshot | null };
      })
    );

    // Get metrics cache for each platform (use selected period)
    const { data: metricsCache, error: metricsError } = await supabase
      .from('metrics_cache')
      .select('*')
      .eq('period', selectedPeriod);

    if (metricsError) throw metricsError;

    // Fallback to 'all' if no metrics for selected period
    let metricsList = (metricsCache || []) as MetricsCache[];
    if (metricsList.length === 0 && selectedPeriod !== 'all') {
      const { data: allMetrics } = await supabase
        .from('metrics_cache')
        .select('*')
        .eq('period', 'all');
      metricsList = (allMetrics || []) as MetricsCache[];
    }

    // Get global metrics
    const { data: globalMetrics, error: globalError } = await supabase
      .from('global_metrics_cache')
      .select('*')
      .eq('period', selectedPeriod)
      .single();

    // Fallback to 'all' if no global metrics for selected period
    let globalData = globalMetrics as GlobalMetricsCache | null;
    if (!globalData && selectedPeriod !== 'all') {
      const { data: allGlobal } = await supabase
        .from('global_metrics_cache')
        .select('*')
        .eq('period', 'all')
        .single();
      globalData = allGlobal as GlobalMetricsCache | null;
    }

    if (globalError && globalError.code !== 'PGRST116') throw globalError;

    // Get snapshots for charts (filtered by period)
    const { data: chartSnapshots, error: chartError } = await supabase
      .from('snapshots')
      .select('date, equity, total_pnl_percent, platform_id, drawdown')
      .gte('date', periodStartDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (chartError) throw chartError;

    // Get last 30 days snapshots for sparklines
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: sparklineSnapshots } = await supabase
      .from('snapshots')
      .select('date, equity, platform_id')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Calculate monthly returns for the period
    const monthlyReturns = calculateMonthlyReturns(chartSnapshots || [], selectedPeriod);

    // Build equity curve data
    const equityCurve = buildEquityCurve(chartSnapshots || [], platformList);

    // Build drawdown curve
    const drawdownCurve = buildDrawdownCurve(chartSnapshots || [], platformList);

    // Build sparkline data
    const sparklineData = buildSparklineData(sparklineSnapshots || [], platformList);

    // Build platform data with metrics
    const platformsData = latestSnapshots.map(({ platform, snapshot }) => {
      const metrics = metricsList.find(m => m.platform_id === platform.id);
      return {
        id: platform.id,
        name: platform.name,
        slug: platform.slug,
        type: platform.slug === 'bitget' ? 'Copy Trading' :
              platform.slug === 'darwinex' ? 'DARWIN Index' : 'Popular Investor',
        color: platform.color || '#10B981',
        equity: snapshot?.equity || 0,
        return: metrics?.total_return || snapshot?.total_pnl_percent || 0,
        copiers: snapshot?.copiers || metrics?.current_copiers || 0,
        aum: snapshot?.aum || metrics?.total_aum || 0,
        drawdown: metrics?.max_drawdown || snapshot?.drawdown || 0,
        sharpe: metrics?.sharpe_ratio || 0,
        sortino: metrics?.sortino_ratio || 0,
        winRate: metrics?.win_rate || 0,
        lastUpdate: snapshot?.updated_at || snapshot?.created_at || new Date().toISOString(),
      };
    });

    // Calculate totals
    const totalEquity = platformsData.reduce((sum, p) => sum + p.equity, 0);
    const totalCopiers = platformsData.reduce((sum, p) => sum + p.copiers, 0);
    const totalAUM = platformsData.reduce((sum, p) => sum + p.aum, 0);

    // Get aggregated metrics
    const avgSharpe = metricsList.length
      ? metricsList.reduce((sum, m) => sum + (m.sharpe_ratio || 0), 0) / metricsList.length
      : 0;
    const avgSortino = metricsList.length
      ? metricsList.reduce((sum, m) => sum + (m.sortino_ratio || 0), 0) / metricsList.length
      : 0;
    const avgWinRate = metricsList.length
      ? metricsList.reduce((sum, m) => sum + (m.win_rate || 0), 0) / metricsList.length
      : 0;
    const maxDrawdown = metricsList.length
      ? Math.max(...metricsList.map(m => Math.abs(m.max_drawdown || 0)))
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        period: selectedPeriod,
        global: {
          totalEquity,
          totalReturn: globalData?.total_return || 0,
          maxDrawdown: globalData?.combined_max_drawdown || maxDrawdown,
          totalCopiers,
          totalAUM,
          sharpeRatio: avgSharpe,
          sortinoRatio: avgSortino,
          winRate: avgWinRate * 100,
          ytdReturn: globalData?.total_return || 0,
        },
        platforms: platformsData,
        monthlyReturns,
        equityCurve,
        drawdownCurve,
        sparklineData,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function calculateMonthlyReturns(snapshots: any[], period: Period) {
  // Group by month (aggregate all platforms)
  const monthlyData: Record<string, { start: number; end: number }> = {};

  // First, group snapshots by date and sum equity across platforms
  const dailyTotals: Record<string, number> = {};
  snapshots.forEach((s) => {
    if (!dailyTotals[s.date]) {
      dailyTotals[s.date] = 0;
    }
    dailyTotals[s.date] += s.equity;
  });

  // Then calculate monthly start/end
  Object.entries(dailyTotals).forEach(([date, equity]) => {
    const month = date.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { start: equity, end: equity };
    } else {
      monthlyData[month].end = equity;
    }
  });

  // Determine how many months to show based on period
  const monthsToShow = period === '1m' ? 1 : period === '3m' ? 3 : period === '6m' ? 6 : 12;
  const now = new Date();
  const results: { month: string; value: number }[] = [];

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const data = monthlyData[monthKey];

    let value = 0;
    if (data && data.start > 0) {
      value = ((data.end - data.start) / data.start) * 100;
    }

    results.push({
      month: monthKey,
      value: parseFloat(value.toFixed(2))
    });
  }

  return results;
}

function buildEquityCurve(snapshots: any[], platforms: Platform[]) {
  // Group snapshots by date
  const dateMap: Record<string, Record<number, number>> = {};

  snapshots.forEach((s) => {
    if (!dateMap[s.date]) {
      dateMap[s.date] = {};
    }
    dateMap[s.date][s.platform_id] = s.equity;
  });

  // Get sorted dates (sample based on data volume)
  const sortedDates = Object.keys(dateMap).sort();
  const sampleRate = sortedDates.length > 180 ? 3 : sortedDates.length > 90 ? 2 : 1;
  const sampledDates = sortedDates.filter((_, i) => i % sampleRate === 0 || i === sortedDates.length - 1);

  // Build curve data
  return sampledDates.map((date) => {
    const point: any = { date };
    let total = 0;

    platforms.forEach((p) => {
      const equity = dateMap[date][p.id] || 0;
      point[p.slug] = equity;
      total += equity;
    });

    point.total = total;
    return point;
  });
}

function buildDrawdownCurve(snapshots: any[], platforms: Platform[]) {
  // Group snapshots by date and calculate total equity
  const dateMap: Record<string, number> = {};

  snapshots.forEach((s) => {
    if (!dateMap[s.date]) {
      dateMap[s.date] = 0;
    }
    dateMap[s.date] += s.equity;
  });

  // Get sorted dates
  const sortedDates = Object.keys(dateMap).sort();

  // Calculate running max and drawdown
  let runningMax = 0;
  const drawdownData: { date: string; drawdown: number }[] = [];

  sortedDates.forEach((date) => {
    const equity = dateMap[date];
    if (equity > runningMax) {
      runningMax = equity;
    }

    const drawdown = runningMax > 0 ? ((equity - runningMax) / runningMax) * 100 : 0;
    drawdownData.push({
      date,
      drawdown: parseFloat(drawdown.toFixed(2)),
    });
  });

  // Sample if too many points
  const sampleRate = drawdownData.length > 180 ? 3 : drawdownData.length > 90 ? 2 : 1;
  return drawdownData.filter((_, i) => i % sampleRate === 0 || i === drawdownData.length - 1);
}

function buildSparklineData(snapshots: any[], platforms: Platform[]) {
  const sparklines: Record<string, number[]> = {};

  // Initialize arrays for each platform
  platforms.forEach((p) => {
    sparklines[p.slug] = [];
  });

  // Group by date
  const dateMap: Record<string, Record<number, number>> = {};
  snapshots.forEach((s) => {
    if (!dateMap[s.date]) {
      dateMap[s.date] = {};
    }
    dateMap[s.date][s.platform_id] = s.equity;
  });

  // Build sparkline arrays (last 30 values per platform)
  const sortedDates = Object.keys(dateMap).sort();
  const last30Dates = sortedDates.slice(-30);

  last30Dates.forEach((date) => {
    platforms.forEach((p) => {
      const equity = dateMap[date][p.id] || 0;
      sparklines[p.slug].push(equity);
    });
  });

  return sparklines;
}

export const dynamic = 'force-dynamic';
