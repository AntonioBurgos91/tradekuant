'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  Upload,
  Database,
  LogOut,
  Loader2,
  Plus,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/snapshots?limit=1');
      const data = await res.json();
      if (data.success) {
        setStats({ totalSnapshots: data.total || 0 });
      }
    } catch {
      // Ignore stats errors
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">
              Bienvenido, {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-primary/50 text-primary">
              <Lock className="h-3 w-3" />
              <span>Autenticado</span>
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSnapshots}</p>
                <p className="text-sm text-muted-foreground">Total Snapshots</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Plataformas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <RefreshCw className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Auto</p>
                <p className="text-sm text-muted-foreground">CRON activo</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Acciones Rápidas */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Subir CSV</CardTitle>
              <CardDescription>
                Importar datos de eToro desde archivo CSV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/upload">
                <Button className="w-full">
                  Subir Archivo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Gestionar Snapshots</CardTitle>
              <CardDescription>
                Ver, editar y eliminar snapshots de trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/snapshots">
                <Button variant="outline" className="w-full">
                  Ver Snapshots
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Nuevo Snapshot</CardTitle>
              <CardDescription>
                Añadir un snapshot manual de cualquier plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/snapshots/new">
                <Button variant="outline" className="w-full">
                  Crear Snapshot
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ejecutar CRON manualmente</CardTitle>
          <CardDescription>
            Sincronizar datos de las plataformas ahora
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetch('/api/cron/bitget').then(() => alert('Bitget sync triggered'))}
          >
            Sync Bitget
          </Button>
          <Button
            variant="outline"
            onClick={() => fetch('/api/cron/darwinex').then(() => alert('Darwinex sync triggered'))}
          >
            Sync Darwinex
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
