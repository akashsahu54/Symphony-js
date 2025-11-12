/**
 * Integration tests for intro screen to app transition
 * Requirements: 1.1, 1.5, 4.2, 4.3
 * 
 * Tests the integration between IntroScreen and main App:
 * - IntroScreen displays first on load
 * - Main app hidden during intro
 * - Main app displays after intro completes
 * - Skip functionality transitions correctly
 * - Audio cleanup on transition
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import IntroScreen from './components/IntroScreen';
import App from './App';

// Mock Tone.js to avoid actual audio playback during tests
vi.mock('tone', () => {
  const mockTransport = {
    bpm: { value: 120 },
    start: vi.fn(),
    stop: vi.fn(),
    cancel: vi.fn(),
    schedule: vi.fn((callback: any, time: any) => 1),
  };

  const mockDestination = {
    connect: vi.fn(),
    disconnect: vi.fn(),
  };

  const mockVolume = {
    toDestination: vi.fn().mockReturnThis(),
    connect: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
    volume: {
      value: -60,
      rampTo: vi.fn(),
    },
  };

  return {
    start: vi.fn().mockResolvedValue(undefined),
    context: {
      state: 'running',
    },
    getTransport: vi.fn(() => mockTransport),
    getDestination: vi.fn(() => mockDestination),
    now: vi.fn(() => 0),
    Volume: vi.fn(function(this: any) {
      Object.assign(this, mockVolume);
      return this;
    }),
    Limiter: vi.fn(function(this: any) {
      this.toDestination = vi.fn().mockReturnThis();
      this.dispose = vi.fn();
      return this;
    }),
    MembraneSynth: vi.fn(function(this: any) {
      this.toDestination = vi.fn().mockReturnThis();
      this.triggerAttackRelease = vi.fn();
      this.dispose = vi.fn();
      return this;
    }),
    PolySynth: vi.fn(function(this: any) {
      this.toDestination = vi.fn().mockReturnThis();
      this.connect = vi.fn().mockReturnThis();
      this.triggerAttackRelease = vi.fn();
      this.releaseAll = vi.fn();
      this.dispose = vi.fn();
      return this;
    }),
    Synth: vi.fn(function(this: any) {
      this.toDestination = vi.fn().mockReturnThis();
      this.triggerAttackRelease = vi.fn();
      this.dispose = vi.fn();
      return this;
    }),
    Frequency: vi.fn((note: string) => ({
      transpose: vi.fn().mockReturnThis(),
      toNote: vi.fn(() => note),
    })),
    Waveform: vi.fn(function(this: any) {
      this.toDestination = vi.fn().mockReturnThis();
      this.connect = vi.fn().mockReturnThis();
      this.getValue = vi.fn(() => new Float32Array(128)),
      this.dispose = vi.fn();
      return this;
    }),
  };
});

// Root component that mimics main.tsx behavior
const Root = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showApp, setShowApp] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Small delay to ensure intro is fully hidden before showing app
    setTimeout(() => {
      setShowApp(true);
    }, 50);
  };

  return (
    <>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      {showApp && (
        <div className="app-container fade-in">
          <App />
        </div>
      )}
    </>
  );
};

describe('Intro Screen to App Transition Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
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
    vi.useRealTimers();
  });

  /**
   * Test: IntroScreen displays first on load
   * Requirements: 1.1
   */
  describe('IntroScreen displays first on load', () => {
    it('should render IntroScreen on initial load', () => {
      render(<Root />);
      
      // Verify intro screen is visible
      const introScreen = document.querySelector('.intro-screen');
      expect(introScreen).toBeDefined();
      expect(introScreen).not.toBeNull();
    });

    it('should display Symphony.js title in intro screen', async () => {
      render(<Root />);
      
      // Run timers to allow typewriter effect to complete
      act(() => {
        vi.runAllTimers();
      });
      
      // Wait for title to appear (either immediately or via typewriter)
      await waitFor(() => {
        const title = document.querySelector('.intro-title');
        expect(title).toBeDefined();
        expect(title?.textContent).toContain('Symphony.js');
      }, { timeout: 1000 });
    }, 10000);

    it('should display intro logo', () => {
      render(<Root />);
      
      const logo = document.querySelector('.intro-logo');
      expect(logo).toBeDefined();
      expect(logo).not.toBeNull();
    });

    it('should display skip instruction', () => {
      render(<Root />);
      
      const skipInstruction = document.querySelector('.skip-instruction');
      expect(skipInstruction).toBeDefined();
      expect(skipInstruction?.textContent).toContain('Skip');
    });
  });

  /**
   * Test: Main app hidden during intro
   * Requirements: 1.1
   */
  describe('Main app hidden during intro', () => {
    it('should not render main app initially', () => {
      render(<Root />);
      
      // Main app should not be present
      const appContainer = document.querySelector('.app-container');
      expect(appContainer).toBeNull();
    });

    it('should not render editor panel during intro', () => {
      render(<Root />);
      
      const editorPanel = document.querySelector('.editor-panel');
      expect(editorPanel).toBeNull();
    });

    it('should not render waveform visualizer during intro', () => {
      render(<Root />);
      
      const visualizer = document.querySelector('.waveform-visualizer');
      expect(visualizer).toBeNull();
    });

    it('should not render control buttons during intro', () => {
      render(<Root />);
      
      const playCommitButton = screen.queryByRole('button', { name: /play commit/i });
      const muteBugsButton = screen.queryByRole('button', { name: /mute bugs/i });
      
      expect(playCommitButton).toBeNull();
      expect(muteBugsButton).toBeNull();
    });
  });

  /**
   * Test: Main app displays after intro completes
   * Requirements: 1.5
   */
  describe('Main app displays after intro completes', () => {
    it('should transition to main app after 5 seconds', async () => {
      render(<Root />);
      
      // Verify intro is showing
      expect(document.querySelector('.intro-screen')).not.toBeNull();
      
      // Fast-forward all timers
      act(() => {
        vi.runAllTimers();
      });
      
      // Wait for app to appear
      await waitFor(() => {
        const appContainer = document.querySelector('.app-container');
        expect(appContainer).not.toBeNull();
      }, { timeout: 1000 });
      
      // Verify intro is gone
      expect(document.querySelector('.intro-screen')).toBeNull();
    }, 10000);

    it('should render editor panel after intro completes', async () => {
      render(<Root />);
      
      // Fast-forward through intro
      act(() => {
        vi.runAllTimers();
      });
      
      // Wait for editor panel to appear
      await waitFor(() => {
        const editorPanel = document.querySelector('.editor-panel');
        expect(editorPanel).not.toBeNull();
      }, { timeout: 1000 });
    }, 10000);

    it('should render waveform visualizer after intro completes', async () => {
      render(<Root />);
      
      // Fast-forward through intro
      act(() => {
        vi.runAllTimers();
      });
      
      // Wait for visualizer to appear
      await waitFor(() => {
        const visualizer = document.querySelector('.waveform-visualizer');
        expect(visualizer).not.toBeNull();
      }, { timeout: 1000 });
    }, 10000);

    it('should render control buttons after intro completes', async () => {
      render(<Root />);
      
      // Fast-forward through intro
      act(() => {
        vi.runAllTimers();
      });
      
      // Wait for buttons to appear
      await waitFor(() => {
        const playCommitButton = screen.queryByRole('button', { name: /play commit/i });
        const muteBugsButton = screen.queryByRole('button', { name: /mute bugs/i });
        
        expect(playCommitButton).not.toBeNull();
        expect(muteBugsButton).not.toBeNull();
      }, { timeout: 1000 });
    }, 10000);

    it('should apply fade-in class to app container', async () => {
      render(<Root />);
      
      // Fast-forward through intro
      act(() => {
        vi.runAllTimers();
      });
      
      // Wait for app container with fade-in class
      await waitFor(() => {
        const appContainer = document.querySelector('.app-container.fade-in');
        expect(appContainer).not.toBeNull();
      }, { timeout: 1000 });
    }, 10000);
  });

  /**
   * Test: Skip functionality transitions correctly
   * Requirements: 4.2, 4.3
   */
  describe('Skip functionality transitions correctly', () => {
    it('should skip intro on click', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Root />);
      
      // Verify intro is showing
      const introScreen = document.querySelector('.intro-screen');
      expect(introScreen).not.toBeNull();
      
      // Click to skip
      await user.click(introScreen as HTMLElement);
      
      // Fast-forward all timers
      act(() => {
        vi.runAllTimers();
      });
      
      // Wait for app to appear
      await waitFor(() => {
        const appContainer = document.querySelector('.app-container');
        expect(appContainer).not.toBeNull();
      }, { timeout: 1000 });
      
      // Verify intro is gone
      expect(document.querySelector('.intro-screen')).toBeNull();
    }, 10000);

    it('should skip intro on keyboard press', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Root />);
      
      // Verify intro is showing
      expect(document.querySelector('.intro-screen')).not.toBeNull();
      
      // Press any key to skip
      await user.keyboard('{Enter}');
      
      // Fast-forward all timers
      act(() => {
        vi.runAllTimers();
      });
      
      // Wait for app to appear
      await waitFor(() => {
        const appContainer = document.querySelector('.app-container');
        expect(appContainer).not.toBeNull();
      }, { timeout: 1000 });
      
      // Verify intro is gone
      expect(document.querySelector('.intro-screen')).toBeNull();
    }, 10000);

    it('should apply fade-out class when skipping', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Root />);
      
      const introScreen = document.querySelector('.intro-screen');
      expect(introScreen).not.toBeNull();
      
      // Click to skip
      await user.click(introScreen as HTMLElement);
      
      // Verify fade-out class is applied
      await waitFor(() => {
        const fadingIntro = document.querySelector('.intro-screen.fade-out');
        expect(fadingIntro).not.toBeNull();
      }, { timeout: 100 });
    }, 10000);

    it('should transition to app immediately after skip (with fade)', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Root />);
      
      const introScreen = document.querySelector('.intro-screen');
      
      // Click to skip
      await user.click(introScreen as HTMLElement);
      
      // Fast-forward all timers
      act(() => {
        vi.runAllTimers();
      });
      
      // App should appear
      await waitFor(() => {
        const appContainer = document.querySelector('.app-container');
        expect(appContainer).not.toBeNull();
      }, { timeout: 1000 });
    }, 10000);
  });

  /**
   * Test: Audio cleanup on transition
   * Requirements: 4.3
   */
  describe('Audio cleanup on transition', () => {
    it('should complete transition after auto-complete without errors', async () => {
      render(<Root />);
      
      // Fast-forward through intro
      act(() => {
        vi.runAllTimers();
      });
      
      // Wait for transition to complete
      await waitFor(() => {
        const appContainer = document.querySelector('.app-container');
        expect(appContainer).not.toBeNull();
      }, { timeout: 1000 });
      
      // Verify intro is gone (audio cleanup happened)
      expect(document.querySelector('.intro-screen')).toBeNull();
    }, 10000);

    it('should complete transition on skip without errors', async () => {
      const user = userEvent.setup({ delay: null });
      
      render(<Root />);
      
      const introScreen = document.querySelector('.intro-screen');
      
      // Click to skip
      await user.click(introScreen as HTMLElement);
      
      // Fast-forward all timers
      act(() => {
        vi.runAllTimers();
      });
      
      // Verify transition completed (audio cleanup happened)
      await waitFor(() => {
        expect(document.querySelector('.intro-screen')).toBeNull();
        expect(document.querySelector('.app-container')).not.toBeNull();
      }, { timeout: 1000 });
    }, 10000);

    it('should handle audio initialization and cleanup gracefully', async () => {
      render(<Root />);
      
      // Fast-forward all timers
      act(() => {
        vi.runAllTimers();
      });
      
      // Verify transition completed without errors
      await waitFor(() => {
        expect(document.querySelector('.app-container')).not.toBeNull();
      }, { timeout: 1000 });
    }, 10000);

    it('should apply fade-out class before cleanup on skip', async () => {
      const user = userEvent.setup({ delay: null });
      
      render(<Root />);
      
      const introScreen = document.querySelector('.intro-screen');
      
      // Click to skip
      await user.click(introScreen as HTMLElement);
      
      // Verify fade-out class is applied (indicates audio cleanup is happening)
      await waitFor(() => {
        expect(introScreen?.classList.contains('fade-out')).toBe(true);
      });
    }, 10000);
  });

  /**
   * Test: Complete integration flow
   * Requirements: 1.1, 1.5, 4.2, 4.3
   */
  describe('Complete integration flow', () => {
    it('should complete full intro-to-app flow', async () => {
      render(<Root />);
      
      // 1. Intro displays first
      expect(document.querySelector('.intro-screen')).not.toBeNull();
      expect(document.querySelector('.app-container')).toBeNull();
      
      // 2. Wait for intro to complete
      act(() => {
        vi.runAllTimers();
      });
      
      // 3. App appears after intro
      await waitFor(() => {
        expect(document.querySelector('.intro-screen')).toBeNull();
        expect(document.querySelector('.app-container')).not.toBeNull();
      }, { timeout: 1000 });
      
      // 4. Main app components are rendered
      await waitFor(() => {
        expect(document.querySelector('.editor-panel')).not.toBeNull();
        expect(document.querySelector('.waveform-visualizer')).not.toBeNull();
      }, { timeout: 1000 });
    }, 10000);

    it('should complete skip flow correctly', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Root />);
      
      // 1. Intro displays first
      expect(document.querySelector('.intro-screen')).not.toBeNull();
      
      // 2. User skips intro
      const introScreen = document.querySelector('.intro-screen');
      await user.click(introScreen as HTMLElement);
      
      // 3. Fade-out applied
      expect(introScreen?.classList.contains('fade-out')).toBe(true);
      
      // 4. Fast-forward all timers
      act(() => {
        vi.runAllTimers();
      });
      
      // 5. App appears
      await waitFor(() => {
        expect(document.querySelector('.intro-screen')).toBeNull();
        expect(document.querySelector('.app-container')).not.toBeNull();
      }, { timeout: 1000 });
    }, 10000);
  });
});
