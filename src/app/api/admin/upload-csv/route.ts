/**
 * POST /api/admin/upload-csv
 * Admin endpoint to upload eToro CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/db/supabase';
import { parseEtoroCsv, csvRowToSnapshot } from '@/lib/services/etoro';
import { getPlatformBySlug, createSnapshot } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request);

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const csvContent = await file.text();

    // Parse CSV
    const parseResult = await parseEtoroCsv(csvContent);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'CSV validation failed',
          errors: parseResult.errors,
          summary: parseResult.summary,
        },
        { status: 400 }
      );
    }

    // Get eToro platform
    const etoroPlat = await getPlatformBySlug('etoro');

    if (!etoroPlat) {
      return NextResponse.json(
        { success: false, error: 'eToro platform not found in database' },
        { status: 500 }
      );
    }

    // Insert snapshots into database
    const insertedSnapshots = [];
    const errors = [];

    for (const row of parseResult.data) {
      try {
        const snapshotData = csvRowToSnapshot(row, etoroPlat.id);
        const snapshot = await createSnapshot(snapshotData);
        insertedSnapshots.push(snapshot);
      } catch (error) {
        errors.push({
          date: row.date,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        inserted: insertedSnapshots.length,
        failed: errors.length,
        snapshots: insertedSnapshots,
        errors,
      },
      summary: parseResult.summary,
    });
  } catch (error) {
    console.error('Error uploading CSV:', error);

    // Check if it's an auth error
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload CSV',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
