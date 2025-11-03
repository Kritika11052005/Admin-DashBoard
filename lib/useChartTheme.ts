'use client';

import { useTheme } from './ThemeContext';

// This hook provides consistent colors for your charts based on the current theme
export function useChartTheme() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return {
    // Use your existing chart color variables
    colors: {
      chart1: 'hsl(var(--chart-1))',
      chart2: 'hsl(var(--chart-2))',
      chart3: 'hsl(var(--chart-3))',
      chart4: 'hsl(var(--chart-4))',
      chart5: 'hsl(var(--chart-5))',
    },

    // Text colors for chart labels
    text: {
      primary: 'hsl(var(--foreground))',
      muted: 'hsl(var(--muted-foreground))',
    },

    // Tooltip styles for Recharts
    tooltipStyle: {
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },

    // Label style for Recharts tooltips
    labelStyle: {
      color: 'hsl(var(--foreground))',
      fontWeight: 500,
    },

    // Item style for Recharts tooltips
    itemStyle: {
      color: 'hsl(var(--muted-foreground))',
    },

    // Axis tick style
    axisTickStyle: {
      fill: 'hsl(var(--foreground))',
      fontSize: 12,
    },

    // Grid line style
    gridStrokeStyle: {
      stroke: 'hsl(var(--border))',
      strokeDasharray: '3 3',
    },
  };
}