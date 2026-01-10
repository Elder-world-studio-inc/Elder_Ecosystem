"use client";

import { useAuth } from '../app/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'division')[];
  allowedDivision?: string;
}

export default function RouteGuard({ children, allowedRoles, allowedDivision }: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) return; // Handled by AuthContext

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') router.push('/command-center');
        else if (user.role === 'division' && user.divisionId) router.push(`/divisions/${user.divisionId}`);
        else router.push('/'); 
      return;
    }

    if (allowedDivision && user.divisionId !== allowedDivision && user.role !== 'admin') {
        if (user.role === 'division' && user.divisionId) router.push(`/divisions/${user.divisionId}`);
        else router.push('/command-center');
      return;
    }

  }, [user, isLoading, allowedRoles, allowedDivision, router, pathname]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!user) return null; // Will redirect

  // Double check for rendering to prevent flash
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  if (allowedDivision && user.divisionId !== allowedDivision && user.role !== 'admin') return null;

  return <>{children}</>;
}
