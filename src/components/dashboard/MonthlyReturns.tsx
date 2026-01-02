'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Snapshot } from '@/lib/db/types';
import { calculateMonthlyReturnsMap } from '@/lib/utils/metrics';
import { cn } from '@/lib/utils';

interface MonthlyReturnsProps {
  data: Snapshot[];
  title?: string;
  description?: string;
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function MonthlyReturns({
  data,
  title = 'Retornos Mensuales',
  description = 'Rendimiento mes a mes',
}: MonthlyReturnsProps) {
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const { yearlyData, years } = useMemo(() => {
    if (data.length === 0) {
      return { yearlyData: new Map(), years: [] };
    }

    const monthlyReturns = calculateMonthlyReturnsMap(data);
    const yearlyDataMap = new Map<string, Map<number, number>>();

    for (const [key, returnValue] of monthlyReturns.entries()) {
      const [year, month] = key.split('-');
      if (!yearlyDataMap.has(year)) {
        yearlyDataMap.set(year, new Map());
      }
      yearlyDataMap.get(year)!.set(parseInt(month) - 1, returnValue);
    }

    const sortedYears = Array.from(yearlyDataMap.keys()).sort((a, b) => parseInt(b) - parseInt(a));

    return { yearlyData: yearlyDataMap, years: sortedYears };
  }, [data]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  const getColorClass = (value: number) => {
    if (value > 5) return 'bg-green-500/80 text-white';
    if (value > 2) return 'bg-green-500/50 text-white';
    if (value > 0) return 'bg-green-500/20 text-foreground';
    if (value === 0) return 'bg-muted text-muted-foreground';
    if (value > -2) return 'bg-red-500/20 text-foreground';
    if (value > -5) return 'bg-red-500/50 text-white';
    return 'bg-red-500/80 text-white';
  };

  const filteredYears = selectedYear === 'all' ? years : years.filter(y => y === selectedYear);

  const calculateYTD = (months: Map<number, number>) => {
    return Array.from(months.values()).reduce((sum, val) => sum + val, 0);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          {/* Year Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-1.5">
            <Button
              variant={selectedYear === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedYear('all')}
              className="h-8 px-3 text-xs font-medium"
            >
              All
            </Button>
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedYear(year)}
                className="h-8 px-3 text-xs font-medium"
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="flex justify-center">
            <div className="overflow-x-auto">
              <table className="text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left font-medium min-w-[60px]">Año</th>
                    {MONTHS.map((month) => (
                      <th key={month} className="p-2 text-center font-medium min-w-[55px]">
                        {month}
                      </th>
                    ))}
                    <th className="p-2 text-center font-medium min-w-[65px]">YTD</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredYears.map((year) => {
                    const months = yearlyData.get(year)!;
                    const ytd = calculateYTD(months);

                    return (
                      <tr key={year} className="border-b last:border-b-0">
                        <td className="p-2 font-semibold">{year}</td>
                        {MONTHS.map((_, monthIndex) => {
                          const value = months.get(monthIndex);
                          return (
                            <td
                              key={monthIndex}
                              className={cn(
                                'p-2 text-center transition-colors',
                                value !== undefined && getColorClass(value)
                              )}
                            >
                              {value !== undefined
                                ? `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
                                : '-'}
                            </td>
                          );
                        })}
                        <td
                          className={cn(
                            'p-2 text-center font-semibold transition-colors',
                            getColorClass(ytd)
                          )}
                        >
                          {ytd > 0 ? '+' : ''}
                          {ytd.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredYears.map((year) => {
            const months = yearlyData.get(year)!;
            const ytd = calculateYTD(months);

            return (
              <div key={year} className="rounded-lg border bg-card p-4">
                {/* Year Header with YTD */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <span className="text-lg font-bold">{year}</span>
                  <div className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-semibold',
                    getColorClass(ytd)
                  )}>
                    YTD: {ytd > 0 ? '+' : ''}{ytd.toFixed(1)}%
                  </div>
                </div>

                {/* Monthly Grid - 4 columns on mobile */}
                <div className="grid grid-cols-4 gap-2">
                  {MONTHS_FULL.map((monthFull, monthIndex) => {
                    const value = months.get(monthIndex);
                    return (
                      <div
                        key={monthIndex}
                        className={cn(
                          'flex flex-col items-center justify-center p-2 rounded-lg text-center transition-colors',
                          value !== undefined ? getColorClass(value) : 'bg-muted/50'
                        )}
                      >
                        <span className="text-[10px] uppercase tracking-wide opacity-80 mb-0.5">
                          {MONTHS[monthIndex]}
                        </span>
                        <span className="text-xs font-semibold">
                          {value !== undefined
                            ? `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
                            : '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-green-500/80" />
            <span>&gt;5%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-green-500/50" />
            <span>2-5%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-green-500/20" />
            <span>0-2%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-red-500/20" />
            <span>0 a -2%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-red-500/50" />
            <span>-2 a -5%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-red-500/80" />
            <span>&lt;-5%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
