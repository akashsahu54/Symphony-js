/**
 * ControlBar component for Symphony.js
 * Requirements: 4.1, 4.2, 6.1, 6.2
 */

import React from 'react';
import './ControlBar.css';

interface ControlBarProps {
  /** Callback when "Play Commit" button is clicked */
  onPlayCommit: () => void;
  
  /** Callback when "Mute Bugs" button is clicked */
  onToggleMuteBugs: () => void;
  
  /** Current mute state for bugs */
  isBugsMuted: boolean;
  
  /** Callback when "Run Code" button is clicked */
  onRunCode?: () => void;
  
  /** Whether code is currently running */
  isRunning?: boolean;
}

/**
 * ControlBar component
 * Provides action buttons for playing commit compositions and muting bug sounds
 */
export const ControlBar: React.FC<ControlBarProps> = ({
  onPlayCommit,
  onToggleMuteBugs,
  isBugsMuted,
  onRunCode,
  isRunning = false
}) => {
  return (
    <div className="control-bar">
      {onRunCode && (
        <button 
          className={`control-button run-code ${isRunning ? 'running' : ''}`}
          onClick={onRunCode}
          disabled={isRunning}
          title="Run your code and see the output"
        >
          <span className="run-triangle">▶</span>
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      )}
      
      <button 
        className="control-button play-commit"
        onClick={onPlayCommit}
        title="Play a 15-second musical composition of your entire file"
      >
        🎵 Play Commit
      </button>
      
      <button 
        className={`control-button mute-bugs ${isBugsMuted ? 'active' : ''}`}
        onClick={onToggleMuteBugs}
        title={isBugsMuted ? 'Unmute error sounds' : 'Mute error sounds'}
      >
        {isBugsMuted ? '🔇' : '🔊'} {isBugsMuted ? 'Unmute' : 'Mute'} Bugs
      </button>
    </div>
  );
};
