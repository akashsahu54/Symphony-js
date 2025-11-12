/**
 * WaveformVisualizer component for Symphony.js
 * Requirements: 5.1, 5.2, 5.3, 7.4
 */

import React, { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { performanceMonitor } from '../utils/performanceMonitor';
import { useAudioEngine } from '../contexts/AudioEngineContext';
import './WaveformVisualizer.css';

interface WaveformVisualizerProps {
  /** Optional width override */
  width?: number;
  
  /** Optional height override */
  height?: number;
}

/**
 * WaveformVisualizer component
 * Displays real-time audio waveforms using canvas and Tone.Waveform
 * Requirements: 7.4 - Provide visual-only fallback if audio unavailable
 */
export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  width,
  height
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveformRef = useRef<Tone.Waveform | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [visualizerError, setVisualizerError] = useState<string | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const frameIntervalRef = useRef<number>(1000 / 60); // ~16.67ms per frame for 60fps
  const { currentMood } = useAudioEngine();
  
  /**
   * Get waveform color based on current mood
   */
  const getWaveformColor = (): string => {
    if (!currentMood) return '#0e639c'; // Default blue
    
    switch (currentMood.mood) {
      case 'HARMONIOUS':
        // Green/blue gradient for harmonious code
        return '#00d9ff'; // Cyan/turquoise
      case 'DISCORDANT':
        // Red/orange for discordant code
        return '#ff4444'; // Bright red
      case 'INTENSE':
        // Purple/magenta for intense code
        return '#ff00ff'; // Magenta
      default:
        return '#0e639c'; // Default blue
    }
  };
  
  /**
   * Get gradient colors for enhanced visual effect
   */
  const getGradientColors = (): { start: string; end: string } => {
    if (!currentMood) return { start: '#0e639c', end: '#0e639c' };
    
    switch (currentMood.mood) {
      case 'HARMONIOUS':
        return { start: '#00ff88', end: '#00d9ff' }; // Green to cyan
      case 'DISCORDANT':
        return { start: '#ff4444', end: '#ff8800' }; // Red to orange
      case 'INTENSE':
        return { start: '#ff00ff', end: '#ffff00' }; // Magenta to yellow
      default:
        return { start: '#0e639c', end: '#0e639c' };
    }
  };

  useEffect(() => {
    try {
      // Initialize Tone.Waveform analyzer node
      // Requirements: 5.1, 5.2, 7.4
      const waveform = new Tone.Waveform(1024);
      waveformRef.current = waveform;

      // Connect analyzer to Tone.Master (now Tone.getDestination())
      // Requirements: 5.2
      Tone.getDestination().connect(waveform);
      
      console.log('Waveform visualizer initialized successfully');
    } catch (error) {
      const errorMsg = `Failed to initialize waveform visualizer: ${error instanceof Error ? error.message : String(error)}`;
      setVisualizerError(errorMsg);
      console.error(errorMsg, error);
    }

    return () => {
      // Cleanup: cancel animation frame and dispose waveform
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (waveformRef.current) {
        try {
          waveformRef.current.dispose();
        } catch (error) {
          console.error('Error disposing waveform:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /**
     * Draw real-time waveform data to canvas
     * Requirements: 5.3, 7.4
     * Optimized to maintain 60fps
     */
    const draw = (currentTime: number) => {
      if (!waveformRef.current || !canvas) return;

      // Throttle rendering to maintain 60fps
      // Requirement: 7.4 - Optimize canvas rendering to maintain 60fps
      const elapsed = currentTime - lastFrameTimeRef.current;
      
      if (elapsed < frameIntervalRef.current) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      
      lastFrameTimeRef.current = currentTime - (elapsed % frameIntervalRef.current);

      // Track render performance
      const renderStartTime = performance.now();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Clear canvas with dark background
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Get waveform data
      const waveformData = waveformRef.current.getValue();
      const bufferLength = waveformData.length;

      // Optimize: Sample fewer points for large buffers to improve performance
      // Requirement: 7.4
      const sampleRate = Math.max(1, Math.floor(bufferLength / canvasWidth));
      const sampledLength = Math.floor(bufferLength / sampleRate);

      // Create gradient for waveform based on mood
      const gradientColors = getGradientColors();
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
      gradient.addColorStop(0, gradientColors.start);
      gradient.addColorStop(1, gradientColors.end);
      
      // Debug: Log mood changes (only occasionally to avoid spam)
      if (Math.random() < 0.01) {
        console.log('Current mood:', currentMood?.mood, 'Colors:', gradientColors);
      }

      // Draw waveform with dynamic color
      ctx.lineWidth = 3; // Slightly thicker for better visibility
      ctx.strokeStyle = gradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = getWaveformColor();
      ctx.beginPath();

      const sliceWidth = canvasWidth / sampledLength;
      let x = 0;

      for (let i = 0; i < sampledLength; i++) {
        const dataIndex = i * sampleRate;
        const value = waveformData[dataIndex];
        const y = ((value + 1) / 2) * canvasHeight;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
      
      // Reset shadow for center line
      ctx.shadowBlur = 0;

      // Draw center line for reference
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvasHeight / 2);
      ctx.lineTo(canvasWidth, canvasHeight / 2);
      ctx.stroke();

      // Record render time for performance monitoring
      const renderDuration = performance.now() - renderStartTime;
      performanceMonitor.recordRenderTime(renderDuration);

      // Implement canvas rendering loop using requestAnimationFrame
      // Requirements: 5.3
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Start rendering loop
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentMood]); // Re-create draw function when mood changes

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      // Set canvas size to match container
      canvas.width = width || container.clientWidth;
      canvas.height = height || container.clientHeight;
    };

    resizeCanvas();

    // Listen for window resize
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [width, height]);

  return (
    <div className="waveform-visualizer">
      <div className="visualizer-header">
        <h2>Audio Visualizer</h2>
      </div>
      <div className="canvas-container">
        {visualizerError ? (
          <div className="visualizer-error">
            <p>⚠️ Visualizer unavailable</p>
            <p className="error-details">{visualizerError}</p>
          </div>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </div>
  );
};
