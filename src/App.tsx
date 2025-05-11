import React, { useEffect } from 'react';
import { PaintProvider } from './context/PaintContext';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ColorPicker from './components/ColorPicker';
import BrushControls from './components/BrushControls';
import LayerPanel from './components/LayerPanel';
import { Palette, Layers, Save, Crown, Keyboard } from 'lucide-react';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { usePaint } from './context/PaintContext';

function AppContent() {
  const { 
    state,
    setTool,
    setBrushSize,
    undo,
    redo,
    saveProject
  } = usePaint();

  useKeyboardShortcuts({
    'b': () => setTool('brush'),
    'e': () => setTool('eraser'),
    'i': () => setTool('eyedropper'),
    'h': () => setTool('move'),
    'z': () => setTool('zoom'),
    '[': () => setBrushSize(Math.max(1, state.brushSize - 1)),
    ']': () => setBrushSize(Math.min(50, state.brushSize + 1)),
    'ctrl+z': undo,
    'ctrl+shift+z': redo,
    'meta+z': undo,
    'meta+shift+z': redo,
    'ctrl+s': (e) => {
      e.preventDefault();
      saveProject();
    },
    'meta+s': (e) => {
      e.preventDefault();
      saveProject();
    }
  });

  const [showShortcuts, setShowShortcuts] = React.useState(false);

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Crown className="text-yellow-500" size={24} />
          <h1 className="text-xl font-bold">Imparator Paint Pro</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="px-4 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors flex items-center space-x-1"
            title="Keyboard Shortcuts"
          >
            <Keyboard size={16} />
            <span>Shortcuts</span>
          </button>
          <button
            onClick={saveProject}
            className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors flex items-center space-x-1"
          >
            <Save size={16} />
            <span>Save Project</span>
          </button>
        </div>
      </header>
      
      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Keyboard Shortcuts</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Tools</h3>
                <ul className="space-y-2">
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">B</kbd> Brush</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">E</kbd> Eraser</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">I</kbd> Color Picker</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">H</kbd> Hand Tool</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">Z</kbd> Zoom</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Actions</h3>
                <ul className="space-y-2">
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">[</kbd> Decrease Size</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">]</kbd> Increase Size</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">Ctrl/⌘ + Z</kbd> Undo</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">Ctrl/⌘ + Shift + Z</kbd> Redo</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">Ctrl/⌘ + S</kbd> Save</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-6 w-full px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Tools */}
        <Toolbar />
        
        {/* Main canvas area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas controls */}
          <div className="p-3 border-b border-neutral-800 bg-neutral-900 flex items-center space-x-4">
            <ColorPicker />
            <div className="flex-1">
              <BrushControls />
            </div>
          </div>
          
          {/* Canvas */}
          <div className="flex-1 overflow-hidden p-4">
            <Canvas />
          </div>
        </div>
        
        {/* Right sidebar - Layers */}
        <LayerPanel />
      </div>
      
      {/* Status bar */}
      <footer className="border-t border-neutral-800 bg-neutral-900 p-2 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center space-x-3">
          <span>Canvas: 800x600</span>
          <span>Tool: {state.currentTool}</span>
          <span>Zoom: {Math.round(state.zoom * 100)}%</span>
        </div>
        <div>
          <span>Ready</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <PaintProvider>
      <AppContent />
    </PaintProvider>
  );
}

export default App;