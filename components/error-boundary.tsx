"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.name || 'Component'}:`, error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
          <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-white">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-center">
                {this.props.name 
                  ? `An error occurred in the ${this.props.name} component.`
                  : "An unexpected error occurred while loading this component."
                }
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-slate-700/50 rounded-lg p-3">
                  <summary className="text-sm text-slate-300 cursor-pointer">Error details</summary>
                  <pre className="mt-2 text-xs text-red-300 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-700/50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// React component wrapper for easier usage
export function ErrorBoundaryWrapper({ 
  children, 
  fallback, 
  name 
}: Props) {
  return (
    <ErrorBoundary fallback={fallback} name={name}>
      {children}
    </ErrorBoundary>
  );
}

// Lightweight error fallback for non-critical components
export function ErrorFallback({ 
  error, 
  resetError, 
  name 
}: { 
  error?: Error; 
  resetError?: () => void; 
  name?: string; 
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
      <div className="flex items-center gap-2 text-orange-400 mb-2">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">
          {name ? `${name} unavailable` : "Component error"}
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-3">
        This component couldn't load properly. You can try refreshing or continue using other features.
      </p>
      {resetError && (
        <Button 
          onClick={resetError} 
          size="sm" 
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
}