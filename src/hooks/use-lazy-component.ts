'use client';

import { lazy, ComponentType, LazyExoticComponent } from 'react';
import { useState, useEffect } from 'react';

// Hook para lazy loading de componentes com preload opcional
export function useLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  preload = false
): {
  LazyComponent: LazyExoticComponent<T> | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [LazyComponent, setLazyComponent] = useState<LazyExoticComponent<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (preload) {
      loadComponent();
    }
  }, [preload]);

  const loadComponent = () => {
    if (LazyComponent) return LazyComponent;

    setIsLoading(true);
    setError(null);

    try {
      const component = lazy(importFn);
      setLazyComponent(component);
      setIsLoading(false);
      return component;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      return null;
    }
  };

  return {
    LazyComponent: LazyComponent || (isLoading ? null : loadComponent()),
    isLoading,
    error
  };
}

// Hook para intersection observer (lazy loading baseado em visibilidade)
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}

// Hook para debounce (otimização de performance em inputs)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para memoização de cálculos pesados
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T {
  const [result, setResult] = useState<T>(() => calculation());

  useEffect(() => {
    setResult(calculation());
  }, dependencies);

  return result;
}