'use client';

import { useTheme } from '@/lib/ThemeContext';
import { Loader2, Brain } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'brain';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loader({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  className = '',
}: LoaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  };

  const containerClass = fullScreen
    ? `fixed inset-0 z-50 flex flex-col items-center justify-center ${
        isDark ? 'bg-zinc-900/80' : 'bg-white/80'
      } backdrop-blur-sm`
    : `flex flex-col items-center justify-center ${className}`;

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2
            className={`${sizeClasses[size]} ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            } animate-spin`}
          />
        );

      case 'dots':
        return (
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${dotSizeClasses[size]} rounded-full ${
                  isDark ? 'bg-purple-400' : 'bg-purple-600'
                } animate-bounce`}
                style={{
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className="relative">
            <div
              className={`${sizeClasses[size]} rounded-full ${
                isDark ? 'bg-purple-400' : 'bg-purple-600'
              } animate-ping absolute`}
            />
            <div
              className={`${sizeClasses[size]} rounded-full ${
                isDark ? 'bg-purple-500' : 'bg-purple-700'
              } relative`}
            />
          </div>
        );

      case 'brain':
        return (
          <div className="relative">
            <Brain
              className={`${sizeClasses[size]} ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              } animate-pulse`}
            />
            <div
              className={`absolute inset-0 ${sizeClasses[size]} ${
                isDark ? 'bg-purple-400/20' : 'bg-purple-600/20'
              } rounded-full animate-ping`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={containerClass}>
      {renderLoader()}
      {text && (
        <p
          className={`mt-4 text-sm font-medium ${
            isDark ? 'text-zinc-300' : 'text-gray-700'
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

// Loading Skeleton Component
export function LoadingSkeleton({
  rows = 3,
  className = '',
}: {
  rows?: number;
  className?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`h-4 ${
            isDark ? 'bg-zinc-800' : 'bg-gray-200'
          } rounded animate-pulse`}
          style={{ width: i === 0 ? '90%' : i === 1 ? '75%' : '85%' }}
        />
      ))}
    </div>
  );
}

// Card Loading Skeleton
export function CardSkeleton({ className = '' }: { className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
      } border rounded-lg p-6 ${className}`}
    >
      <div className="animate-pulse space-y-4">
        <div
          className={`h-6 ${
            isDark ? 'bg-zinc-800' : 'bg-gray-200'
          } rounded w-1/3`}
        />
        <div
          className={`h-4 ${
            isDark ? 'bg-zinc-800' : 'bg-gray-200'
          } rounded w-2/3`}
        />
        <div
          className={`h-32 ${
            isDark ? 'bg-zinc-800' : 'bg-gray-200'
          } rounded`}
        />
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`h-4 ${
              isDark ? 'bg-zinc-800' : 'bg-gray-200'
            } rounded`}
          />
          <div
            className={`h-4 ${
              isDark ? 'bg-zinc-800' : 'bg-gray-200'
            } rounded`}
          />
        </div>
      </div>
    </div>
  );
}