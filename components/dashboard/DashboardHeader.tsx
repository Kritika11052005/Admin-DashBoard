'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Search, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';

interface DashboardHeaderProps {
  userName?: string;
  onSearch?: (query: string) => void;
}

export default function DashboardHeader({ userName = 'Admin', onSearch }: DashboardHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 transition-colors">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className={`text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>AariyaTech Analytics</p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground w-64 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </form>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="relative p-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 group"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 rotate-0 scale-100 transition-all group-hover:rotate-90" />
              ) : (
                <Moon className="w-5 h-5 rotate-0 scale-100 transition-all group-hover:-rotate-12" />
              )}
            </button>

            {/* User Info */}
            <div className="text-right hidden sm:block">
              <p className="text-sm text-foreground font-medium">Welcome back,</p>
              <p className="text-xs text-primary">{userName}</p>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-card border-border text-foreground hover:bg-muted hover:border-primary transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}