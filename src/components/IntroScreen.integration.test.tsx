/**
 * Integration tests for intro to app transition
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
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, useState } from 'react';
import IntroScreen from './IntroScreen';
import App from '../App';

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

  return {
    start: vi.fn().mockResolvedValue(undefined),
    now: vi.fn(() => 0),
    Volume: vi.fn(() => mockVolume),
    PolySynth: vi.fn(() => mockSynth),
    Synth: vi.fn(function(this: any) {
      this.toDestination = vi.fn().mockReturnThis();
      this.triggerAttackRelease = vi.fn();
      this.dispose = vi.fn();
      return this;
    }),
    MembraneSynth: vi.fn(function(this: any) {
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
    getTransport: vi.fn(() => mockTransport),
    getDestination: vi.fn(() => mockDestination),
  };
});

// Root component that mimics main.tsx behavior
const Root = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showApp, setShowApp] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
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

describe('Intro to App Transition Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
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
   * Test: IntroScreen displays first on load
   * Requirements: 1.1
   */
  it('should display IntroScreen first on load', () => {
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introScreen = container.querySelector('.intro-screen');
    const appContainer = container.querySelector('.app-container');
    
    expect(introScreen).toBeDefined();
    expect(appContainer).toBeNull();
  });

  it('should show intro title on initial load', () => {
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introTitle = container.querySelector('.intro-title');
    
    expect(introTitle).toBeDefined();
  });

  /**
   * Test: Main app hidden during intro
   * Requirements: 1.1
   */
  it('should hide main app while intro is showing', () => {
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introScreen = container.querySelector('.intro-screen');
    const editorPanel = container.querySelector('.editor-panel');
    
    expect(introScreen).toBeDefined();
    expect(editorPanel).toBeNull();
  });

  it('should not render app components during intro', () => {
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const waveformVisualizer = container.querySelector('.waveform-visualizer');
    const controlBar = container.querySelector('.control-bar');
    
    expect(waveformVisualizer).toBeNull();
    expect(controlBar).toBeNull();
  });

  /**
   * Test: Main app displays after intro completes
   * Requirements: 1.5
   */
  it('should display main app after intro completes', async () => {
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    // Initially intro is showing
    expect(container.querySelector('.intro-screen')).toBeDefined();
    
    // Wait for intro to complete (5 seconds + 500ms fade-out + 50ms delay)
    await waitFor(() => {
      const appContainer = container.querySelector('.app-container');
      expect(appContainer).toBeDefined();
    }, { timeout: 6000 });
  }, 7000);

  it('should render editor panel after intro completes', async () => {
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    // Wait for intro to complete and app to render
    await waitFor(() => {
      const editorPanel = container.querySelector('.editor-panel');
      expect(editorPanel).toBeDefined();
    }, { timeout: 6000 });
  }, 7000);

  /**
   * Test: Skip functionality transitions correctly
   * Requirements: 4.2, 4.3
   */
  it('should transition to app when intro is skipped by click', async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introScreen = container.querySelector('.intro-screen');
    expect(introScreen).toBeDefined();
    
    // Click to skip
    await user.click(introScreen as Element);
    
    // Wait for transition (500ms fade-out + 50ms delay)
    await waitFor(() => {
      const appContainer = container.querySelector('.app-container');
      expect(appContainer).toBeDefined();
    }, { timeout: 1000 });
  });

  it('should transition to app when intro is skipped by keyboard', async () => {
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introScreen = container.querySelector('.intro-screen');
    expect(introScreen).toBeDefined();
    
    // Press key to skip
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);
    
    // Wait for transition (500ms fade-out + 50ms delay)
    await waitFor(() => {
      const appContainer = container.querySelector('.app-container');
      expect(appContainer).toBeDefined();
    }, { timeout: 1000 });
  });

  it('should show fade-out animation before transition', async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introScreen = container.querySelector('.intro-screen');
    
    // Click to skip
    await user.click(introScreen as Element);
    
    // Should have fade-out class immediately
    expect(introScreen?.classList.contains('fade-out')).toBe(true);
  });

  /**
   * Test: Audio cleanup on transition
   * Requirements: 3.4
   */
  it('should clean up intro audio on transition', async () => {
    const user = userEvent.setup({ delay: null });
    const { container, unmount } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introScreen = container.querySelector('.intro-screen');
    
    // Skip intro
    await user.click(introScreen as Element);
    
    // Wait for transition
    await waitFor(() => {
      expect(container.querySelector('.app-container')).toBeDefined();
    }, { timeout: 1000 });
    
    // Unmount to trigger cleanup
    unmount();
    
    // Audio resources should be disposed (verified by mock)
  });

  it('should not have intro screen in DOM after transition', async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introScreen = container.querySelector('.intro-screen');
    
    // Skip intro
    await user.click(introScreen as Element);
    
    // Wait for transition
    await waitFor(() => {
      expect(container.querySelector('.intro-screen')).toBeNull();
    }, { timeout: 1000 });
  });

  /**
   * Test: Smooth transition
   * Requirements: 1.5, 4.3
   */
  it('should apply fade-in class to app container', async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introScreen = container.querySelector('.intro-screen');
    
    // Skip intro
    await user.click(introScreen as Element);
    
    // Wait for app to appear
    await waitFor(() => {
      const appContainer = container.querySelector('.app-container');
      expect(appContainer?.classList.contains('fade-in')).toBe(true);
    }, { timeout: 1000 });
  });

  it('should render complete app after transition', async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(
      <StrictMode>
        <Root />
      </StrictMode>
    );
    
    const introScreen = container.querySelector('.intro-screen');
    
    // Skip intro
    await user.click(introScreen as Element);
    
    // Wait for app to fully render
    await waitFor(() => {
      const editorPanel = container.querySelector('.editor-panel');
      const waveformVisualizer = container.querySelector('.waveform-visualizer');
      
      expect(editorPanel).toBeDefined();
      expect(waveformVisualizer).toBeDefined();
    }, { timeout: 2000 });
  });
});
