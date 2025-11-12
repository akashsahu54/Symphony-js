/**
 * EditorPanel component for Symphony.js
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 4.1, 4.2, 6.1, 6.2, 7.4
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MonacoEditor } from './MonacoEditor';
import { ControlBar } from './ControlBar';
import { Terminal } from './Terminal';
import { useDebounce } from '../hooks/useDebounce';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAudioEngine } from '../contexts/AudioEngineContext';
import { analyze, analyzeForComposition } from '../services/CodeAnalyzer';
import { runPythonCode } from '../services/PythonRunner';
import { getExamplesByLanguage } from '../data/codeExamples';
import { detectLanguage } from '../utils/languageDetector';
import type { LanguageType } from '../types/editor';
import './EditorPanel.css';

interface EditorPanelProps {
  /** Initial code to display */
  initialCode?: string;
  
  /** Initial language */
  initialLanguage?: LanguageType;
}

/**
 * EditorPanel component
 * Main code editor with Monaco Editor, control buttons, and audio integration
 */
export const EditorPanel: React.FC<EditorPanelProps> = ({
  initialCode = '',
  initialLanguage = 'javascript'
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<LanguageType>(initialLanguage);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const { playMood, playCommitComposition, toggleMuteBugs, isBugsMuted, clearMood } = useAudioEngine();

  /**
   * Handle code analysis and audio playback
   * Requirements: 3.1, 7.4
   */
  const handleCodeAnalysis = useCallback((newCode: string) => {
    // Check if code is empty or just placeholder
    const trimmedCode = newCode.trim();
    const isPlaceholder = trimmedCode === '// Start typing your code here...' || 
                         trimmedCode.startsWith('// Start typing') ||
                         trimmedCode.length === 0;
    
    if (isPlaceholder) {
      // Clear mood to show "Waiting for code..." state
      clearMood();
      return;
    }

    // Trigger CodeAnalyzer.analyze on debounced changes
    const moodData = analyze(newCode, language);
    
    // Pass MoodData to AudioEngine.playMood
    playMood(moodData);
  }, [language, playMood, clearMood]);

  // Create debounce hook for onChange events
  // Requirement: 7.4 - Optimized to 300ms for better responsiveness
  const debouncedAnalysis = useDebounce(handleCodeAnalysis, 300);

  /**
   * Handle editor changes
   * Requirements: 3.1
   * Auto-detects language from code content
   */
  const handleEditorChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    
    // Auto-detect language from code content
    if (newCode.trim().length > 20) { // Only detect if there's enough code
      const detectedLang = detectLanguage(newCode);
      if (detectedLang !== language) {
        console.log(`🔍 Auto-detected language: ${detectedLang}`);
        setLanguage(detectedLang);
      }
    }
    
    // Trigger debounced analysis
    debouncedAnalysis(newCode);
  }, [debouncedAnalysis, language]);

  /**
   * Handle "Play Commit" button click
   * Requirements: 4.1, 4.2
   */
  const handlePlayCommit = useCallback(() => {
    if (!code || code.trim().length === 0) {
      return;
    }

    // Wire "Play Commit" to analyzeForComposition and playCommitComposition
    const sections = analyzeForComposition(code, language);
    playCommitComposition(sections);
  }, [code, language, playCommitComposition]);

  /**
   * Handle example selection
   * Auto-switches language based on example
   */
  const handleExampleSelect = useCallback((exampleId: string) => {
    const examples = getExamplesByLanguage(language);
    const example = examples.find(ex => ex.id === exampleId);
    if (example) {
      // Auto-switch language to match example
      if (example.language !== language) {
        console.log(`🔄 Switching language to: ${example.language}`);
        setLanguage(example.language);
      }
      setCode(example.code);
      // Trigger immediate analysis for programmatic code changes
      handleCodeAnalysis(example.code);
    }
  }, [language, handleCodeAnalysis]);

  /**
   * Handle clear editor
   */
  const handleClearEditor = useCallback(() => {
    const clearedCode = '';
    setCode(clearedCode);
    setTerminalOutput(''); // Clear terminal output too
    // Trigger immediate analysis to reset to default state
    handleCodeAnalysis(clearedCode);
  }, [handleCodeAnalysis]);

  /**
   * Handle code execution
   * Runs JavaScript or Python code
   */
  const handleRunCode = useCallback(async () => {
    if (!code || code.trim().length === 0) {
      setTerminalOutput('Error: No code to run');
      return;
    }

    setIsRunning(true);
    setTerminalOutput('Running...');

    try {
      let output = '';
      
      if (language === 'javascript') {
        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: any[]) => {
          logs.push(args.map(arg => String(arg)).join(' '));
        };

        try {
          // Execute the code
          eval(code);
          output = logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)';
        } catch (error: any) {
          output = `JavaScript Error:\n${error.message}`;
        } finally {
          console.log = originalLog;
        }
      } else if (language === 'python') {
        // Run Python code using Pyodide
        setTerminalOutput('Loading Python runtime...');
        output = await runPythonCode(code);
      }

      setTerminalOutput(output);
    } catch (error: any) {
      setTerminalOutput(`Execution Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onPlayCommit: handlePlayCommit,
    onToggleMute: toggleMuteBugs,
    onClearEditor: handleClearEditor,
  });

  // Re-analyze code when language changes
  useEffect(() => {
    if (code && code.trim().length > 0) {
      handleCodeAnalysis(code);
    }
  }, [language]); // Only trigger on language change, not code change

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <div className="header-left">
          <div className={`language-detector ${!code || code.trim().length === 0 ? 'hidden' : ''}`}>
            <span className="language-icon">🔍</span>
            <span className="language-label">Detected:</span>
            <span className={`language-badge ${language}`}>
              {language === 'javascript' ? 'JavaScript' : 'Python'}
            </span>
          </div>
          
          <div className="supported-languages">
            <span className="support-icon">💡</span>
            <span className="support-text">Supports: JavaScript & Python</span>
          </div>
        </div>
        
        <div className="example-selector">
          <select 
            onChange={(e) => handleExampleSelect(e.target.value)}
            defaultValue=""
            className="example-dropdown"
          >
            <option value="" disabled>Try Examples...</option>
            {getExamplesByLanguage(language).map(example => (
              <option key={example.id} value={example.id}>
                {example.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <ControlBar
        onPlayCommit={handlePlayCommit}
        onToggleMuteBugs={toggleMuteBugs}
        isBugsMuted={isBugsMuted}
        onRunCode={handleRunCode}
        isRunning={isRunning}
      />
      
      <div className="editor-container">
        <MonacoEditor
          value={code}
          onChange={handleEditorChange}
          language={language}
        />
      </div>
      
      <Terminal output={terminalOutput} isRunning={isRunning} />
    </div>
  );
};
