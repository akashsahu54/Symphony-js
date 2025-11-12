/**
 * Editor type definitions for Symphony.js
 */

/**
 * Supported programming languages
 */
export type LanguageType = 'javascript' | 'python';

/**
 * Props for the EditorPanel component
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
export interface EditorPanelProps {
  /** Callback triggered when code changes */
  onCodeChange: (code: string) => void;
  
  /** Programming language for syntax highlighting */
  language: LanguageType;
  
  /** Initial code to display in the editor */
  initialCode?: string;
}
