/**
 * Terminal component for Symphony.js
 * Displays code execution output
 */

import React from 'react';
import './Terminal.css';

interface TerminalProps {
  output: string;
  isRunning: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ output, isRunning }) => {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-title">
          <span className="terminal-icon">▶</span>
          <span>Output</span>
        </div>
        <div className="terminal-status">
          {isRunning && (
            <span className="status-running">
              <span className="spinner"></span>
              Running...
            </span>
          )}
        </div>
      </div>
      <div className="terminal-content">
        {output ? (
          <pre className="terminal-output">{output}</pre>
        ) : (
          <div className="terminal-placeholder">
            Click the run button to execute your code
          </div>
        )}
      </div>
    </div>
  );
};
