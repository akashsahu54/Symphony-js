/**
 * CodeQualityIndicator component
 * Displays real-time code quality metrics based on mood
 */

import React from 'react';
import { useAudioEngine } from '../contexts/AudioEngineContext';
import './CodeQualityIndicator.css';

export const CodeQualityIndicator: React.FC = () => {
  const { currentMood } = useAudioEngine();

  if (!currentMood) {
    return (
      <div className="quality-indicator">
        <div className="quality-header">Code Health</div>
        <div className="quality-waiting">Waiting for code...</div>
      </div>
    );
  }

  const getMoodColor = () => {
    switch (currentMood.mood) {
      case 'HARMONIOUS':
        return '#00ff88';
      case 'DISCORDANT':
        return '#ff4444';
      case 'INTENSE':
        return '#ff00ff';
      default:
        return '#0e639c';
    }
  };

  const getMoodIcon = () => {
    switch (currentMood.mood) {
      case 'HARMONIOUS':
        return '✨';
      case 'DISCORDANT':
        return '⚠️';
      case 'INTENSE':
        return '🔥';
      default:
        return '🎵';
    }
  };

  const getMoodLabel = () => {
    switch (currentMood.mood) {
      case 'HARMONIOUS':
        return 'Harmonious';
      case 'DISCORDANT':
        return 'Discordant';
      case 'INTENSE':
        return 'Intense';
      default:
        return 'Unknown';
    }
  };

  const intensityPercentage = Math.round(currentMood.intensity * 100);
  const moodColor = getMoodColor();

  return (
    <div className="quality-indicator">
      <div className="quality-header">
        <span className="quality-icon">{getMoodIcon()}</span>
        <span>Code Health</span>
      </div>

      <div className="quality-content">
        {/* Mood Status */}
        <div className="quality-row">
          <span className="quality-label">Mood:</span>
          <span 
            className="quality-value mood-badge" 
            style={{ backgroundColor: moodColor }}
          >
            {getMoodLabel()}
          </span>
        </div>

        {/* Intensity Bar */}
        <div className="quality-row">
          <span className="quality-label">Intensity:</span>
          <div className="intensity-bar-container">
            <div 
              className="intensity-bar-fill" 
              style={{ 
                width: `${intensityPercentage}%`,
                backgroundColor: moodColor 
              }}
            />
            <span className="intensity-value">{intensityPercentage}%</span>
          </div>
        </div>

        {/* Tempo */}
        <div className="quality-row">
          <span className="quality-label">Tempo:</span>
          <span className="quality-value">{Math.round(currentMood.tempo)} BPM</span>
        </div>

        {/* Musical Key */}
        <div className="quality-row">
          <span className="quality-label">Key:</span>
          <span className="quality-value">{currentMood.rootKey}</span>
        </div>
      </div>

      {/* Health Bar */}
      <div className="health-bar-container">
        <div 
          className="health-bar" 
          style={{ 
            width: currentMood.mood === 'HARMONIOUS' ? '100%' : 
                   currentMood.mood === 'INTENSE' ? '60%' : '20%',
            backgroundColor: moodColor 
          }}
        />
      </div>
    </div>
  );
};
