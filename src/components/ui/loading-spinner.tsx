'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-muted border-t-primary',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

// Componente de skeleton para carregamento de cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="bg-muted rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-muted-foreground/20 rounded"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-32"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-muted-foreground/20 rounded w-1/2"></div>
          <div className="h-2 bg-muted-foreground/20 rounded w-2/3"></div>
          <div className="h-2 bg-muted-foreground/20 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}

// Componente de loading para listas
export function ListSkeleton({ items = 3, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-muted-foreground/20 rounded w-16"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-muted-foreground/20 rounded-full w-20"></div>
              <div className="h-6 bg-muted-foreground/20 rounded-full w-16"></div>
              <div className="h-6 bg-muted-foreground/20 rounded-full w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente de loading para páginas inteiras
export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-8 p-6">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <div className="h-8 bg-muted-foreground/20 rounded w-96 mx-auto"></div>
        <div className="h-4 bg-muted-foreground/20 rounded w-64 mx-auto"></div>
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}