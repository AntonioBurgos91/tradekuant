/**
 * Reusable database queries
 * Centralized data access layer
 */

import { supabase, supabaseAdmin } from './supabase';
import type {
  Platform,
  Snapshot,
  Trade,
  MetricsCache,
  GlobalMetricsCache,
  SnapshotWithPlatform,
  Database,
} from './types';

// =============================================
// PLATFORMS
// =============================================

export async function getPlatforms(): Promise<Platform[]> {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .order('id');

  if (error) throw error;
  return data || [];
}

export async function getPlatformBySlug(
  slug: string
): Promise<Platform | null> {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }

  return data;
}

// =============================================
// SNAPSHOTS
// =============================================

export async function getSnapshots(params?: {
  platformId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<Snapshot[]> {
  let query = supabase.from('snapshots').select('*');

  if (params?.platformId) {
    query = query.eq('platform_id', params.platformId);
  }

  if (params?.startDate) {
    query = query.gte('date', params.startDate);
  }

  if (params?.endDate) {
    query = query.lte('date', params.endDate);
  }

  query = query.order('date', { ascending: false });

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getSnapshotsWithPlatform(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<SnapshotWithPlatform[]> {
  let query = supabase
    .from('snapshots')
    .select('*, platform:platforms(*)');

  if (params?.startDate) {
    query = query.gte('date', params.startDate);
  }

  if (params?.endDate) {
    query = query.lte('date', params.endDate);
  }

  query = query.order('date', { ascending: false });

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as unknown as SnapshotWithPlatform[];
}

export async function getLatestSnapshot(
  platformId: number
): Promise<Snapshot | null> {
  const { data, error } = await supabase
    .from('snapshots')
    .select('*')
    .eq('platform_id', platformId)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function createSnapshot(
  snapshot: any
): Promise<Snapshot> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await (supabaseAdmin as any)
    .from('snapshots')
    .insert(snapshot)
    .select()
    .single();

  if (error) throw error;
  return data as Snapshot;
}

export async function updateSnapshot(
  id: number,
  updates: any
): Promise<Snapshot> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await (supabaseAdmin as any)
    .from('snapshots')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Snapshot;
}

export async function deleteSnapshot(id: number): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { error } = await supabaseAdmin.from('snapshots').delete().eq('id', id);

  if (error) throw error;
}

// =============================================
// TRADES
// =============================================

export async function getTrades(params?: {
  platformId?: number;
  status?: 'open' | 'closed' | 'cancelled';
  limit?: number;
}): Promise<Trade[]> {
  let query = supabase.from('trades').select('*');

  if (params?.platformId) {
    query = query.eq('platform_id', params.platformId);
  }

  if (params?.status) {
    query = query.eq('status', params.status);
  }

  query = query.order('opened_at', { ascending: false });

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function createTrade(
  trade: any
): Promise<Trade> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await (supabaseAdmin as any)
    .from('trades')
    .insert(trade)
    .select()
    .single();

  if (error) throw error;
  return data as Trade;
}

// =============================================
// METRICS CACHE
// =============================================

export async function getMetricsCache(
  platformId: number,
  period: string
): Promise<MetricsCache | null> {
  const { data, error } = await supabase
    .from('metrics_cache')
    .select('*')
    .eq('platform_id', platformId)
    .eq('period', period)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function getAllMetricsCache(
  platformId?: number
): Promise<MetricsCache[]> {
  let query = supabase.from('metrics_cache').select('*');

  if (platformId) {
    query = query.eq('platform_id', platformId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function upsertMetricsCache(
  metrics: any
): Promise<MetricsCache> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await (supabaseAdmin as any)
    .from('metrics_cache')
    .upsert(metrics, {
      onConflict: 'platform_id,period',
    })
    .select()
    .single();

  if (error) throw error;
  return data as MetricsCache;
}

export async function getGlobalMetricsCache(
  period: string
): Promise<GlobalMetricsCache | null> {
  const { data, error } = await supabase
    .from('global_metrics_cache')
    .select('*')
    .eq('period', period)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function upsertGlobalMetricsCache(
  metrics: any
): Promise<GlobalMetricsCache> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await (supabaseAdmin as any)
    .from('global_metrics_cache')
    .upsert(metrics, {
      onConflict: 'period',
    })
    .select()
    .single();

  if (error) throw error;
  return data as GlobalMetricsCache;
}
