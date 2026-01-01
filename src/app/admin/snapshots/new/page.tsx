'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Platform {
  id: number;
  name: string;
  slug: string;
}

export default function NewSnapshotPage() {
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    platform_id: '',
    date: new Date().toISOString().split('T')[0],
    equity: '',
    daily_pnl: '',
    total_pnl_percent: '',
    copiers: '0',
    aum: '0',
    notes: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const res = await fetch('/api/snapshots?platforms=true');
      const data = await res.json();
      if (data.success && data.platforms) {
        setPlatforms(data.platforms);
        if (data.platforms.length > 0) {
          setFormData(f => ({ ...f, platform_id: data.platforms[0].id.toString() }));
        }
      }
    } catch (err) {
      console.error('Error fetching platforms:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        platform_id: parseInt(formData.platform_id),
        date: formData.date,
        equity: parseFloat(formData.equity),
        daily_pnl: parseFloat(formData.daily_pnl) || 0,
        total_pnl_percent: parseFloat(formData.total_pnl_percent) || 0,
        copiers: parseInt(formData.copiers) || 0,
        aum: parseFloat(formData.aum) || 0,
        notes: formData.notes || null,
      };

      const res = await fetch('/api/admin/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/snapshots');
        }, 1500);
      } else {
        setError(data.error || 'Error al crear el snapshot');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

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

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/snapshots">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nuevo Snapshot</h1>
          <p className="text-sm text-muted-foreground">
            Añadir un snapshot manual
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Datos del Snapshot</CardTitle>
            <CardDescription>
              Ingresa los datos del snapshot que quieres añadir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform_id">Plataforma</Label>
                  <select
                    id="platform_id"
                    name="platform_id"
                    value={formData.platform_id}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  >
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="equity">Equity ($)</Label>
                  <Input
                    id="equity"
                    name="equity"
                    type="number"
                    step="0.01"
                    placeholder="10000.00"
                    value={formData.equity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="daily_pnl">PnL Diario ($)</Label>
                  <Input
                    id="daily_pnl"
                    name="daily_pnl"
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    value={formData.daily_pnl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="total_pnl_percent">PnL Total (%)</Label>
                  <Input
                    id="total_pnl_percent"
                    name="total_pnl_percent"
                    type="number"
                    step="0.01"
                    placeholder="25.50"
                    value={formData.total_pnl_percent}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="copiers">Copiadores</Label>
                  <Input
                    id="copiers"
                    name="copiers"
                    type="number"
                    placeholder="0"
                    value={formData.copiers}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aum">AUM ($)</Label>
                  <Input
                    id="aum"
                    name="aum"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={formData.aum}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="Notas adicionales..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <p className="text-sm text-green-500">
                    Snapshot creado correctamente. Redirigiendo...
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || success}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Guardando...' : 'Crear Snapshot'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ayuda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Equity</p>
              <p>El valor total de tu cuenta en la plataforma en USD.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">PnL Diario</p>
              <p>Ganancia o pérdida del día en USD. Puede ser negativo.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">PnL Total %</p>
              <p>Porcentaje de ganancia/pérdida acumulada desde el inicio.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Copiadores</p>
              <p>Número de personas que te copian (si aplica).</p>
            </div>
            <div>
              <p className="font-medium text-foreground">AUM</p>
              <p>Assets Under Management - Capital total gestionado incluyendo copiadores.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
