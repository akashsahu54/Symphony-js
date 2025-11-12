/**
 * App component for Symphony.js
 * Requirements: 1.5, 5.4
 */

import { useState, useEffect } from 'react';
import { AudioEngineProvider, useAudioEngine } from './contexts/AudioEngineContext';
import { EditorPanel } from './components/EditorPanel';
import { WaveformVisualizer } from './components/WaveformVisualizer';
import { CodeQualityIndicator } from './components/CodeQualityIndicator';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import './App.css';

/**
 * Check if Web Audio API is supported
 * Requirements: 7.4
 */
const isAudioSupported = (): boolean => {
  return !!(window.AudioContext || (window as any).webkitAudioContext);
};

/**
 * AppContent component - inner component that can access AudioEngine context
 * Requirements: 7.4
 */
function AppContent() {
  const [showWarning, setShowWarning] = useState(false);
  const { audioError } = useAudioEngine();

  useEffect(() => {
    // Add browser audio support detection
    // Requirements: 7.4 - Check for Web Audio API support on component mount
    const supported = isAudioSupported();
    setShowWarning(!supported);
    
    if (!supported) {
      console.error('Web Audio API is not supported in this browser');
    }
  }, []);

  // Show warning if browser doesn't support audio or if there's an audio error
  const shouldShowWarning = showWarning || audioError !== null;
  const warningMessage = audioError || 'Web Audio API is not supported in your browser. Audio features will be disabled.';

  return (
    <div className="app">
      {/* Add browser audio support detection and warning message */}
      {/* Requirements: 7.4 - Provide visual-only fallback if audio unavailable */}
      {shouldShowWarning && (
        <div className="audio-warning">
          <div className="warning-content">
            <span className="warning-icon">⚠️</span>
            <span className="warning-text">
              {warningMessage}
            </span>
            <button 
              className="warning-close"
              onClick={() => setShowWarning(false)}
              aria-label="Close warning"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Create split-screen layout with CSS Grid */}
      <div className="split-screen-layout">
        {/* Position EditorPanel on left (50% width) */}
        <div className="left-panel">
          <EditorPanel />
        </div>

        {/* Position VisualizerPanel on right (50% width) */}
        <div className="right-panel">
          <CodeQualityIndicator />
          <WaveformVisualizer />
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />
    </div>
  );
}

/**
 * App component - wraps AppContent with AudioEngineProvider
 * Requirements: 1.5, 5.4, 7.4
 */
function App() {
  return (
    <AudioEngineProvider>
      <AppContent />
    </AudioEngineProvider>
  );
}

export default App;
