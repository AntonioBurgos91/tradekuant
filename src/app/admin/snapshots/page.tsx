'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Plus,
  Search,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Snapshot {
  id: number;
  platform_id: number;
  date: string;
  equity: number;
  daily_pnl: number;
  total_pnl_percent: number;
  copiers: number;
  aum: number;
  platform?: { name: string; slug: string };
}

export default function SnapshotsPage() {
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<number | null>(null);
  const limit = 20;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSnapshots();
    }
  }, [isAuthenticated, page, search]);

  const fetchSnapshots = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
      });
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/snapshots?${params}`);
      const data = await res.json();

      if (data.success) {
        setSnapshots(data.data || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching snapshots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este snapshot?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/snapshots?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        fetchSnapshots();
      } else {
        alert(data.error || 'Error al eliminar');
      }
    } catch (err) {
      alert('Error al eliminar el snapshot');
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (authLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const platformColors: Record<string, string> = {
    bitget: 'bg-green-500/10 text-green-500',
    darwinex: 'bg-orange-500/10 text-orange-500',
    etoro: 'bg-cyan-500/10 text-cyan-500',
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Snapshots</h1>
            <p className="text-sm text-muted-foreground">
              {total} snapshots en total
            </p>
          </div>
        </div>
        <Link href="/admin/snapshots/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Snapshot
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por fecha (YYYY-MM-DD)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left text-sm font-medium">Fecha</th>
                  <th className="p-4 text-left text-sm font-medium">Plataforma</th>
                  <th className="p-4 text-right text-sm font-medium">Equity</th>
                  <th className="p-4 text-right text-sm font-medium">PnL Diario</th>
                  <th className="p-4 text-right text-sm font-medium">PnL Total %</th>
                  <th className="p-4 text-right text-sm font-medium">Copiers</th>
                  <th className="p-4 text-right text-sm font-medium">AUM</th>
                  <th className="p-4 text-center text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </td>
                  </tr>
                ) : snapshots.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No se encontraron snapshots
                    </td>
                  </tr>
                ) : (
                  snapshots.map((snapshot) => (
                    <tr key={snapshot.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-mono text-sm">{snapshot.date}</td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={platformColors[snapshot.platform?.slug || ''] || ''}
                        >
                          {snapshot.platform?.name || `Platform ${snapshot.platform_id}`}
                        </Badge>
                      </td>
                      <td className="p-4 text-right font-mono">
                        ${snapshot.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`p-4 text-right font-mono ${snapshot.daily_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {snapshot.daily_pnl >= 0 ? '+' : ''}${snapshot.daily_pnl.toFixed(2)}
                      </td>
                      <td className={`p-4 text-right font-mono ${snapshot.total_pnl_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {snapshot.total_pnl_percent >= 0 ? '+' : ''}{snapshot.total_pnl_percent.toFixed(2)}%
                      </td>
                      <td className="p-4 text-right font-mono">{snapshot.copiers}</td>
                      <td className="p-4 text-right font-mono">
                        ${snapshot.aum.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(snapshot.id)}
                          disabled={deleting === snapshot.id}
                          className="text-destructive hover:text-destructive"
                        >
                          {deleting === snapshot.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
