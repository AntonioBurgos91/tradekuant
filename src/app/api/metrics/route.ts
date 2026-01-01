/**
 * GET /api/metrics
 * Public endpoint to get calculated trading metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllMetricsCache,
  getMetricsCache,
  getGlobalMetricsCache,
} from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const platformId = searchParams.get('platformId');
    const period = searchParams.get('period') || 'all';
    const global = searchParams.get('global') === 'true';

    // Get global metrics (all platforms combined)
    if (global) {
      const metrics = await getGlobalMetricsCache(period);

      return NextResponse.json({
        success: true,
        data: metrics,
        period,
      });
    }

    // Get metrics for specific platform
    if (platformId) {
      const metrics = await getMetricsCache(parseInt(platformId), period);

      return NextResponse.json({
        success: true,
        data: metrics,
        platform_id: platformId,
        period,
      });
    }

    // Get all metrics for all platforms
    const allMetrics = await getAllMetricsCache();

    // Group by platform
    const byPlatform = allMetrics.reduce((acc, metric) => {
      if (!acc[metric.platform_id]) {
        acc[metric.platform_id] = {};
      }
      acc[metric.platform_id][metric.period] = metric;
      return acc;
    }, {} as Record<number, Record<string, any>>);

    return NextResponse.json({
      success: true,
      data: byPlatform,
      count: Object.keys(byPlatform).length,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour
