/**
 * Performance monitoring utility for Symphony.js
 * Requirements: 7.4
 * 
 * Helps profile debounce timing, canvas rendering, and overall responsiveness
 */

interface PerformanceMetrics {
  analysisTime: number[];
  renderTime: number[];
  audioLatency: number[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    analysisTime: [],
    renderTime: [],
    audioLatency: []
  };
  
  private maxSamples = 100; // Keep last 100 samples
  private enabled = false;

  /**
   * Enable performance monitoring
   * Requirement: 7.4 - Profile debounce timing for optimal responsiveness
   */
  enable(): void {
    this.enabled = true;
    console.log('Performance monitoring enabled');
  }

  /**
   * Disable performance monitoring
   */
  disable(): void {
    this.enabled = false;
    console.log('Performance monitoring disabled');
  }

  /**
   * Record code analysis time
   */
  recordAnalysisTime(duration: number): void {
    if (!this.enabled) return;
    
    this.metrics.analysisTime.push(duration);
    if (this.metrics.analysisTime.length > this.maxSamples) {
      this.metrics.analysisTime.shift();
    }
  }

  /**
   * Record canvas render time
   * Requirement: 7.4 - Optimize canvas rendering to maintain 60fps
   */
  recordRenderTime(duration: number): void {
    if (!this.enabled) return;
    
    this.metrics.renderTime.push(duration);
    if (this.metrics.renderTime.length > this.maxSamples) {
      this.metrics.renderTime.shift();
    }
  }

  /**
   * Record audio playback latency
   */
  recordAudioLatency(duration: number): void {
    if (!this.enabled) return;
    
    this.metrics.audioLatency.push(duration);
    if (this.metrics.audioLatency.length > this.maxSamples) {
      this.metrics.audioLatency.shift();
    }
  }

  /**
   * Get average of an array
   */
  private getAverage(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  /**
   * Get 95th percentile of an array
   */
  private getPercentile(arr: number[], percentile: number): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * percentile);
    return sorted[index];
  }

  /**
   * Get performance report
   * Requirement: 7.4 - Profile performance metrics
   */
  getReport(): {
    analysis: { avg: number; p95: number; fps: number };
    render: { avg: number; p95: number; fps: number };
    audio: { avg: number; p95: number };
  } {
    return {
      analysis: {
        avg: this.getAverage(this.metrics.analysisTime),
        p95: this.getPercentile(this.metrics.analysisTime, 0.95),
        fps: this.metrics.analysisTime.length > 0 
          ? 1000 / this.getAverage(this.metrics.analysisTime) 
          : 0
      },
      render: {
        avg: this.getAverage(this.metrics.renderTime),
        p95: this.getPercentile(this.metrics.renderTime, 0.95),
        fps: this.metrics.renderTime.length > 0 
          ? 1000 / this.getAverage(this.metrics.renderTime) 
          : 0
      },
      audio: {
        avg: this.getAverage(this.metrics.audioLatency),
        p95: this.getPercentile(this.metrics.audioLatency, 0.95)
      }
    };
  }

  /**
   * Print performance report to console
   */
  printReport(): void {
    const report = this.getReport();
    
    console.group('Performance Report');
    console.log('Code Analysis:');
    console.log(`  Average: ${report.analysis.avg.toFixed(2)}ms`);
    console.log(`  95th Percentile: ${report.analysis.p95.toFixed(2)}ms`);
    console.log(`  Effective FPS: ${report.analysis.fps.toFixed(1)}`);
    
    console.log('\nCanvas Rendering:');
    console.log(`  Average: ${report.render.avg.toFixed(2)}ms`);
    console.log(`  95th Percentile: ${report.render.p95.toFixed(2)}ms`);
    console.log(`  Effective FPS: ${report.render.fps.toFixed(1)}`);
    
    console.log('\nAudio Latency:');
    console.log(`  Average: ${report.audio.avg.toFixed(2)}ms`);
    console.log(`  95th Percentile: ${report.audio.p95.toFixed(2)}ms`);
    console.groupEnd();
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = {
      analysisTime: [],
      renderTime: [],
      audioLatency: []
    };
    console.log('Performance metrics cleared');
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = performanceMonitor;
}
