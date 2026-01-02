'use client';

import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  showGradient?: boolean;
}

export function Sparkline({
  data,
  color = '#10B981',
  width = 100,
  height = 30,
  className,
  showGradient = false,
}: SparklineProps) {
  // Convert number array to chart data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((value, index) => ({ value, index }));
  }, [data]);

  // Determine if trend is positive (last value > first value)
  const isPositive = useMemo(() => {
    if (data.length < 2) return true;
    return data[data.length - 1] >= data[0];
  }, [data]);

  // Use trend-based color if not specified
  const lineColor = color || (isPositive ? '#10B981' : '#EF4444');

  if (chartData.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ width, height }}
      >
        <div className="h-[2px] w-full rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          {showGradient && (
            <defs>
              <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
            animationDuration={500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Alternative SVG-based sparkline for when Recharts overhead is not needed
export function SparklineSVG({
  data,
  color = '#10B981',
  width = 100,
  height = 30,
  className,
}: SparklineProps) {
  const path = useMemo(() => {
    if (!data || data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((value, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  // Determine if trend is positive
  const isPositive = useMemo(() => {
    if (data.length < 2) return true;
    return data[data.length - 1] >= data[0];
  }, [data]);

  const lineColor = color || (isPositive ? '#10B981' : '#EF4444');

  if (!data || data.length < 2) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ width, height }}
      >
        <div className="h-[2px] w-full rounded bg-muted" />
      </div>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={path}
        fill="none"
        stroke={lineColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
