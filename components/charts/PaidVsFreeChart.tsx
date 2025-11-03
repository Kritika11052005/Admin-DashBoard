'use client';

import { useEffect, useState, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

interface UserTypeData {
  type: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

const COLORS = ['#facc15', '#3b82f6'];

export default function PaidVsFreeChart() {
  const [data, setData] = useState<UserTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/analytics/paid-vs-free');
      const result = await response.json();
      if (result.success) {
        setData(result.data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch paid vs free data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Custom label for pie chart
  const renderCustomLabel = (props: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    outerRadius?: number;
    index?: number;
  }) => {
    const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, index = 0 } = props;
    
    const dataItem = data[index];
    if (!dataItem) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={isDark ? '#ffffff' : '#000000'}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="500"
      >
        {`${dataItem.type}: ${dataItem.percentage}%`}
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} p-6 hover:border-yellow-400/50 transition-all`}>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Paid vs Free Users</h3>
        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-sm mb-6`}>User segmentation</p>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel as (props: unknown) => ReactNode}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                border: `1px solid ${isDark ? '#27272a' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDark ? '#fff' : '#000',
              }}
              labelStyle={{
                color: isDark ? '#ffffff' : '#000000',
              }}
              itemStyle={{
                color: isDark ? '#ffffff' : '#000000',
              }}
              formatter={(value: number) => {
                const item = data.find(d => d.count === value);
                return item ? `${value} users (${item.percentage}%)` : value;
              }}
            />
            <Legend 
              wrapperStyle={{ color: isDark ? '#a1a1aa' : '#6b7280' }} 
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {data.map((item, index) => (
            <div key={item.type} className={`${isDark ? 'bg-zinc-800' : 'bg-gray-50'} p-4 rounded-lg transition-colors`}>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index] }}
                />
                <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-sm`}>{item.type} Users</p>
              </div>
              <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>{item.count}</p>
              <p className={`${isDark ? 'text-zinc-500' : 'text-gray-500'} text-xs`}>{item.percentage}% of total</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}