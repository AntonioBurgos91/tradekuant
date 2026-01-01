/**
 * GET /api/snapshots
 * Public endpoint to get trading snapshots
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSnapshots, getSnapshotsWithPlatform } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const platformId = searchParams.get('platformId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');
    const withPlatform = searchParams.get('withPlatform') === 'true';

    // Build query params
    const params: any = {};

    if (platformId) params.platformId = parseInt(platformId);
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (limit) params.limit = parseInt(limit);

    // Fetch snapshots
    const snapshots = withPlatform
      ? await getSnapshotsWithPlatform(params)
      : await getSnapshots(params);

    return NextResponse.json({
      success: true,
      data: snapshots,
      count: snapshots.length,
    });
  } catch (error) {
    console.error('Error fetching snapshots:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch snapshots',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes
