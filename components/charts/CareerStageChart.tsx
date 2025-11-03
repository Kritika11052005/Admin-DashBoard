'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

interface CareerStageData {
  stage: string;
  count: number;
  percentage: number;
}

interface CustomLabelProps {
  x?: string | number;
  y?: string | number;
  width?: string | number;
  height?: string | number;
  value?: string | number;
  index?: number;
}

interface TickProps {
  x?: number;
  y?: number;
  payload?: { value: string | number };
  isDark: boolean;
}

interface XAxisLabelProps {
  viewBox?: { x?: number; y?: number; width?: number; height?: number };
  isDark: boolean;
}

const COLORS = {
  Fresher: '#facc15',
  Graduate: '#a855f7',
  Experienced: '#3b82f6',
};

export default function CareerStageChart() {
  const [data, setData] = useState<CareerStageData[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/analytics/career-stages');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch career stage data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Custom X-axis label component
  const CustomXAxisLabel = ({ viewBox, isDark }: XAxisLabelProps) => {
    const { x = 0, y = 0, width = 0 } = viewBox || {};
    const xPos = x + width / 2;
    const yPos = y + 35;
    return (
      <text
        x={xPos}
        y={yPos}
        fill={isDark ? '#ffffff' : '#111827'}
        textAnchor="middle"
        style={{ fontSize: '14px', fontWeight: 700 }}
      >
        Number of Users
      </text>
    );
  };

  // Custom tick components
  const CustomXTick = ({ x = 0, y = 0, payload, isDark }: TickProps) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={5}
          textAnchor="middle"
          fill={isDark ? '#ffffff' : '#111827'}
          style={{ fontSize: '12px', fontWeight: 600 }}
        >
          {payload?.value}
        </text>
      </g>
    );
  };

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

  // Custom label component for bars
  const renderCustomLabel = (props: CustomLabelProps) => {
    const { x = 0, y = 0, width = 0, height = 0, value = 0, index = 0 } = props;
    
    // Convert to numbers if they're strings
    const xNum = typeof x === 'string' ? parseFloat(x) : x;
    const yNum = typeof y === 'string' ? parseFloat(y) : y;
    const widthNum = typeof width === 'string' ? parseFloat(width) : width;
    const heightNum = typeof height === 'string' ? parseFloat(height) : height;
    const valueNum = typeof value === 'string' ? parseFloat(value) : value;
    
    // Get the data item by index
    const dataItem = data[index];
    if (!dataItem) return null;
    
    const percentage = dataItem.percentage;
    
    // Only show label if there's enough space
    if (widthNum < 30) return null;
    
    return (
      <text
        x={xNum + widthNum / 2}
        y={yNum + heightNum / 2}
        fill={isDark ? '#ffffff' : '#000000'}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="600"
      >
        {`Count : ${valueNum} users (${percentage}%)`}
      </text>
    );
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
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} p-6 hover:border-yellow-400/50 transition-all`}>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Career Stage Breakdown</h3>
        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-sm mb-6`}>User distribution by experience</p>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ right: 150, left: 20, bottom: 50 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#71717a' : '#e5e7eb'}
              strokeWidth={1}
            />
            <XAxis 
              type="number" 
              stroke={isDark ? '#ffffff' : '#6b7280'}
              strokeWidth={2}
              tick={<CustomXTick isDark={isDark} />}
              tickLine={{ stroke: isDark ? '#ffffff' : '#6b7280', strokeWidth: 2 }}
              label={<CustomXAxisLabel isDark={isDark} />}
            />
            <YAxis 
              dataKey="stage" 
              type="category" 
              stroke={isDark ? '#ffffff' : '#6b7280'}
              strokeWidth={2}
              tick={<CustomYTick isDark={isDark} />}
              tickLine={{ stroke: isDark ? '#ffffff' : '#6b7280', strokeWidth: 2 }}
              width={100}
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
              formatter={(
                value: number,
                name: string,
                props: { payload?: CareerStageData }
              ) => {
                const percentage = props.payload?.percentage ?? 0;
                return [`${value} users (${percentage}%)`, 'Count'];
              }}
            />
            <Bar 
              dataKey="count" 
              radius={[0, 8, 8, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.stage as keyof typeof COLORS] || '#facc15'} 
                />
              ))}
              <LabelList dataKey="count" content={renderCustomLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}