/**
 * GET /api/cron/bitget
 * CRON job to sync Bitget data
 * Triggered daily by Vercel Cron
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateCronSecret } from '@/lib/utils/validators';
import { bitgetClient } from '@/lib/services/bitget';
import { getPlatformBySlug, createSnapshot } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    // Validate CRON secret
    const authHeader = request.headers.get('authorization');
    const secret = authHeader?.replace('Bearer ', '') || null;

    if (!validateCronSecret(secret)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get Bitget platform
    const bitgetPlatform = await getPlatformBySlug('bitget');

    if (!bitgetPlatform) {
      return NextResponse.json(
        { success: false, error: 'Bitget platform not found' },
        { status: 500 }
      );
    }

    // Sync data from Bitget
    const data = await bitgetClient.syncData();

    // Calculate derived fields
    const initialCapital = parseFloat(process.env.INITIAL_CAPITAL || '300');
    const totalPnlPercent = (data.total_pnl / initialCapital) * 100;
    const peakEquity = Math.max(data.equity, initialCapital);
    const drawdown = ((peakEquity - data.equity) / peakEquity) * 100;

    // Create snapshot
    const snapshot = await createSnapshot({
      platform_id: bitgetPlatform.id,
      date: data.date,
      equity: data.equity,
      daily_pnl: data.daily_pnl,
      total_pnl: data.total_pnl,
      total_pnl_percent: totalPnlPercent,
      peak_equity: peakEquity,
      drawdown: drawdown,
      copiers: data.copiers,
      aum: data.aum,
      source: 'api',
      notes: null,
      raw_data: data as any,
    });

    return NextResponse.json({
      success: true,
      message: 'Bitget data synced successfully',
      data: snapshot,
    });
  } catch (error) {
    console.error('Error syncing Bitget data:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync Bitget data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
