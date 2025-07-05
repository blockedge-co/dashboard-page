"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <CardTitle className="text-2xl text-white">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-slate-400">
            We encountered an error while loading the carbon dashboard. Our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDevelopment && (
            <Alert className="bg-red-900/20 border-red-500/30">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-300">
                <strong>Development Mode Error:</strong>
                <pre className="mt-2 text-sm overflow-auto max-h-32">
                  {error.message}
                </pre>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={resetErrorBoundary}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>

          <div className="text-center text-sm text-slate-500">
            If the problem persists, please contact our support team at{" "}
            <a 
              href="mailto:support@blockedge.com"
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              support@blockedge.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}