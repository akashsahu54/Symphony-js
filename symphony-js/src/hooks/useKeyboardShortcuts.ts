/**
 * Keyboard shortcuts hook for Symphony.js
 */

import { useEffect } from 'react';

interface KeyboardShortcuts {
  onPlayCommit?: () => void;
  onToggleMute?: () => void;
  onClearEditor?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter - Play Commit
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        shortcuts.onPlayCommit?.();
        console.log('🎵 Keyboard shortcut: Play Commit (Ctrl+Enter)');
      }

      // Ctrl+M or Cmd+M - Toggle Mute
      if ((event.ctrlKey || event.metaKey) && (event.key === 'm' || event.key === 'M')) {
        event.preventDefault();
        event.stopPropagation();
        shortcuts.onToggleMute?.();
        console.log('🔇 Keyboard shortcut: Toggle Mute (Ctrl+M)');
      }

      // Ctrl+K or Cmd+K - Clear Editor
      if ((event.ctrlKey || event.metaKey) && (event.key === 'k' || event.key === 'K')) {
        event.preventDefault();
        event.stopPropagation();
        shortcuts.onClearEditor?.();
        console.log('🗑️ Keyboard shortcut: Clear Editor (Ctrl+K)');
      }
    };

    // Use capture phase to intercept before Monaco
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [shortcuts]);
};
