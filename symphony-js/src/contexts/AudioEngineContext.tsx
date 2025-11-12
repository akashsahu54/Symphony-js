import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import type { MoodData, CompositionSection } from '../types';
import { InstrumentManager } from '../services/InstrumentManager';
import { performanceMonitor } from '../utils/performanceMonitor';

/**
 * AudioEngine context interface
 * Requirements: 2.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4
 */
interface AudioEngineContextType {
  playMood: (data: MoodData) => void;
  playCommitComposition: (sections: CompositionSection[]) => void;
  toggleMuteBugs: () => void;
  playPleasantSound: () => void;
  playUnpleasantSound: () => void;
  clearMood: () => void;
  isBugsMuted: boolean;
  isInitialized: boolean;
  audioError: string | null;
  currentMood: MoodData | null;
}

const AudioEngineContext = createContext<AudioEngineContextType | undefined>(undefined);

/**
 * AudioEngine provider component
 * Manages audio initialization, state, and playback
 * Requirements: 7.4
 */
export const AudioEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBugsMuted, setIsBugsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodData | null>(null);
  const instrumentManagerRef = useRef<InstrumentManager | null>(null);

  // Initialize audio engine on mount
  // Requirements: 7.4 - Check for Web Audio API support
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Check for Web Audio API support
        if (!window.AudioContext && !(window as any).webkitAudioContext) {
          const errorMsg = 'Web Audio API is not supported in this browser';
          setAudioError(errorMsg);
          console.error(errorMsg);
          return;
        }

        // Create instrument manager
        instrumentManagerRef.current = new InstrumentManager();
        setIsInitialized(true);
        console.log('Audio engine initialized successfully');
      } catch (error) {
        const errorMsg = `Failed to initialize audio engine: ${error instanceof Error ? error.message : String(error)}`;
        setAudioError(errorMsg);
        console.error(errorMsg, error);
      }
    };

    initAudio();

    // Cleanup on unmount
    return () => {
      if (instrumentManagerRef.current) {
        instrumentManagerRef.current.dispose();
      }
    };
  }, []);

  /**
   * Start Tone.js audio context
   * Required for browser audio to work
   * Requirements: 7.4 - Implement try-catch around Tone.start()
   */
  const ensureAudioStarted = useCallback(async () => {
    try {
      if (Tone.context.state !== 'running') {
        await Tone.start();
        console.log('Audio context started successfully');
      }
    } catch (error) {
      const errorMsg = `Failed to start audio context: ${error instanceof Error ? error.message : String(error)}`;
      setAudioError(errorMsg);
      console.error(errorMsg, error);
      throw error; // Re-throw to be caught by calling functions
    }
  }, []);

  /**
   * Play mood-based audio
   * Requirements: 2.1, 6.3, 7.4
   */
  const playMood = useCallback(async (data: MoodData) => {
    if (!instrumentManagerRef.current) {
      console.warn('Audio engine not initialized, skipping mood playback');
      return;
    }

    const startTime = performance.now();

    try {
      await ensureAudioStarted();
      
      // Update current mood state for visualizer
      setCurrentMood(data);
      
      // Skip DISCORDANT sounds if bugs are muted
      if (data.mood === 'DISCORDANT' && isBugsMuted) {
        return;
      }

      instrumentManagerRef.current.playMood(data);
      
      // Record audio latency for performance monitoring
      const latency = performance.now() - startTime;
      performanceMonitor.recordAudioLatency(latency);
    } catch (error) {
      const errorMsg = `Error playing mood: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg, error);
      setAudioError(errorMsg);
    }
  }, [isBugsMuted, ensureAudioStarted]);

  /**
   * Play commit composition
   * Requirements: 4.3, 4.4, 4.5, 4.6, 7.4
   */
  const playCommitComposition = useCallback(async (sections: CompositionSection[]) => {
    if (!instrumentManagerRef.current) {
      console.warn('Audio engine not initialized, skipping commit composition');
      return;
    }

    try {
      await ensureAudioStarted();
      instrumentManagerRef.current.playCommitComposition(sections);
    } catch (error) {
      const errorMsg = `Error playing commit composition: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg, error);
      setAudioError(errorMsg);
    }
  }, [ensureAudioStarted]);

  /**
   * Toggle mute state for bug/error sounds
   * Requirements: 6.2, 6.4
   */
  const toggleMuteBugs = useCallback(() => {
    setIsBugsMuted(prev => !prev);
  }, []);

  /**
   * Play pleasant sound for correct code
   * Requirements: 7.1, 7.2, 7.4
   */
  const playPleasantSound = useCallback(async () => {
    if (!instrumentManagerRef.current) {
      console.warn('Audio engine not initialized, skipping pleasant sound');
      return;
    }

    try {
      await ensureAudioStarted();
      instrumentManagerRef.current.playPleasantSound();
    } catch (error) {
      const errorMsg = `Error playing pleasant sound: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg, error);
      setAudioError(errorMsg);
    }
  }, [ensureAudioStarted]);

  /**
   * Play unpleasant sound for error code
   * Requirements: 7.3, 7.4
   */
  const playUnpleasantSound = useCallback(async () => {
    if (!instrumentManagerRef.current) {
      console.warn('Audio engine not initialized, skipping unpleasant sound');
      return;
    }

    try {
      await ensureAudioStarted();
      
      // Respect isBugsMuted state
      if (isBugsMuted) {
        return;
      }
      
      instrumentManagerRef.current.playUnpleasantSound();
    } catch (error) {
      const errorMsg = `Error playing unpleasant sound: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg, error);
      setAudioError(errorMsg);
    }
  }, [isBugsMuted, ensureAudioStarted]);

  /**
   * Clear mood state (for empty editor)
   */
  const clearMood = useCallback(() => {
    setCurrentMood(null);
  }, []);

  const value: AudioEngineContextType = {
    playMood,
    playCommitComposition,
    toggleMuteBugs,
    playPleasantSound,
    playUnpleasantSound,
    clearMood,
    isBugsMuted,
    isInitialized,
    audioError,
    currentMood,
  };

  return (
    <AudioEngineContext.Provider value={value}>
      {children}
    </AudioEngineContext.Provider>
  );
};

/**
 * Hook to access AudioEngine context
 */
export const useAudioEngine = (): AudioEngineContextType => {
  const context = useContext(AudioEngineContext);
  if (!context) {
    throw new Error('useAudioEngine must be used within AudioEngineProvider');
  }
  return context;
};
