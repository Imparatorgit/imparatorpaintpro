import React from 'react';
import { usePaint } from '../context/PaintContext';

const BrushControls: React.FC = () => {
  const { state, setBrushSize, setBrushOpacity } = usePaint();
  
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushSize(parseInt(e.target.value, 10));
  };
  
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushOpacity(parseFloat(e.target.value));
  };
  
  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="brush-size" className="text-xs font-medium text-neutral-400">
            Size: {state.brushSize}px
          </label>
          <span className="text-xs text-neutral-500">1-50</span>
        </div>
        <input
          id="brush-size"
          type="range"
          min="1"
          max="50"
          value={state.brushSize}
          onChange={handleSizeChange}
          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="brush-opacity" className="text-xs font-medium text-neutral-400">
            Opacity: {Math.round(state.brushOpacity * 100)}%
          </label>
          <span className="text-xs text-neutral-500">0-100%</span>
        </div>
        <input
          id="brush-opacity"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={state.brushOpacity}
          onChange={handleOpacityChange}
          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      
      {/* Brush preview */}
      <div className="mt-4">
        <h3 className="text-xs font-medium text-neutral-400 mb-2">Brush Preview</h3>
        <div className="flex items-center justify-center bg-neutral-800 rounded-lg p-4 h-20">
          <div 
            className="rounded-full bg-current"
            style={{
              width: `${state.brushSize}px`,
              height: `${state.brushSize}px`,
              opacity: state.brushOpacity,
              backgroundColor: state.currentColor,
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BrushControls;