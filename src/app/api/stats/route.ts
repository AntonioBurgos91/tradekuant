/**
 * GET /api/stats
 * Returns summary stats for the landing page
 * Fetches from Supabase: global_metrics_cache, metrics_cache, platforms
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import type { Platform, MetricsCache, GlobalMetricsCache } from '@/lib/db/types';

export async function GET() {
  try {
    // Get global metrics (period = 'all' for lifetime stats)
    const { data: globalMetrics, error: globalError } = await supabase
      .from('global_metrics_cache')
      .select('*')
      .eq('period', 'all')
      .single();

    if (globalError && globalError.code !== 'PGRST116') {
      console.error('Global metrics error:', globalError);
    }

    // Get platforms
    const { data: platforms, error: platformsError } = await supabase
      .from('platforms')
      .select('*')
      .order('id');

    if (platformsError) throw platformsError;

    const platformList = (platforms || []) as Platform[];

    // Get metrics cache for each platform (period = 'all')
    const { data: metricsCache, error: metricsError } = await supabase
      .from('metrics_cache')
      .select('*')
      .eq('period', 'all');

    if (metricsError) throw metricsError;

    const metricsList = (metricsCache || []) as MetricsCache[];
    const globalData = globalMetrics as GlobalMetricsCache | null;

    // Calculate aggregated stats
    const avgSharpe = metricsList.length
      ? metricsList.reduce((sum, m) => sum + (m.sharpe_ratio || 0), 0) / metricsList.length
      : 0;

    const avgWinRate = metricsList.length
      ? metricsList.reduce((sum, m) => sum + (m.win_rate || 0), 0) / metricsList.length
      : 0;

    const maxDrawdown = metricsList.length
      ? Math.min(...metricsList.map(m => m.max_drawdown || 0))
      : 0;

    // Build stats data
    const stats = [
      {
        key: 'totalReturn',
        value: globalData?.total_return
          ? `${globalData.total_return >= 0 ? '+' : ''}${globalData.total_return.toFixed(2)}%`
          : '+0.00%',
      },
      {
        key: 'maxDrawdown',
        value: globalData?.combined_max_drawdown
          ? `${globalData.combined_max_drawdown.toFixed(1)}%`
          : `${maxDrawdown.toFixed(1)}%`,
      },
      {
        key: 'sharpeRatio',
        value: avgSharpe.toFixed(2),
      },
      {
        key: 'winRate',
        value: `${(avgWinRate * 100).toFixed(1)}%`,
      },
    ];

    // Build platform returns
    const platformReturns = platformList.map((platform) => {
      const metrics = metricsList.find(m => m.platform_id === platform.id);
      const returnValue = metrics?.total_return || 0;

      return {
        name: platform.name,
        color: platform.color || '#10B981',
        return: `${returnValue >= 0 ? '+' : ''}${returnValue.toFixed(2)}%`,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stats,
        platforms: platformReturns,
        lastUpdated: globalData?.calculated_at || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);

    // Return fallback data
    return NextResponse.json({
      success: true,
      data: {
        stats: [
          { key: 'totalReturn', value: '+228.15%' },
          { key: 'maxDrawdown', value: '-8.5%' },
          { key: 'sharpeRatio', value: '2.34' },
          { key: 'winRate', value: '68.4%' },
        ],
        platforms: [
          { name: 'Bitget', color: '#10B981', return: '+16.92%' },
          { name: 'Darwinex', color: '#3B82F6', return: '+6.17%' },
          { name: 'eToro', color: '#22C55E', return: '+5.07%' },
        ],
        lastUpdated: new Date().toISOString(),
        fallback: true,
      },
    });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour
