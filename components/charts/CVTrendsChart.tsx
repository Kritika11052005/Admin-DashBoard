'use client';
// CVTrendsChart.tsx
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

interface TrendData {
  date: string;
  count: number;
  avgScore: number;
}

interface TickProps {
  x?: number;
  y?: number;
  payload?: { value: string | number };
  isDark: boolean;
}

interface YAxisLabelProps {
  viewBox?: { x?: number; y?: number; width?: number; height?: number };
  isDark: boolean;
  label: string;
}

// Format date helper
const formatDate = (dateStr: string, format: 'short' | 'long' = 'short') => {
  try {
    const date = new Date(dateStr);
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
};

// Custom Y-axis label component
const CustomYAxisLabel = ({ viewBox, isDark, label }: YAxisLabelProps) => {
  const { x = 0, y = 0, height = 0 } = viewBox || {};
  const xPos = x + 7;
  const yPos = y + height / 2;
  return (
    <text
      x={xPos}
      y={yPos}
      fill={isDark ? '#ffffff' : '#111827'}
      transform={`rotate(-90, ${xPos}, ${yPos})`}
      textAnchor="middle"
      style={{ fontSize: '14px', fontWeight: 700 }}
    >
      {label}
    </text>
  );
};

// Custom tick component for X-axis
const CustomXTick = ({ x = 0, y = 0, payload, isDark }: TickProps) => {
  const displayValue = typeof payload?.value === 'string' 
    ? formatDate(payload.value, 'short')
    : payload?.value || '';
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill={isDark ? '#ffffff' : '#111827'}
        style={{ fontSize: '12px', fontWeight: 600 }}
      >
        {displayValue}
      </text>
    </g>
  );
};

// Custom tick component for Y-axis
const CustomYTick = ({ x = 0, y = 0, payload, isDark }: TickProps) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dx={-10}
        textAnchor="end"
        fill={isDark ? '#ffffff' : '#111827'}
        style={{ fontSize: '12px', fontWeight: 600 }}
      >
        {payload?.value}
      </text>
    </g>
  );
};

export default function CVTrendsChart() {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/analytics/cv-analysis');
      const result = await response.json();
      if (result.success) {
        setData(result.data.slice(-30));
      }
    } catch (error) {
      console.error('Failed to fetch CV trends:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} p-6 transition-colors`}>
        <div className="animate-pulse">
          <div className={`h-6 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'} rounded w-1/3 mb-4`}></div>
          <div className={`h-64 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'} rounded`}></div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} p-6 hover:border-yellow-400/50 transition-all`}>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>CV Analysis Trends</h3>
        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-sm mb-6`}>Last 30 days activity</p>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 20, right: 30, bottom: 60, left: 80 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#71717a' : '#e5e7eb'}
              strokeWidth={1}
            />
            <XAxis 
              dataKey="date"
              stroke={isDark ? '#ffffff' : '#6b7280'}
              strokeWidth={2}
              tick={<CustomXTick isDark={isDark} />}
              height={60}
              tickLine={{ stroke: isDark ? '#ffffff' : '#6b7280', strokeWidth: 2 }}
            />
            <YAxis
              stroke={isDark ? '#ffffff' : '#6b7280'}
              strokeWidth={2}
              tick={<CustomYTick isDark={isDark} />}
              tickLine={{ stroke: isDark ? '#ffffff' : '#6b7280', strokeWidth: 2 }}
              width={70}
              label={<CustomYAxisLabel isDark={isDark} label="Count / Score" />}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                border: `2px solid ${isDark ? '#facc15' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDark ? '#fff' : '#000',
              }}
              labelStyle={{
                color: isDark ? '#ffffff' : '#000000',
                fontWeight: 700
              }}
              itemStyle={{
                color: isDark ? '#ffffff' : '#000000',
              }}
              labelFormatter={(value) => formatDate(value as string, 'long')}
            />
            <Legend
              wrapperStyle={{
                color: isDark ? '#ffffff' : '#111827',
                fontWeight: 600
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#facc15" 
              strokeWidth={3}
              dot={{ fill: '#facc15', r: 4 }}
              name="Analyses Count"
            />
            <Line 
              type="monotone" 
              dataKey="avgScore" 
              stroke="#a855f7" 
              strokeWidth={3}
              dot={{ fill: '#a855f7', r: 4 }}
              name="Avg Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}