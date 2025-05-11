import React from 'react';
import { PaintProvider } from './context/PaintContext';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ColorPicker from './components/ColorPicker';
import BrushControls from './components/BrushControls';
import LayerPanel from './components/LayerPanel';
import { Palette, Layers, Save } from 'lucide-react';

function App() {
  return (
    <PaintProvider>
      <div className="flex flex-col h-screen bg-neutral-950 text-white">
        {/* Header */}
        <header className="border-b border-neutral-800 bg-neutral-900 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="text-blue-500" size={24} />
            <h1 className="text-xl font-bold">PaintPro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-1.5 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1">
              <Save size={16} />
              <span>Save Project</span>
            </button>
          </div>
        </header>
        
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
            <span>Tool: Brush</span>
          </div>
          <div>
            <span>Ready</span>
          </div>
        </footer>
      </div>
    </PaintProvider>
  );
}

export default App;