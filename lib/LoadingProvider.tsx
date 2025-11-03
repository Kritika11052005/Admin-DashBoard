'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

function LoadingProviderContent({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Minimum loading time for smooth experience

    return () => clearTimeout(timer);
  }, []);

  // Handle route changes
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsNavigating(true);
    }, 0);

    const endTimer = setTimeout(() => {
      setIsNavigating(false);
    }, 500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [pathname, searchParams]);

  const showLoader = isLoading || isNavigating;

  return (
    <LoadingContext.Provider value={{ isLoading: showLoader, setIsLoading }}>
      {showLoader && (
        <Loader
          variant="brain"
          size="xl"
          text="Loading AariyaTech Analytics..."
          fullScreen
        />
      )}
      <div className={showLoader ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <Loader
        variant="brain"
        size="xl"
        text="Loading AariyaTech Analytics..."
        fullScreen
      />
    }>
      <LoadingProviderContent>{children}</LoadingProviderContent>
    </Suspense>
  );
}