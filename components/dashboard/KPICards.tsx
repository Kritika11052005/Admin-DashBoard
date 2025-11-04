'use client';
// KPICards.tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend: string;
  index: number;
}

export function KPICard({ title, value, icon: Icon, color, trend, index }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 p-6 hover:border-yellow-400 transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-gray-600 dark:text-zinc-400 text-sm font-medium leading-tight">{title}</p>
            <p className="text-gray-900 dark:text-white text-xl sm:text-2xl font-bold leading-tight">
              {value}
            </p>
            <p className="text-gray-500 dark:text-zinc-500 text-xs leading-tight">
              {trend}
            </p>
          </div>
          <div className={`${color} p-2.5 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}