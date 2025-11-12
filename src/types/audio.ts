/**
 * Audio type definitions for Symphony.js
 */

/**
 * Mood state classification for code quality
 */
export type MoodState = 'DISCORDANT' | 'HARMONIOUS' | 'INTENSE';

/**
 * Mood data structure containing musical parameters
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */
export interface MoodData {
  /** Tempo in beats per minute (60-180 BPM) */
  tempo: number;
  
  /** Musical key (e.g., 'C', 'Dm', 'F#') */
  rootKey: string;
  
  /** Intensity level (0.0-1.0) representing code complexity */
  intensity: number;
  
  /** Current mood state */
  mood: MoodState;
}

/**
 * Audio engine state
 */
export interface AudioState {
  /** Whether audio is currently playing */
  isPlaying: boolean;
  
  /** Whether bug/error sounds are muted */
  isBugsMuted: boolean;
  
  /** Current mood state */
  currentMood: MoodState;
  
  /** Volume level (0.0-1.0) */
  volume: number;
}
