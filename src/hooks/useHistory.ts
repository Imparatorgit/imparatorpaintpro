import { useState } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T | null;
  future: T[];
}

interface UseHistoryResult<T> {
  state: T | null;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: HistoryState<T>;
}

export const useHistory = <T>(initialState: T | null = null): UseHistoryResult<T> => {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const setState = (newState: T) => {
    setHistory((prevHistory) => ({
      past: [...prevHistory.past, prevHistory.present].filter(Boolean) as T[],
      present: newState,
      future: [],
    }));
  };

  const undo = () => {
    if (!canUndo) return;

    setHistory((prevHistory) => {
      const previous = prevHistory.past[prevHistory.past.length - 1];
      const newPast = prevHistory.past.slice(0, prevHistory.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prevHistory.present, ...prevHistory.future].filter(Boolean) as T[],
      };
    });
  };

  const redo = () => {
    if (!canRedo) return;

    setHistory((prevHistory) => {
      const next = prevHistory.future[0];
      const newFuture = prevHistory.future.slice(1);

      return {
        past: [...prevHistory.past, prevHistory.present].filter(Boolean) as T[],
        present: next,
        future: newFuture,
      };
    });
  };

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
  };
};