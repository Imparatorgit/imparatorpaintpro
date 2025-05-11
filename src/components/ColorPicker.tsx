import React, { useState, useRef, useEffect } from 'react';
import { usePaint } from '../context/PaintContext';

const ColorPicker: React.FC = () => {
  const { state, setColor } = usePaint();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };
  
  const handleHistoryColorClick = (color: string) => {
    setColor(color);
    setShowColorPicker(false);
  };
  
  return (
    <div className="relative" ref={colorPickerRef}>
      <button
        className="w-10 h-10 rounded-full border-2 border-white shadow-inner flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: state.currentColor }}
        onClick={() => setShowColorPicker(!showColorPicker)}
        aria-label="Select color"
      />
      
      {showColorPicker && (
        <div className="absolute left-0 top-12 bg-neutral-900 border border-neutral-700 p-3 rounded-lg shadow-lg z-10 w-64 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="mb-3">
            <input
              type="color"
              value={state.currentColor}
              onChange={handleColorChange}
              className="w-full h-10 rounded overflow-hidden cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Recent Colors</h3>
            <div className="grid grid-cols-5 gap-2">
              {state.colorHistory.map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  className="w-8 h-8 rounded-full border border-neutral-700 shadow-inner hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleHistoryColorClick(color)}
                  aria-label={`Use color ${color}`}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Presets</h3>
            <div className="grid grid-cols-5 gap-2">
              {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
                '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080',
                '#800000', '#808000', '#008000', '#800080', '#008080'].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border border-neutral-700 shadow-inner hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleHistoryColorClick(color)}
                  aria-label={`Use color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;