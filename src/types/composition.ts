/**
 * Composition type definitions for Symphony.js
 */

/**
 * Type of code section in a composition
 */
export type SectionType = 'import' | 'function' | 'return' | 'loop' | 'conditional' | 'other';

/**
 * Instrument type for audio playback
 */
export type InstrumentType = 'rhythm' | 'harmony' | 'melody';

/**
 * Composition section representing a part of the code
 * Requirements: 4.3, 4.4, 4.5, 4.6
 */
export interface CompositionSection {
  /** Type of code section */
  type: SectionType;
  
  /** Starting line number in the code */
  startLine: number;
  
  /** Ending line number in the code */
  endLine: number;
  
  /** Duration in seconds allocated in 15s composition */
  duration: number;
  
  /** Array of note names (e.g., ['C4', 'E4', 'G4']) */
  notes: string[];
  
  /** Tempo for this section */
  tempo: number;
  
  /** Instrument to use for this section */
  instrument: InstrumentType;
}
