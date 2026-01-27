'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, redirects to login if not authenticated
  redirectTo?: string; // Where to redirect if not authenticated
}

export default function ProtectedRouteWrapper({
  children,
  requireAuth = true,
  redirectTo = '/login'
}: ProtectedRouteWrapperProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!loading) {
      // If this route requires authentication but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        router.replace(redirectTo);
      } else {
        setHasCheckedAuth(true);
      }
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, router]);

  // Show nothing while checking auth status
  if (loading || !hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated but this is a public route (like login), redirect away
  if (!requireAuth && isAuthenticated) {
    router.replace('/');
    return null;
  }

  return <>{children}</>;
}