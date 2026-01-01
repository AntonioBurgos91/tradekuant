'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Save, Loader2 } from 'lucide-react';
import type { Snapshot } from '@/lib/db/types';

interface SnapshotFormProps {
  onSubmit?: (data: Partial<Snapshot>) => Promise<void>;
  initialData?: Partial<Snapshot>;
  mode?: 'create' | 'edit';
  trigger?: React.ReactNode;
}

const PLATFORMS = [
  { id: 1, name: 'Bitget', slug: 'bitget' },
  { id: 2, name: 'Darwinex', slug: 'darwinex' },
  { id: 3, name: 'eToro', slug: 'etoro' },
];

export function SnapshotForm({
  onSubmit,
  initialData,
  mode = 'create',
  trigger,
}: SnapshotFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Snapshot>>({
    platform_id: initialData?.platform_id || 1,
    date: initialData?.date || new Date().toISOString().split('T')[0],
    equity: initialData?.equity || 0,
    daily_pnl: initialData?.daily_pnl || 0,
    total_pnl: initialData?.total_pnl || 0,
    total_pnl_percent: initialData?.total_pnl_percent || 0,
    peak_equity: initialData?.peak_equity || null,
    drawdown: initialData?.drawdown || 0,
    copiers: initialData?.copiers || 0,
    aum: initialData?.aum || 0,
    source: 'manual',
    notes: initialData?.notes || '',
  });

  const handleChange = (field: keyof Snapshot, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Demo mode - simular guardado
        console.log('Snapshot data:', formData);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setOpen(false);
      // Reset form if creating
      if (mode === 'create') {
        setFormData({
          platform_id: 1,
          date: new Date().toISOString().split('T')[0],
          equity: 0,
          daily_pnl: 0,
          total_pnl: 0,
          total_pnl_percent: 0,
          peak_equity: null,
          drawdown: 0,
          copiers: 0,
          aum: 0,
          source: 'manual',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error saving snapshot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      {mode === 'create' ? 'Nuevo Snapshot' : 'Editar Snapshot'}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear Snapshot Manual' : 'Editar Snapshot'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Añade un snapshot manualmente para registrar métricas de trading.'
              : 'Modifica los datos del snapshot seleccionado.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Plataforma y Fecha */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Plataforma</Label>
                <select
                  id="platform"
                  value={formData.platform_id}
                  onChange={(e) => handleChange('platform_id', Number(e.target.value))}
                  className="w-full rounded-md border bg-background px-3 py-2"
                >
                  {PLATFORMS.map((p) => (
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
                  type="date"
                  value={formData.date?.split('T')[0]}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Métricas principales */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Métricas Principales</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equity">Equity ($)</Label>
                  <Input
                    id="equity"
                    type="number"
                    step="0.01"
                    value={formData.equity}
                    onChange={(e) => handleChange('equity', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daily_pnl">P&L Diario ($)</Label>
                  <Input
                    id="daily_pnl"
                    type="number"
                    step="0.01"
                    value={formData.daily_pnl}
                    onChange={(e) => handleChange('daily_pnl', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_pnl">P&L Total ($)</Label>
                  <Input
                    id="total_pnl"
                    type="number"
                    step="0.01"
                    value={formData.total_pnl}
                    onChange={(e) => handleChange('total_pnl', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_pnl_percent">P&L Total (%)</Label>
                  <Input
                    id="total_pnl_percent"
                    type="number"
                    step="0.01"
                    value={formData.total_pnl_percent}
                    onChange={(e) => handleChange('total_pnl_percent', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Drawdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Drawdown</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peak_equity">Peak Equity ($)</Label>
                  <Input
                    id="peak_equity"
                    type="number"
                    step="0.01"
                    value={formData.peak_equity || ''}
                    onChange={(e) =>
                      handleChange('peak_equity', e.target.value ? parseFloat(e.target.value) : null)
                    }
                    placeholder="Opcional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drawdown">Drawdown (%)</Label>
                  <Input
                    id="drawdown"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.drawdown}
                    onChange={(e) => handleChange('drawdown', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Copy Trading */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Copy Trading</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="copiers">Copiadores</Label>
                  <Input
                    id="copiers"
                    type="number"
                    min="0"
                    value={formData.copiers}
                    onChange={(e) => handleChange('copiers', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aum">AUM ($)</Label>
                  <Input
                    id="aum"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.aum}
                    onChange={(e) => handleChange('aum', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="min-h-[80px] w-full rounded-md border bg-background px-3 py-2"
                placeholder="Añade notas sobre este snapshot..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
