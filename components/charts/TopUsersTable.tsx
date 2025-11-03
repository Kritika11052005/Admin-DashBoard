'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Crown, Medal, Award } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface TopUser {
  rank: number;
  name: string;
  email: string;
  cvScore: number;
  country: string;
  isPaid: boolean;
}

export default function TopUsersTable() {
  const [data, setData] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/analytics/top-users?limit=10');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch top users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400 dark:text-zinc-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className={`font-semibold ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>#{rank}</span>;
  };

  if (loading) {
    return (
      <Card className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} p-6 transition-colors`}>
        <div className="animate-pulse">
          <div className={`h-6 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'} rounded w-1/3 mb-4`}></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-16 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'} rounded`}></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} p-6 hover:border-yellow-400/50 transition-all`}>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Top CV Scores</h3>
        <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'} text-sm mb-6`}>Leaderboard of highest performers</p>
        
        <div className="space-y-3">
          {data.map((user, index) => (
            <motion.div
              key={user.email}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-center gap-4 ${isDark ? 'bg-zinc-800 hover:bg-zinc-750' : 'bg-gray-50 hover:bg-gray-100'} p-4 rounded-lg transition-colors`}
            >
              <div className="flex items-center justify-center w-10">
                {getRankIcon(user.rank)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium truncate`}>{user.name}</p>
                  {user.isPaid && (
                    <Badge className="bg-yellow-400 text-black text-xs">PRO</Badge>
                  )}
                </div>
                <p className={`${isDark ? 'text-zinc-500' : 'text-gray-500'} text-sm truncate`}>{user.email}</p>
              </div>
              
              <div className="text-right">
                <p className="text-yellow-400 text-xl font-bold">{user.cvScore}</p>
                <p className={`${isDark ? 'text-zinc-500' : 'text-gray-500'} text-xs`}>{user.country}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}