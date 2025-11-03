'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Not authenticated, redirect to login
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}