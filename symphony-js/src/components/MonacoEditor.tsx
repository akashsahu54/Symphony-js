/**
 * MonacoEditor wrapper component for Symphony.js
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import React from 'react';
import Editor from '@monaco-editor/react';
import type { LanguageType } from '../types/editor';
import './MonacoOverrides.css';

interface MonacoEditorProps {
  /** Current code value */
  value: string;
  
  /** Callback when code changes */
  onChange: (value: string | undefined) => void;
  
  /** Programming language for syntax highlighting */
  language: LanguageType;
}

/**
 * MonacoEditor component
 * Wraps Monaco Editor with dark theme and language support
 */
export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language
}) => {
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Remove Ctrl+K keybinding from Monaco to allow our custom shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      // Do nothing - let our custom handler work
      // This prevents Monaco from capturing Ctrl+K
    });

    // Add custom Cut action to context menu
    editor.addAction({
      id: 'custom.cut',
      label: 'Cut',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX],
      contextMenuGroupId: '9_cutcopypaste',
      contextMenuOrder: 1,
      run: (ed: any) => {
        const selection = ed.getSelection();
        const selectedText = ed.getModel().getValueInRange(selection);
        
        // Copy to clipboard
        navigator.clipboard.writeText(selectedText).then(() => {
          // Delete selected text
          ed.executeEdits('', [{
            range: selection,
            text: '',
            forceMoveMarkers: true
          }]);
        }).catch(() => {
          // Fallback
          document.execCommand('cut');
        });
      }
    });

    // Add custom Copy action to context menu
    editor.addAction({
      id: 'custom.copy',
      label: 'Copy',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC],
      contextMenuGroupId: '9_cutcopypaste',
      contextMenuOrder: 2,
      run: (ed: any) => {
        const selection = ed.getSelection();
        const selectedText = ed.getModel().getValueInRange(selection);
        
        navigator.clipboard.writeText(selectedText).catch(() => {
          // Fallback
          document.execCommand('copy');
        });
      }
    });

    // Add custom Paste action to context menu
    editor.addAction({
      id: 'custom.paste',
      label: 'Paste',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV],
      contextMenuGroupId: '9_cutcopypaste',
      contextMenuOrder: 3,
      run: async (ed: any) => {
        try {
          const text = await navigator.clipboard.readText();
          const selection = ed.getSelection();
          ed.executeEdits('', [{
            range: selection,
            text: text,
            forceMoveMarkers: true
          }]);
        } catch (err) {
          // Fallback to execCommand
          document.execCommand('paste');
        }
      }
    });

    // Log that editor is ready
    console.log('✅ Monaco Editor mounted with custom context menu');
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        readOnly: false,
        contextmenu: true,
        // Ensure selection and clipboard work
        selectOnLineNumbers: true,
        selectionHighlight: true,
        wordWrap: 'off',
      }}
    />
  );
};
