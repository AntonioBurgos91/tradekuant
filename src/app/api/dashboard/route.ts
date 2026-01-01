/**
 * GET /api/dashboard
 * Aggregated dashboard data endpoint
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import type { Platform, Snapshot, MetricsCache, GlobalMetricsCache } from '@/lib/db/types';

export async function GET() {
  try {
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

    // Get metrics cache for each platform (period: all)
    const { data: metricsCache, error: metricsError } = await supabase
      .from('metrics_cache')
      .select('*')
      .eq('period', 'all');

    if (metricsError) throw metricsError;

    const metricsList = (metricsCache || []) as MetricsCache[];

    // Get global metrics
    const { data: globalMetrics, error: globalError } = await supabase
      .from('global_metrics_cache')
      .select('*')
      .eq('period', 'all')
      .single();

    if (globalError && globalError.code !== 'PGRST116') throw globalError;

    const globalData = globalMetrics as GlobalMetricsCache | null;

    // Get snapshots for charts (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const { data: chartSnapshots, error: chartError } = await supabase
      .from('snapshots')
      .select('date, equity, total_pnl_percent, platform_id')
      .gte('date', twelveMonthsAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (chartError) throw chartError;

    // Calculate monthly returns
    const monthlyReturns = calculateMonthlyReturns(chartSnapshots || []);

    // Build equity curve data (sample every 7 days for performance)
    const equityCurve = buildEquityCurve(chartSnapshots || [], platformList);

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

    return NextResponse.json({
      success: true,
      data: {
        global: {
          totalEquity,
          totalReturn: globalData?.total_return || 0,
          maxDrawdown: globalData?.combined_max_drawdown || 0,
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

function calculateMonthlyReturns(snapshots: any[]) {
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

  // Calculate returns for last 12 months
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const now = new Date();
  const results: { month: string; value: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthName = months[d.getMonth()];
    const data = monthlyData[monthKey];

    let value = 0;
    if (data && data.start > 0) {
      value = ((data.end - data.start) / data.start) * 100;
    }

    results.push({ month: monthName, value: parseFloat(value.toFixed(1)) });
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

  // Get sorted dates (sample every 3 days for performance)
  const sortedDates = Object.keys(dateMap).sort();
  const sampledDates = sortedDates.filter((_, i) => i % 3 === 0 || i === sortedDates.length - 1);

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

export const dynamic = 'force-dynamic';
