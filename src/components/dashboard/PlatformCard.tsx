'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import type { Platform } from '@/lib/db/types';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

interface PlatformCardProps {
  platform: Platform;
  equity?: number;
  returnPercent?: number;
  copiers?: number;
  aum?: number;
}

export function PlatformCard({
  platform,
  equity,
  returnPercent,
  copiers,
  aum,
}: PlatformCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{platform.name}</CardTitle>
            {platform.api_enabled && (
              <Badge variant="outline" className="text-xs">
                Auto
              </Badge>
            )}
          </div>
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: platform.color || '#6b7280' }}
          />
        </div>
        <CardDescription>
          {platform.slug === 'bitget' && 'Copy Trading'}
          {platform.slug === 'darwinex' && 'Darwin Trader'}
          {platform.slug === 'etoro' && 'Popular Investor'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Equity */}
          {equity !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Equity</span>
              <span className="font-semibold">{formatCurrency(equity)}</span>
            </div>
          )}

          {/* Return */}
          {returnPercent !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Return</span>
              <span
                className={`font-semibold ${
                  returnPercent > 0 ? 'text-green-500' : returnPercent < 0 ? 'text-red-500' : ''
                }`}
              >
                {formatPercent(returnPercent, 2, true)}
              </span>
            </div>
          )}

          {/* Copiers/Investors */}
          {copiers !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {platform.slug === 'darwinex' ? 'Inversores' : 'Copiadores'}
              </span>
              <span className="font-semibold">{copiers}</span>
            </div>
          )}

          {/* AUM */}
          {aum !== undefined && aum > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">AUM</span>
              <span className="font-semibold">{formatCurrency(aum)}</span>
            </div>
          )}

          {/* Profile Link */}
          {platform.profile_url && (
            <div className="pt-2">
              <a
                href={platform.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Ver perfil
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
