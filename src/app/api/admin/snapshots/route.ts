/**
 * /api/admin/snapshots
 * Admin CRUD for snapshots
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/db/supabase';
import {
  createSnapshot,
  updateSnapshot,
  deleteSnapshot,
  getSnapshots,
} from '@/lib/db/queries';

// GET - List snapshots (admin view)
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const searchParams = request.nextUrl.searchParams;
    const platformId = searchParams.get('platformId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const search = searchParams.get('search');

    const params: any = {};
    if (platformId) params.platformId = parseInt(platformId);
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (limit) params.limit = parseInt(limit);
    if (offset) params.offset = parseInt(offset);
    if (search) params.search = search;

    const snapshots = await getSnapshots(params);

    // Get total count for pagination
    const totalResult = await getSnapshots({ ...params, limit: undefined, offset: undefined, countOnly: true });
    const total = Array.isArray(totalResult) ? totalResult.length : 0;

    return NextResponse.json({
      success: true,
      data: snapshots,
      total,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch snapshots' },
      { status: 500 }
    );
  }
}

// POST - Create new snapshot
export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();

    // Validate required fields
    if (!body.platform_id || !body.date || !body.equity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const snapshot = await createSnapshot(body);

    return NextResponse.json({
      success: true,
      data: snapshot,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create snapshot',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT - Update snapshot
export async function PUT(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Snapshot ID required' },
        { status: 400 }
      );
    }

    const { id, ...updates } = body;
    const snapshot = await updateSnapshot(id, updates);

    return NextResponse.json({
      success: true,
      data: snapshot,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update snapshot',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete snapshot
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth(request);

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Snapshot ID required' },
        { status: 400 }
      );
    }

    await deleteSnapshot(parseInt(id));

    return NextResponse.json({
      success: true,
      message: 'Snapshot deleted',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete snapshot',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
