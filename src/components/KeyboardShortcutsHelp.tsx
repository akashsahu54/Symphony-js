/**
 * Keyboard Shortcuts Help component
 * Shows available keyboard shortcuts
 */

import React, { useState } from 'react';
import './KeyboardShortcutsHelp.css';

export const KeyboardShortcutsHelp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    { keys: 'Ctrl+Enter', description: 'Play Commit Composition', icon: '🎵' },
    { keys: 'Ctrl+M', description: 'Toggle Mute Bugs', icon: '🔇' },
    { keys: 'Ctrl+K', description: 'Clear Editor', icon: '🗑️' },
  ];

  return (
    <>
      <button 
        className="shortcuts-help-button"
        onClick={() => setIsVisible(!isVisible)}
        title="Keyboard Shortcuts"
      >
        ⌨️
      </button>

      {isVisible && (
        <div className="shortcuts-overlay" onClick={() => setIsVisible(false)}>
          <div className="shortcuts-panel" onClick={(e) => e.stopPropagation()}>
            <div className="shortcuts-header">
              <h3>⌨️ Keyboard Shortcuts</h3>
              <button 
                className="shortcuts-close"
                onClick={() => setIsVisible(false)}
              >
                ×
              </button>
            </div>
            <div className="shortcuts-list">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="shortcut-item">
                  <span className="shortcut-icon">{shortcut.icon}</span>
                  <span className="shortcut-keys">{shortcut.keys}</span>
                  <span className="shortcut-description">{shortcut.description}</span>
                </div>
              ))}
            </div>
            <div className="shortcuts-footer">
              <small>Press any shortcut to close this panel</small>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
