"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Title Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 bg-slate-700/50" />
        
        {/* Hero Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-slate-600/50" />
                    <Skeleton className="h-8 w-16 bg-slate-600/50" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3 bg-slate-600/50" />
                      <Skeleton className="h-3 w-12 bg-slate-600/50" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full bg-slate-600/50" />
                </div>
                <Skeleton className="h-1 w-full mt-4 bg-slate-600/50" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Market Intelligence Skeleton */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-slate-600/50" />
              <Skeleton className="h-4 w-72 bg-slate-600/50" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 bg-slate-600/50" />
              <Skeleton className="h-8 w-20 bg-slate-600/50" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-80 w-full bg-slate-600/50" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-slate-700/50 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20 bg-slate-500/50" />
                        <Skeleton className="h-5 w-16 bg-slate-500/50" />
                      </div>
                      <Skeleton className="h-10 w-full bg-slate-500/50" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex space-x-1 bg-slate-800/70 p-1 rounded-xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 flex-1 bg-slate-600/50" />
          ))}
        </div>

        {/* Tab Content Skeleton */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 bg-slate-600/50" />
                <Skeleton className="h-4 w-64 bg-slate-600/50" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-48 bg-slate-600/50" />
                <Skeleton className="h-10 w-48 bg-slate-600/50" />
                <Skeleton className="h-10 w-10 bg-slate-600/50" />
                <Skeleton className="h-10 w-10 bg-slate-600/50" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-slate-700/50 border-slate-600/50">
                  <CardHeader className="pb-2">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4 bg-slate-500/50" />
                      <Skeleton className="h-4 w-1/2 bg-slate-500/50" />
                      <Skeleton className="h-3 w-1/3 bg-slate-500/50" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20 bg-slate-500/50" />
                        <Skeleton className="h-4 w-16 bg-slate-500/50" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-16 bg-slate-500/50" />
                        <Skeleton className="h-4 w-20 bg-slate-500/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20 bg-slate-500/50" />
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-16 bg-slate-500/50" />
                        <Skeleton className="h-5 w-12 bg-slate-500/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16 bg-slate-500/50" />
                      <Skeleton className="h-4 w-24 bg-slate-500/50" />
                    </div>
                    <Skeleton className="h-8 w-full bg-slate-500/50" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}