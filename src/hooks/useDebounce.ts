/**
 * Debounce hook for Symphony.js
 * Requirements: 3.1, 7.4
 */

import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '../utils/performanceMonitor';

/**
 * Custom hook for debouncing function calls
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds (default: 300ms for optimal responsiveness)
 * @returns Debounced function
 * 
 * Requirement: 7.4 - Profile debounce timing for optimal responsiveness
 * Optimized from 500ms to 300ms for better user experience while maintaining performance
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Create debounced function
  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      // Cancel pending analysis on rapid typing
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Schedule new analysis
      const startTime = performance.now();
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        
        // Record analysis time for performance monitoring
        const duration = performance.now() - startTime;
        performanceMonitor.recordAnalysisTime(duration);
      }, delay);
    }) as T,
    [delay]
  );

  return debouncedCallback;
}
