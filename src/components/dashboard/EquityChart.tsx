'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Snapshot } from '@/lib/db/types';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { PLATFORM_COLORS } from '@/lib/constants';

interface EquityChartProps {
  data: Snapshot[];
  title?: string;
  description?: string;
}

export function EquityChart({
  data,
  title = 'Equity Curve',
  description = 'Evolución del capital en el tiempo',
}: EquityChartProps) {
  // Group data by platform and date
  const chartData = data.reduce((acc, snapshot) => {
    const date = formatDate(snapshot.date, 'dd/MM');
    const existing = acc.find(item => item.date === date);

    if (existing) {
      existing[`platform_${snapshot.platform_id}`] = snapshot.equity;
    } else {
      acc.push({
        date,
        fullDate: snapshot.date,
        [`platform_${snapshot.platform_id}`]: snapshot.equity,
      });
    }

    return acc;
  }, [] as any[]);

  // Get unique platform IDs
  const platformIds = [...new Set(data.map(s => s.platform_id))];

  // Colors for each platform
  const colors = ['#00C896', '#1E3A5F', '#69C53E'];

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [formatCurrency(value), 'Equity']}
            />
            <Legend />
            {platformIds.map((platformId, index) => (
              <Line
                key={platformId}
                type="monotone"
                dataKey={`platform_${platformId}`}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                name={`Platform ${platformId}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
