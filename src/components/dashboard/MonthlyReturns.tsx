'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Snapshot } from '@/lib/db/types';
import { calculateMonthlyReturnsMap } from '@/lib/utils/metrics';
import { cn } from '@/lib/utils';

interface MonthlyReturnsProps {
  data: Snapshot[];
  title?: string;
  description?: string;
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function MonthlyReturns({
  data,
  title = 'Retornos Mensuales',
  description = 'Rendimiento mes a mes',
}: MonthlyReturnsProps) {
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

  const monthlyReturns = calculateMonthlyReturnsMap(data);

  // Group by year
  const yearlyData = new Map<string, Map<number, number>>();

  for (const [key, returnValue] of monthlyReturns.entries()) {
    const [year, month] = key.split('-');
    if (!yearlyData.has(year)) {
      yearlyData.set(year, new Map());
    }
    yearlyData.get(year)!.set(parseInt(month) - 1, returnValue);
  }

  const getColorClass = (value: number) => {
    if (value > 5) return 'bg-green-500/80 text-white';
    if (value > 2) return 'bg-green-500/50 text-white';
    if (value > 0) return 'bg-green-500/20';
    if (value === 0) return 'bg-muted';
    if (value > -2) return 'bg-red-500/20';
    if (value > -5) return 'bg-red-500/50 text-white';
    return 'bg-red-500/80 text-white';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left font-medium">Año</th>
                {MONTHS.map((month) => (
                  <th key={month} className="p-2 text-center font-medium">
                    {month}
                  </th>
                ))}
                <th className="p-2 text-center font-medium">YTD</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(yearlyData.entries())
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([year, months]) => {
                  const ytd = Array.from(months.values()).reduce(
                    (sum, val) => sum + val,
                    0
                  );

                  return (
                    <tr key={year} className="border-b">
                      <td className="p-2 font-medium">{year}</td>
                      {MONTHS.map((_, monthIndex) => {
                        const value = months.get(monthIndex);
                        return (
                          <td
                            key={monthIndex}
                            className={cn(
                              'p-2 text-center',
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
                          'p-2 text-center font-semibold',
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
      </CardContent>
    </Card>
  );
}
