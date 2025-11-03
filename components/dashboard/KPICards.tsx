// KPICards.tsx
'use client';

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
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 dark:text-zinc-400 text-sm font-medium mb-2">{title}</p>
            <p className="text-gray-900 dark:text-white text-3xl font-bold mb-1">{value}</p>
            <p className="text-gray-500 dark:text-zinc-500 text-xs">{trend}</p>
          </div>
          <div className={`${color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}