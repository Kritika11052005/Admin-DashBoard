'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/ThemeContext';

interface SidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export default function Sidebar({ activePage = 'overview', onNavigate }: SidebarProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analyses', label: 'Analyses', icon: FileText },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleNavigation = (itemId: string) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  return (
    <>
      {/* Collapsed Sidebar - Icon Only */}
      {!isOpen && (
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`w-20 ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
          } border-r min-h-screen p-4 hidden lg:flex flex-col transition-colors`}
        >
          {/* Toggle Button */}
          <button
          aria-label="setOpenSidebar"
            onClick={() => setIsOpen(true)}
            className={`w-full flex items-center justify-center p-3 rounded-lg mb-8 transition-all ${
              isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Menu Items - Icons Only */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  title={item.label}
                  className={`w-full flex items-center justify-center p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-yellow-400 text-black shadow-lg'
                      : isDark
                      ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Logout"
            className={`w-full flex items-center justify-center p-3 rounded-lg transition-all mt-4 ${
              isDark
                ? 'text-red-400 hover:bg-red-900/20'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </motion.aside>
      )}

      {/* Expanded Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`w-64 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            } border-r min-h-screen p-4 hidden lg:flex flex-col transition-colors`}
          >
            {/* Header with Toggle */}
            <div className="flex items-center justify-between mb-8 px-4">
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">AariyaTech</h2>
                <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                  Analytics Dashboard
                </p>
              </div>
              <button
              aria-label="sidebarclose"
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-yellow-400 text-black shadow-lg'
                        : isDark
                        ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mt-4 ${
                isDark
                  ? 'text-red-400 hover:bg-red-900/20'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}