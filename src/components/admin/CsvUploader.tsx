'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CsvUploaderProps {
  onUploadComplete?: () => void;
}

export function CsvUploader({ onUploadComplete }: CsvUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      setError(null);
      setResult(null);
    } else {
      setError('Por favor, sube un archivo CSV válido');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setFile(null);
        onUploadComplete?.();
      } else {
        setError(data.error || 'Error al subir el archivo');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir CSV de eToro</CardTitle>
        <CardDescription>
          Arrastra un archivo CSV o haz click para seleccionarlo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className={cn('h-10 w-10', isDragging && 'text-primary')} />
            <p className="text-sm font-medium">
              {file ? file.name : 'Arrastra tu archivo CSV aquí'}
            </p>
            <p className="text-xs text-muted-foreground">
              o haz click para seleccionar
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" size="sm" asChild>
                <span>Seleccionar archivo</span>
              </Button>
            </label>
          </div>
        </div>

        {/* Upload Button */}
        {file && (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? 'Subiendo...' : 'Subir CSV'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setError(null);
                setResult(null);
              }}
            >
              Cancelar
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {result && result.success && (
          <div className="flex items-start gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-500">¡Éxito!</p>
              <p className="text-sm text-green-500/80">
                {result.data?.inserted} snapshots importados correctamente
              </p>
              {result.data?.failed > 0 && (
                <p className="text-sm text-yellow-500">
                  {result.data.failed} filas fallaron
                </p>
              )}
            </div>
          </div>
        )}

        {/* CSV Format Info */}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Formato del CSV</p>
              <p className="text-xs text-muted-foreground">
                Columnas requeridas: date, equity, daily_pnl, total_pnl
              </p>
              <p className="text-xs text-muted-foreground">
                Columnas opcionales: copiers, aum, notes
              </p>
              <p className="text-xs text-muted-foreground">
                Formato de fecha: YYYY-MM-DD
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
