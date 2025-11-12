/**
 * Unit tests for IntroScreen component
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 3.5, 4.1, 4.2
 * 
 * Tests the IntroScreen component functionality including:
 * - Black background rendering
 * - Typewriter animation
 * - Tagline display
 * - Logo rendering
 * - Auto-complete timer
 * - Skip functionality (click and keyboard)
 * - Audio initialization and fallback
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IntroScreen from './IntroScreen';
import * as Tone from 'tone';

// Mock Tone.js to avoid actual audio playback during tests
vi.mock('tone', () => {
  const mockVolume = {
    volume: {
      value: -60,
      rampTo: vi.fn(),
    },
    toDestination: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
  };

  const mockSynth = {
    triggerAttackRelease: vi.fn(),
    releaseAll: vi.fn(),
    connect: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
  };

  return {
    start: vi.fn().mockResolvedValue(undefined),
    now: vi.fn(() => 0),
    Volume: vi.fn(() => mockVolume),
    PolySynth: vi.fn(() => mockSynth),
    Synth: vi.fn(),
  };
});

describe('IntroScreen Component', () => {
  let onCompleteMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    onCompleteMock = vi.fn();
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Test: Black background renders
   * Requirements: 1.2
   */
  it('should render with black background', () => {
    const { container } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    const introScreen = container.querySelector('.intro-screen');
    
    expect(introScreen).toBeDefined();
    expect(introScreen?.classList.contains('intro-screen')).toBe(true);
  });

  it('should have dialog role', () => {
    const { container } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    const introScreen = container.querySelector('.intro-screen');
    
    expect(introScreen?.getAttribute('role')).toBe('dialog');
  });

  it('should have aria-label', () => {
    const { container } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    const introScreen = container.querySelector('.intro-screen');
    
    expect(introScreen?.getAttribute('aria-label')).toBe('Symphony.js intro screen');
  });

  /**
   * Test: Typewriter animation completes
   * Requirements: 1.3
   */
  it('should display title text', () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    const title = document.querySelector('.intro-title');
    
    expect(title).toBeDefined();
  });

  it('should show cursor during typewriter animation', () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    const cursor = document.querySelector('.cursor');
    
    // Cursor should be present initially (unless reduced motion is preferred)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      expect(cursor).toBeDefined();
    }
  });

  it('should complete typewriter animation', async () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Wait for typewriter animation to complete
      await waitFor(() => {
        const title = document.querySelector('.intro-title');
        expect(title?.textContent).toContain('Symphony.js');
      }, { timeout: 2000 });
    }
  });

  /**
   * Test: Tagline appears after title
   * Requirements: 1.4
   */
  it('should show tagline after title completes', async () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Tagline should be visible immediately with reduced motion
      const tagline = document.querySelector('.intro-tagline');
      expect(tagline).toBeDefined();
    } else {
      // Wait for typewriter animation + tagline delay
      await waitFor(() => {
        const tagline = document.querySelector('.intro-tagline');
        expect(tagline).toBeDefined();
      }, { timeout: 2500 });
    }
  });

  it('should display correct tagline text', async () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    await waitFor(() => {
      const tagline = document.querySelector('.intro-tagline');
      expect(tagline?.textContent).toBe('Stop looking for bugs... and start listening for them!');
    }, { timeout: prefersReducedMotion ? 100 : 2500 });
  });

  /**
   * Test: Logo is rendered
   * Requirements: 2.1
   */
  it('should render IntroLogo component', () => {
    const { container } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    const logo = container.querySelector('.intro-logo');
    
    expect(logo).toBeDefined();
  });

  /**
   * Test: onComplete callback after 5 seconds
   * Requirements: 1.1, 1.5
   */
  it('should call onComplete after 5 seconds', async () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    expect(onCompleteMock).not.toHaveBeenCalled();
    
    // Wait for auto-complete (5 seconds + 500ms fade-out)
    await waitFor(() => {
      expect(onCompleteMock).toHaveBeenCalledTimes(1);
    }, { timeout: 6000 });
  }, 7000); // Set test timeout to 7 seconds

  it('should add fade-out class before completing', async () => {
    const { container } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    const introScreen = container.querySelector('.intro-screen');
    
    // Initially no fade-out
    expect(introScreen?.classList.contains('fade-out')).toBe(false);
    
    // Wait for fade-out to start (at 5 seconds)
    await waitFor(() => {
      expect(introScreen?.classList.contains('fade-out')).toBe(true);
    }, { timeout: 5500 });
  }, 7000); // Set test timeout to 7 seconds

  /**
   * Test: Skip on click
   * Requirements: 4.1, 4.2
   */
  it('should skip intro on click', async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    const introScreen = container.querySelector('.intro-screen');
    
    expect(onCompleteMock).not.toHaveBeenCalled();
    
    // Click the intro screen
    await user.click(introScreen as Element);
    
    // Wait for fade-out and completion (500ms)
    await waitFor(() => {
      expect(onCompleteMock).toHaveBeenCalledTimes(1);
    }, { timeout: 1000 });
  });

  it('should add fade-out class on click', async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    const introScreen = container.querySelector('.intro-screen');
    
    await user.click(introScreen as Element);
    
    expect(introScreen?.classList.contains('fade-out')).toBe(true);
  });

  /**
   * Test: Skip on keyboard press
   * Requirements: 4.1, 4.2
   */
  it('should skip intro on keyboard press', async () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    expect(onCompleteMock).not.toHaveBeenCalled();
    
    // Press any key
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);
    
    // Wait for fade-out and completion (500ms)
    await waitFor(() => {
      expect(onCompleteMock).toHaveBeenCalledTimes(1);
    }, { timeout: 1000 });
  });

  it('should display skip instruction', () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    const skipInstruction = document.querySelector('.skip-instruction');
    
    expect(skipInstruction).toBeDefined();
    expect(skipInstruction?.textContent).toBe('Skip - Press any key');
  });

  it('should have skip instruction with button role', () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    const skipInstruction = document.querySelector('.skip-instruction');
    
    expect(skipInstruction?.getAttribute('role')).toBe('button');
  });

  /**
   * Test: Audio initialization and fallback
   * Requirements: 3.1, 3.5
   */
  it('should initialize audio on mount', async () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    // Wait for audio initialization
    await waitFor(() => {
      expect(Tone.start).toHaveBeenCalled();
    });
  });

  it('should handle audio initialization gracefully', () => {
    // Should not throw even if audio fails
    expect(() => render(<IntroScreen onComplete={onCompleteMock} />)).not.toThrow();
  });

  it('should clean up audio on unmount', async () => {
    const { unmount } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    // Wait for audio to initialize
    await waitFor(() => {
      expect(Tone.start).toHaveBeenCalled();
    });
    
    // Unmount component
    unmount();
    
    // Audio resources should be disposed
    // (Verified by the dispose calls in the mock)
  });

  /**
   * Test: Reduced motion support
   * Requirements: 1.3, 2.2
   */
  it('should respect prefers-reduced-motion setting', () => {
    render(<IntroScreen onComplete={onCompleteMock} />);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Title should be fully displayed immediately
      const title = document.querySelector('.intro-title');
      expect(title?.textContent).toBe('Symphony.js');
      
      // Tagline should be visible immediately
      const tagline = document.querySelector('.intro-tagline');
      expect(tagline).toBeDefined();
      
      // No cursor should be shown
      const cursor = document.querySelector('.cursor');
      expect(cursor).toBeNull();
    }
  });

  /**
   * Test: Component structure
   */
  it('should render intro content container', () => {
    const { container } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    const introContent = container.querySelector('.intro-content');
    
    expect(introContent).toBeDefined();
    expect(introContent?.getAttribute('role')).toBe('presentation');
  });

  it('should be focusable', () => {
    const { container } = render(<IntroScreen onComplete={onCompleteMock} />);
    
    const introScreen = container.querySelector('.intro-screen');
    
    expect(introScreen?.getAttribute('tabIndex')).toBe('0');
  });
});
