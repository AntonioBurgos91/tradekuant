'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils/formatters';
import type { Trade, Platform } from '@/lib/db/types';

// Datos de ejemplo para el modo borrador
const MOCK_TRADES: (Trade & { platform?: Platform })[] = [
  {
    id: 1,
    platform_id: 1,
    external_id: 'TRD-001',
    symbol: 'BTC/USDT',
    side: 'long',
    entry_price: 42150.50,
    exit_price: 43280.00,
    quantity: 0.5,
    leverage: 10,
    pnl: 564.75,
    pnl_percent: 2.68,
    fees: 12.50,
    status: 'closed',
    opened_at: '2024-01-15T10:30:00Z',
    closed_at: '2024-01-15T14:45:00Z',
    notes: null,
    tags: ['scalp', 'btc'],
    raw_data: null,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T14:45:00Z',
    platform: { id: 1, slug: 'bitget', name: 'Bitget', api_enabled: true, profile_url: null, color: '#00D4AA', created_at: '' },
  },
  {
    id: 2,
    platform_id: 1,
    external_id: 'TRD-002',
    symbol: 'ETH/USDT',
    side: 'short',
    entry_price: 2580.00,
    exit_price: 2520.00,
    quantity: 2,
    leverage: 5,
    pnl: 120.00,
    pnl_percent: 2.33,
    fees: 8.20,
    status: 'closed',
    opened_at: '2024-01-16T08:00:00Z',
    closed_at: '2024-01-16T12:30:00Z',
    notes: 'Resistencia en 2600',
    tags: ['swing', 'eth'],
    raw_data: null,
    created_at: '2024-01-16T08:00:00Z',
    updated_at: '2024-01-16T12:30:00Z',
    platform: { id: 1, slug: 'bitget', name: 'Bitget', api_enabled: true, profile_url: null, color: '#00D4AA', created_at: '' },
  },
  {
    id: 3,
    platform_id: 2,
    external_id: 'DWX-001',
    symbol: 'EUR/USD',
    side: 'long',
    entry_price: 1.0850,
    exit_price: 1.0795,
    quantity: 10000,
    leverage: 30,
    pnl: -55.00,
    pnl_percent: -0.51,
    fees: 2.50,
    status: 'closed',
    opened_at: '2024-01-17T09:15:00Z',
    closed_at: '2024-01-17T16:00:00Z',
    notes: null,
    tags: ['forex'],
    raw_data: null,
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T16:00:00Z',
    platform: { id: 2, slug: 'darwinex', name: 'Darwinex', api_enabled: true, profile_url: null, color: '#6366F1', created_at: '' },
  },
  {
    id: 4,
    platform_id: 1,
    external_id: 'TRD-003',
    symbol: 'SOL/USDT',
    side: 'long',
    entry_price: 98.50,
    exit_price: null,
    quantity: 10,
    leverage: 3,
    pnl: null,
    pnl_percent: null,
    fees: 0,
    status: 'open',
    opened_at: '2024-01-18T11:00:00Z',
    closed_at: null,
    notes: 'Target: $110',
    tags: ['swing', 'sol'],
    raw_data: null,
    created_at: '2024-01-18T11:00:00Z',
    updated_at: '2024-01-18T11:00:00Z',
    platform: { id: 1, slug: 'bitget', name: 'Bitget', api_enabled: true, profile_url: null, color: '#00D4AA', created_at: '' },
  },
  {
    id: 5,
    platform_id: 3,
    external_id: 'ETORO-001',
    symbol: 'AAPL',
    side: 'long',
    entry_price: 185.50,
    exit_price: 192.30,
    quantity: 20,
    leverage: 1,
    pnl: 136.00,
    pnl_percent: 3.67,
    fees: 0,
    status: 'closed',
    opened_at: '2024-01-10T14:30:00Z',
    closed_at: '2024-01-15T20:00:00Z',
    notes: null,
    tags: ['stocks', 'tech'],
    raw_data: null,
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-15T20:00:00Z',
    platform: { id: 3, slug: 'etoro', name: 'eToro', api_enabled: false, profile_url: null, color: '#69C9A0', created_at: '' },
  },
];

interface TradeHistoryProps {
  trades?: Trade[];
  showPlatform?: boolean;
  itemsPerPage?: number;
}

export function TradeHistory({
  trades = MOCK_TRADES,
  showPlatform = true,
  itemsPerPage = 10,
}: TradeHistoryProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');

  // Filtrar trades
  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      trade.symbol.toLowerCase().includes(search.toLowerCase()) ||
      trade.external_id?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trade.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTrades = filteredTrades.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Historial de Operaciones</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar símbolo..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 w-[200px]"
              />
            </div>
            <div className="flex items-center gap-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'all' | 'open' | 'closed');
                  setCurrentPage(1);
                }}
                className="rounded-md border bg-background px-2 py-1 text-sm"
              >
                <option value="all">Todas</option>
                <option value="open">Abiertas</option>
                <option value="closed">Cerradas</option>
              </select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {showPlatform && <TableHead>Plataforma</TableHead>}
                <TableHead>Símbolo</TableHead>
                <TableHead>Lado</TableHead>
                <TableHead className="text-right">Entrada</TableHead>
                <TableHead className="text-right">Salida</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Apalancamiento</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTrades.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={showPlatform ? 10 : 9}
                    className="text-center text-muted-foreground"
                  >
                    No se encontraron operaciones
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    {showPlatform && (
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: (trade as Trade & { platform?: Platform }).platform?.color || undefined,
                            color: (trade as Trade & { platform?: Platform }).platform?.color || undefined,
                          }}
                        >
                          {(trade as Trade & { platform?: Platform }).platform?.name || `Platform ${trade.platform_id}`}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {trade.side === 'long' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <span className={trade.side === 'long' ? 'text-green-500' : 'text-red-500'}>
                          {trade.side === 'long' ? 'Long' : 'Short'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(trade.entry_price)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {trade.exit_price ? formatCurrency(trade.exit_price) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {trade.quantity}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {trade.leverage}x
                    </TableCell>
                    <TableCell className="text-right">
                      {trade.pnl !== null ? (
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-mono font-medium ${
                              trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {trade.pnl_percent !== null && formatPercent(trade.pnl_percent / 100)}
                          </span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={trade.status === 'open' ? 'default' : 'secondary'}
                      >
                        {trade.status === 'open' ? 'Abierta' : 'Cerrada'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(new Date(trade.opened_at))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTrades.length)} de{' '}
              {filteredTrades.length} operaciones
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
