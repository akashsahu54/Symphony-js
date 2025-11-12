import { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';
import { IntroLogo } from './IntroLogo';
import './IntroScreen.css';

interface IntroScreenProps {
  onComplete: () => void;
}

// Check if Web Audio API is supported
const canPlayAudio = (): boolean => {
  return !!(window.AudioContext || (window as any).webkitAudioContext);
};

const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const [displayedText, setDisplayedText] = useState(prefersReducedMotion ? 'Symphony.js' : '');
  const [showCursor, setShowCursor] = useState(!prefersReducedMotion);
  const [showTagline, setShowTagline] = useState(prefersReducedMotion);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const fullText = 'Symphony.js';
  const typewriterDelay = 100; // ms between characters
  
  // Audio refs
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const volumeNodeRef = useRef<Tone.Volume | null>(null);
  const audioInitializedRef = useRef(false);

  // Initialize audio system
  useEffect(() => {
    const initAudio = async () => {
      if (!canPlayAudio()) {
        console.warn('Web Audio API not supported. Continuing with visual-only intro.');
        return;
      }

      try {
        // Start Tone.js audio context
        await Tone.start();
        
        // Create volume node for fade control
        const volumeNode = new Tone.Volume(-60).toDestination(); // Start at -60dB (near silence)
        volumeNodeRef.current = volumeNode;
        
        // Create PolySynth with soft sine wave
        const synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.5,
            decay: 0.2,
            sustain: 0.5,
            release: 1
          }
        }).connect(volumeNode);
        
        synthRef.current = synth;
        audioInitializedRef.current = true;
        
        // Play C major ascending arpeggio
        const melody = ['C4', 'E4', 'G4', 'C5'];
        const now = Tone.now();
        
        melody.forEach((note, index) => {
          synth.triggerAttackRelease(note, '0.5', now + index * 0.5);
        });
        
        // Fade in over 2 seconds
        volumeNode.volume.rampTo(-12, 2, now); // Ramp to -12dB over 2 seconds
        
      } catch (error) {
        console.warn('Failed to initialize audio:', error);
      }
    };

    initAudio();
    
    // Cleanup audio on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
      if (volumeNodeRef.current) {
        volumeNodeRef.current.dispose();
        volumeNodeRef.current = null;
      }
      audioInitializedRef.current = false;
    };
  }, []);

  // Typewriter effect (skip if reduced motion is preferred)
  useEffect(() => {
    // Skip typewriter animation if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }
    
    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, typewriterDelay);
      return () => clearTimeout(timeout);
    } else {
      // Title complete, hide cursor and show tagline
      setShowCursor(false);
      const taglineTimeout = setTimeout(() => {
        setShowTagline(true);
      }, 500);
      return () => clearTimeout(taglineTimeout);
    }
  }, [displayedText, prefersReducedMotion]);

  // Auto-complete after 5 seconds with fade-out
  useEffect(() => {
    const timer = setTimeout(() => {
      // Start fade-out animation
      setIsFadingOut(true);
      
      // Fade out audio before completing
      if (audioInitializedRef.current && volumeNodeRef.current) {
        volumeNodeRef.current.volume.rampTo(-60, 0.5, Tone.now());
      }
      
      // Wait for fade-out to complete (500ms CSS transition)
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Skip on keyboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      
      // Start fade-out animation
      setIsFadingOut(true);
      
      // Immediately stop audio on skip
      if (audioInitializedRef.current && synthRef.current) {
        synthRef.current.releaseAll();
      }
      if (audioInitializedRef.current && volumeNodeRef.current) {
        volumeNodeRef.current.volume.value = -60; // Immediate silence
      }
      
      // Wait for fade-out to complete (500ms CSS transition)
      setTimeout(() => {
        onComplete();
      }, 500);
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onComplete]);

  const handleClick = () => {
    // Start fade-out animation
    setIsFadingOut(true);
    
    // Immediately stop audio on skip
    if (audioInitializedRef.current && synthRef.current) {
      synthRef.current.releaseAll();
    }
    if (audioInitializedRef.current && volumeNodeRef.current) {
      volumeNodeRef.current.volume.value = -60; // Immediate silence
    }
    
    // Wait for fade-out to complete (500ms CSS transition)
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div 
      className={`intro-screen ${isFadingOut ? 'fade-out' : ''}`}
      onClick={handleClick}
      role="dialog"
      aria-label="Symphony.js intro screen"
      aria-live="polite"
      tabIndex={0}
    >
      <div className="intro-content" role="presentation">
        <IntroLogo />
        
        <h1 className="intro-title" aria-label="Symphony.js">
          {displayedText}
          {showCursor && <span className="cursor" aria-hidden="true">|</span>}
        </h1>
        
        {showTagline && (
          <p className="intro-tagline" role="presentation">
            Stop looking for bugs... and start listening for them!
          </p>
        )}
      </div>
      
      <div 
        className="skip-instruction"
        role="button"
        aria-label="Skip intro - Press any key or click to continue"
        tabIndex={0}
      >
        Skip - Press any key
      </div>
    </div>
  );
};

export default IntroScreen;
