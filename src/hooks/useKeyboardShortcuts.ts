import { useEffect } from 'react';

type KeyboardShortcuts = {
  [key: string]: (e: KeyboardEvent) => void;
};

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = [];
      
      if (e.ctrlKey || e.metaKey) key.push('ctrl');
      if (e.shiftKey) key.push('shift');
      if (e.key.length === 1) key.push(e.key.toLowerCase());
      else key.push(e.key.toLowerCase());
      
      const shortcutKey = key.join('+');
      
      if (shortcuts[shortcutKey]) {
        shortcuts[shortcutKey](e);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};