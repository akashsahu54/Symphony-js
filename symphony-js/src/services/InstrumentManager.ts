import * as Tone from 'tone';
import type { MoodData, CompositionSection } from '../types';

/**
 * InstrumentManager service
 * Manages Tone.js instruments and audio playback
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
export class InstrumentManager {
  private rhythmInstrument: Tone.MembraneSynth;
  private harmonyInstrument: Tone.PolySynth;
  private melodyInstrument: Tone.Synth;
  private errorSynth: Tone.Synth;
  private limiter: Tone.Limiter;

  constructor() {
    // Create limiter to prevent distortion from simultaneous voices
    // Requirement: 7.4 - Limit simultaneous Tone.js voices to prevent distortion
    this.limiter = new Tone.Limiter(-6).toDestination();
    // Create RhythmInstrument using Tone.MembraneSynth for drums
    // Requirement: 2.2
    this.rhythmInstrument = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 1.4,
      },
    }).connect(this.limiter);

    // Create HarmonyInstrument using Tone.PolySynth for chord pads
    // Requirement: 2.3
    // Limit polyphony to 4 voices to prevent distortion
    this.harmonyInstrument = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.5,
        decay: 0.2,
        sustain: 0.5,
        release: 2,
      },
    }).connect(this.limiter);
    
    // Set max polyphony to limit simultaneous voices
    // Requirement: 7.4 - Limit simultaneous Tone.js voices to prevent distortion
    this.harmonyInstrument.maxPolyphony = 4;

    // Create MelodyInstrument using Tone.Synth for lead notes
    // Requirement: 2.4
    this.melodyInstrument = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    }).connect(this.limiter);
    
    // Create error synth with harsh waveform for unpleasant sounds
    // Requirement: 7.3
    this.errorSynth = new Tone.Synth({
      oscillator: { type: 'sawtooth' }, // Harsh waveform
      envelope: {
        attack: 0.001,
        decay: 0.05,
        sustain: 0.8,
        release: 0.1,
      },
    }).connect(this.limiter);
  }

  /**
   * Play mood-based audio
   * Requirements: 8.5, 3.3, 3.5, 3.7, 6.3
   * 
   * Parses MoodData JSON input and triggers appropriate instruments
   * based on mood state. Sets tempo and selects notes based on rootKey.
   */
  playMood(data: MoodData): void {
    const now = Tone.now();
    
    // Parse MoodData JSON input and set Tone.Transport tempo
    // Requirement: 8.5
    Tone.getTransport().bpm.value = data.tempo;

    // Select notes based on mood.rootKey and mood.mood
    // Trigger appropriate instruments based on mood state
    // Requirements: 3.3, 3.5, 3.7
    switch (data.mood) {
      case 'DISCORDANT':
        // Requirement: 3.3 - chaotic minor-key patterns
        this.playDiscordantMood(data, now);
        break;
      case 'HARMONIOUS':
        // Requirement: 3.5 - smooth major-key chords
        this.playHarmoniousMood(data, now);
        break;
      case 'INTENSE':
        // Requirement: 3.7 - increased tempo and frequency
        this.playIntenseMood(data, now);
        break;
    }
  }

  /**
   * Play DISCORDANT mood - chaotic minor-key patterns
   * Requirements: 3.3, 3.4
   */
  private playDiscordantMood(data: MoodData, now: number): void {
    // Get minor scale notes based on root key
    const notes = this.getMinorScaleNotes(data.rootKey);
    
    // Play chaotic, dissonant patterns
    // Harsh rhythm pattern
    this.rhythmInstrument.triggerAttackRelease('C1', '8n', now);
    this.rhythmInstrument.triggerAttackRelease('C1', '16n', now + 0.15);
    
    // Dissonant harmony (minor 2nd intervals)
    const dissonantChord = [notes[0], notes[1], notes[6]]; // Root, minor 2nd, minor 7th
    this.harmonyInstrument.triggerAttackRelease(dissonantChord, '2n', now + 0.1);
    
    // Jagged melody with chromatic notes
    this.melodyInstrument.triggerAttackRelease(notes[0], '16n', now + 0.2);
    this.melodyInstrument.triggerAttackRelease(notes[1], '16n', now + 0.3);
  }

  /**
   * Play HARMONIOUS mood - smooth major-key chords
   * Requirements: 3.5, 3.6
   */
  private playHarmoniousMood(data: MoodData, now: number): void {
    // Get major scale notes based on root key
    const notes = this.getMajorScaleNotes(data.rootKey);
    
    // Play smooth, consonant patterns
    // Gentle rhythm
    this.rhythmInstrument.triggerAttackRelease('C2', '4n', now);
    
    // Major triad harmony
    const majorChord = [notes[0], notes[2], notes[4]]; // Root, major 3rd, perfect 5th
    this.harmonyInstrument.triggerAttackRelease(majorChord, '2n', now + 0.1);
    
    // Pleasant melody
    this.melodyInstrument.triggerAttackRelease(notes[0], '8n', now + 0.2);
    this.melodyInstrument.triggerAttackRelease(notes[2], '8n', now + 0.4);
    this.melodyInstrument.triggerAttackRelease(notes[4], '4n', now + 0.6);
  }

  /**
   * Play INTENSE mood - increased tempo and frequency
   * Requirements: 3.7
   */
  private playIntenseMood(data: MoodData, now: number): void {
    // Get minor scale for intensity
    const notes = this.getMinorScaleNotes(data.rootKey);
    
    // Fast, driving rhythm
    this.rhythmInstrument.triggerAttackRelease('C1', '16n', now);
    this.rhythmInstrument.triggerAttackRelease('C1', '16n', now + 0.1);
    this.rhythmInstrument.triggerAttackRelease('C1', '16n', now + 0.2);
    
    // Dense harmony with higher frequencies
    const intenseChord = [notes[0], notes[3], notes[5]]; // Root, 4th, 5th
    this.harmonyInstrument.triggerAttackRelease(intenseChord, '4n', now + 0.05);
    
    // Rapid melody with higher octave
    const highNotes = notes.map(note => this.transposeOctave(note, 1));
    this.melodyInstrument.triggerAttackRelease(highNotes[0], '16n', now + 0.1);
    this.melodyInstrument.triggerAttackRelease(highNotes[2], '16n', now + 0.2);
    this.melodyInstrument.triggerAttackRelease(highNotes[4], '16n', now + 0.3);
  }

  /**
   * Get major scale notes from root key
   * Requirement: 3.6
   */
  private getMajorScaleNotes(rootKey: string): string[] {
    const root = this.normalizeKey(rootKey);
    const intervals = [0, 2, 4, 5, 7, 9, 11]; // Major scale intervals
    return intervals.map(interval => this.transposeNote(root, interval));
  }

  /**
   * Get minor scale notes from root key
   * Requirements: 3.3, 3.4
   */
  private getMinorScaleNotes(rootKey: string): string[] {
    const root = this.normalizeKey(rootKey);
    const intervals = [0, 2, 3, 5, 7, 8, 10]; // Natural minor scale intervals
    return intervals.map(interval => this.transposeNote(root, interval));
  }

  /**
   * Normalize key to standard format (e.g., 'C4', 'Dm' -> 'D4')
   */
  private normalizeKey(key: string): string {
    // Remove 'm' suffix if present (minor indicator)
    const cleanKey = key.replace('m', '');
    // Add octave if not present
    return cleanKey.match(/\d/) ? cleanKey : `${cleanKey}4`;
  }

  /**
   * Transpose a note by semitones
   */
  private transposeNote(note: string, semitones: number): string {
    return Tone.Frequency(note).transpose(semitones).toNote();
  }

  /**
   * Transpose a note by octaves
   */
  private transposeOctave(note: string, octaves: number): string {
    return Tone.Frequency(note).transpose(octaves * 12).toNote();
  }

  /**
   * Play commit composition
   * Requirements: 4.3, 4.4, 4.5, 4.6
   * 
   * Schedules a 15-second composition using Tone.Transport.
   * Starts with steady rhythm for imports, builds melody during functions,
   * and ends with resolving chord on return statements.
   */
  playCommitComposition(sections: CompositionSection[]): void {
    // Stop any currently playing composition
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    
    // Schedule 15-second composition using Tone.Transport
    // Requirement: 4.3
    let currentTime = 0;
    
    sections.forEach((section) => {
      const startTime = currentTime;
      const duration = section.duration;
      
      // Set tempo for this section
      Tone.getTransport().bpm.value = section.tempo;
      
      switch (section.type) {
        case 'import':
          // Requirement: 4.4 - Start with steady rhythm for import sections
          this.scheduleImportSection(startTime, duration, section.notes);
          break;
          
        case 'function':
          // Requirement: 4.5 - Build melody during function sections
          this.scheduleFunctionSection(startTime, duration, section.notes);
          break;
          
        case 'return':
          // Requirement: 4.6 - End with resolving chord on return statements
          this.scheduleReturnSection(startTime, duration, section.notes);
          break;
          
        default:
          // Handle other section types with generic patterns
          this.scheduleGenericSection(startTime, duration, section.notes, section.instrument);
          break;
      }
      
      currentTime += duration;
    });
    
    // Start playback
    Tone.getTransport().start();
    
    // Stop after 15 seconds
    Tone.getTransport().stop(`+${currentTime}`);
  }
  
  /**
   * Schedule import section with steady rhythm
   * Requirement: 4.4
   */
  private scheduleImportSection(startTime: number, duration: number, notes: string[]): void {
    // Steady beat pattern for imports
    const beatInterval = 0.5; // 2 beats per second
    const numBeats = Math.floor(duration / beatInterval);
    
    for (let i = 0; i < numBeats; i++) {
      const time = startTime + (i * beatInterval);
      Tone.getTransport().schedule((t) => {
        this.rhythmInstrument.triggerAttackRelease('C2', '8n', t);
      }, time);
    }
    
    // Add subtle harmony if notes provided
    if (notes.length > 0) {
      Tone.getTransport().schedule((t) => {
        this.harmonyInstrument.triggerAttackRelease(notes.slice(0, 3), duration, t);
      }, startTime);
    }
  }
  
  /**
   * Schedule function section with building melody
   * Requirement: 4.5
   */
  private scheduleFunctionSection(startTime: number, duration: number, notes: string[]): void {
    // Build melody during function sections
    if (notes.length === 0) return;
    
    const noteInterval = duration / notes.length;
    
    notes.forEach((note, index) => {
      const time = startTime + (index * noteInterval);
      
      // Melody instrument for lead notes
      Tone.getTransport().schedule((t) => {
        this.melodyInstrument.triggerAttackRelease(note, '8n', t);
      }, time);
      
      // Add rhythm support
      if (index % 2 === 0) {
        Tone.getTransport().schedule((t) => {
          this.rhythmInstrument.triggerAttackRelease('C1', '16n', t);
        }, time);
      }
    });
    
    // Add harmony chord progression
    if (notes.length >= 3) {
      const chord = [notes[0], notes[Math.floor(notes.length / 2)], notes[notes.length - 1]];
      Tone.getTransport().schedule((t) => {
        this.harmonyInstrument.triggerAttackRelease(chord, duration * 0.8, t);
      }, startTime);
    }
  }
  
  /**
   * Schedule return section with resolving chord
   * Requirement: 4.6
   */
  private scheduleReturnSection(startTime: number, duration: number, notes: string[]): void {
    // End with resolving chord on return statements
    if (notes.length >= 3) {
      // Create a major triad for resolution
      const resolvingChord = notes.slice(0, 3);
      
      Tone.getTransport().schedule((t) => {
        this.harmonyInstrument.triggerAttackRelease(resolvingChord, duration, t);
      }, startTime);
      
      // Add final melody note
      Tone.getTransport().schedule((t) => {
        this.melodyInstrument.triggerAttackRelease(notes[0], duration * 0.5, t);
      }, startTime + duration * 0.3);
      
      // Final rhythm hit
      Tone.getTransport().schedule((t) => {
        this.rhythmInstrument.triggerAttackRelease('C2', '4n', t);
      }, startTime);
    }
  }
  
  /**
   * Schedule generic section based on instrument type
   */
  private scheduleGenericSection(
    startTime: number,
    duration: number,
    notes: string[],
    instrument: 'rhythm' | 'harmony' | 'melody'
  ): void {
    if (notes.length === 0) return;
    
    switch (instrument) {
      case 'rhythm':
        Tone.getTransport().schedule((t) => {
          this.rhythmInstrument.triggerAttackRelease('C1', '8n', t);
        }, startTime);
        break;
        
      case 'harmony':
        Tone.getTransport().schedule((t) => {
          this.harmonyInstrument.triggerAttackRelease(notes.slice(0, 3), duration, t);
        }, startTime);
        break;
        
      case 'melody':
        const noteInterval = duration / notes.length;
        notes.forEach((note, index) => {
          const time = startTime + (index * noteInterval);
          Tone.getTransport().schedule((t) => {
            this.melodyInstrument.triggerAttackRelease(note, '16n', t);
          }, time);
        });
        break;
    }
  }

  /**
   * Play pleasant sound for correct code
   * Requirements: 7.1, 7.2
   * 
   * Creates a harmonious "ding" sound using melody instrument.
   * Triggered on valid function with return true pattern.
   * Uses major key with short attack envelope.
   */
  playPleasantSound(): void {
    const now = Tone.now();
    
    // Create harmonious "ding" sound using melody instrument
    // Requirement: 7.1, 7.2
    // Use major key (C major triad: C, E, G)
    const pleasantNotes = ['C5', 'E5', 'G5'];
    
    // Play ascending arpeggio with short attack envelope
    pleasantNotes.forEach((note, index) => {
      const time = now + (index * 0.08);
      this.melodyInstrument.triggerAttackRelease(note, '16n', time);
    });
    
    // Add a final resolving note
    this.melodyInstrument.triggerAttackRelease('C6', '8n', now + 0.24);
    
    // Add subtle harmony for richness
    this.harmonyInstrument.triggerAttackRelease(['C4', 'E4', 'G4'], '4n', now);
  }
  
  /**
   * Play unpleasant sound for error code
   * Requirement: 7.3
   * 
   * Creates a jagged buzzing sound using dissonant intervals.
   * Triggered on syntax errors or malformed code.
   * Uses harsh waveform (sawtooth).
   */
  playUnpleasantSound(): void {
    const now = Tone.now();
    
    // Create jagged buzzing sound using dissonant intervals
    // Requirement: 7.3
    // Use dissonant intervals (minor 2nd, tritone)
    const dissonantNotes = ['C3', 'Db3', 'F#3'];
    
    // Play harsh, overlapping notes with sawtooth waveform
    dissonantNotes.forEach((note, index) => {
      const time = now + (index * 0.05);
      this.errorSynth.triggerAttackRelease(note, '8n', time);
    });
    
    // Add jarring rhythm hit
    this.rhythmInstrument.triggerAttackRelease('C1', '32n', now);
    this.rhythmInstrument.triggerAttackRelease('C1', '32n', now + 0.08);
    
    // Add dissonant harmony cluster
    this.harmonyInstrument.triggerAttackRelease(['C2', 'Db2', 'D2'], '16n', now + 0.05);
  }
  
  /**
   * Get rhythm instrument
   */
  getRhythmInstrument(): Tone.MembraneSynth {
    return this.rhythmInstrument;
  }

  /**
   * Get harmony instrument
   */
  getHarmonyInstrument(): Tone.PolySynth {
    return this.harmonyInstrument;
  }

  /**
   * Get melody instrument
   */
  getMelodyInstrument(): Tone.Synth {
    return this.melodyInstrument;
  }

  /**
   * Dispose of all instruments and clean up resources
   */
  dispose(): void {
    this.rhythmInstrument.dispose();
    this.harmonyInstrument.dispose();
    this.melodyInstrument.dispose();
    this.errorSynth.dispose();
    this.limiter.dispose();
  }
}
