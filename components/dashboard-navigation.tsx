'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  PieChart, 
  Monitor,
  Grid3X3,
  Home
} from 'lucide-react';

const navigationItems = [
  {
    href: '/dashboard',
    label: 'Main Dashboard',
    icon: Home,
    description: 'Primary dashboard with key metrics'
  },
  {
    href: '/comprehensive',
    label: 'Comprehensive',
    icon: Grid3X3,
    description: 'Complete analytics overview'
  },
  {
    href: '/grafana',
    label: 'Grafana Style',
    icon: Monitor,
    description: 'Grafana-style real-time dashboard'
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Detailed analytical reports'
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: Activity,
    description: 'Individual project tracking'
  }
];

interface DashboardNavigationProps {
  className?: string;
}

export function DashboardNavigation({ className }: DashboardNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-wrap gap-2 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700", className)}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex items-center space-x-2 transition-colors",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}