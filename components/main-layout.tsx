'use client';

import React from 'react';
import { DashboardNavigation } from './dashboard-navigation';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showNavigation?: boolean;
}

export function MainLayout({ 
  children, 
  className, 
  showNavigation = true 
}: MainLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", className)}>
      {showNavigation && <DashboardNavigation />}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}