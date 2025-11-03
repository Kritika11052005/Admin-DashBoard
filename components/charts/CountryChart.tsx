'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

interface CountryData {
    country: string;
    count: number;
    percentage: number;
}

// Gradient colors from bright yellow to dark brown
const getBarColor = (index: number, total: number) => {
    const colors = [
        '#facc15', // Bright yellow
        '#f59e0b', // Amber
        '#d97706', // Orange
        '#b45309', // Dark orange
        '#92400e', // Brown
        '#78350f', // Dark brown
        '#451a03', // Very dark brown
    ];
    return colors[Math.min(index, colors.length - 1)];
};

interface TickProps {
    x?: number;
    y?: number;
    payload?: { value: string | number };
    isDark: boolean;
}

interface YAxisLabelProps {
    viewBox?: { x?: number; y?: number; width?: number; height?: number };
    isDark: boolean;
}

// Custom Y-axis label component
const CustomYAxisLabel = ({ viewBox, isDark }: YAxisLabelProps) => {
    const { x = 0, y = 0, height = 0 } = viewBox || {};
    const xPos = x +7;
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
            Number of Users
        </text>
    );
};

// Custom tick component for better visibility
const CustomTick = ({ x = 0, y = 0, payload, isDark }: TickProps) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="end"
                fill={isDark ? '#ffffff' : '#111827'}
                transform="rotate(-45)"
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

export default function CountryDistributionChart() {
    const [data, setData] = useState<CountryData[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/analytics/users');
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch country distribution data:', error);
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
            transition={{ duration: 0.5, delay: 0.15 }}
        >
            <Card className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} p-6 hover:border-yellow-400/50 transition-all`}>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Country Distribution</h3>
                <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-sm mb-6`}>User base by location</p>

                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} margin={{ top: 20, right: 30, bottom: 100, left: 80 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? '#71717a' : '#e5e7eb'}
                            strokeWidth={1}
                        />
                        <XAxis
                            dataKey="country"
                            stroke={isDark ? '#ffffff' : '#6b7280'}
                            strokeWidth={2}
                            tick={<CustomTick isDark={isDark} />}
                            height={100}
                            interval={0}
                            tickLine={{ stroke: isDark ? '#ffffff' : '#6b7280', strokeWidth: 2 }}
                        />
                        <YAxis
                            stroke={isDark ? '#ffffff' : '#6b7280'}
                            strokeWidth={2}
                            tick={<CustomYTick isDark={isDark} />}
                            tickLine={{ stroke: isDark ? '#ffffff' : '#6b7280', strokeWidth: 2 }}
                            width={70}
                            label={<CustomYAxisLabel isDark={isDark} />}
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
                                props: { payload?: CountryData }
                            ) => {
                                const percentage = props.payload?.percentage ?? 0;
                                return [`${value} users (${percentage}%)`, 'Count'];
                            }}
                        />
                        <Bar
                            dataKey="count"
                            radius={[8, 8, 0, 0]}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getBarColor(index, data.length)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </motion.div>
    );
}