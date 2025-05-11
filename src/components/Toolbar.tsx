import React from 'react';
import { usePaint } from '../context/PaintContext';
import { BrushType, Tool } from '../types';
import { 
  Brush, 
  Eraser, 
  Undo, 
  Redo, 
  Download, 
  Save, 
  Pipette, 
  Hand,
  ZoomIn,
  Maximize2,
  Grid,
  Split,
  Wand2,
  Square,
  Type,
  Image
} from 'lucide-react';

const Toolbar: React.FC = () => {
  const { 
    state, 
    setTool, 
    setBrushType, 
    undo, 
    redo,
    toggleSymmetry,
    setSymmetryAxis,
    applyFilter
  } = usePaint();

  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'imparator_paint_export.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const tools = [
    { name: 'brush' as Tool, icon: <Brush size={20} />, label: 'Brush' },
    { name: 'eraser' as Tool, icon: <Eraser size={20} />, label: 'Eraser' },
    { name: 'eyedropper' as Tool, icon: <Pipette size={20} />, label: 'Color Picker' },
    { name: 'move' as Tool, icon: <Hand size={20} />, label: 'Move Canvas' },
    { name: 'zoom' as Tool, icon: <ZoomIn size={20} />, label: 'Zoom' },
    { name: 'magic' as Tool, icon: <Wand2 size={20} />, label: 'Magic Wand' },
    { name: 'shape' as Tool, icon: <Square size={20} />, label: 'Shape Tool' },
    { name: 'text' as Tool, icon: <Type size={20} />, label: 'Text Tool' },
  ];

  const brushTypes = [
    { name: 'pen' as BrushType, label: 'Pen' },
    { name: 'pencil' as BrushType, label: 'Pencil' },
    { name: 'marker' as BrushType, label: 'Marker' },
    { name: 'spray' as BrushType, label: 'Spray' },
    { name: 'watercolor' as BrushType, label: 'Watercolor' },
    { name: 'airbrush' as BrushType, label: 'Airbrush' },
  ];

  const filters = [
    { name: 'grayscale', label: 'Grayscale' },
    { name: 'sepia', label: 'Sepia' },
    { name: 'invert', label: 'Invert' },
    { name: 'blur', label: 'Blur' },
    { name: 'sharpen', label: 'Sharpen' },
  ];

  return (
    <div className="flex flex-col bg-neutral-900 border-r border-neutral-800 p-2 space-y-6">
      {/* Tools */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-2">Tools</h3>
        <div className="grid grid-cols-1 gap-1">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => setTool(tool.name)}
              className={`flex items-center justify-center p-2 rounded hover:bg-neutral-800 transition-colors
                ${state.currentTool === tool.name ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>
      
      {/* Brush Types */}
      {state.currentTool === 'brush' && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-2">Brush Type</h3>
          <div className="grid grid-cols-1 gap-1">
            {brushTypes.map((brushType) => (
              <button
                key={brushType.name}
                onClick={() => setBrushType(brushType.name)}
                className={`px-2 py-1 text-xs rounded hover:bg-neutral-800 transition-colors
                  ${state.brushType === brushType.name ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
                title={brushType.label}
              >
                {brushType.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-2">Filters</h3>
        <div className="grid grid-cols-1 gap-1">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => applyFilter(filter.name)}
              className="px-2 py-1 text-xs rounded hover:bg-neutral-800 transition-colors text-neutral-400"
              title={`Apply ${filter.label}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Symmetry Tools */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-2">Symmetry</h3>
        <div className="grid grid-cols-1 gap-1">
          <button
            onClick={() => toggleSymmetry()}
            className={`flex items-center justify-center p-2 rounded hover:bg-neutral-800 transition-colors
              ${state.symmetryEnabled ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
            title="Toggle Symmetry"
          >
            <Split size={20} />
          </button>
          {state.symmetryEnabled && (
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => setSymmetryAxis('vertical')}
                className={`px-2 py-1 text-xs rounded hover:bg-neutral-800 transition-colors
                  ${state.symmetryAxis === 'vertical' ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
              >
                Vertical
              </button>
              <button
                onClick={() => setSymmetryAxis('horizontal')}
                className={`px-2 py-1 text-xs rounded hover:bg-neutral-800 transition-colors
                  ${state.symmetryAxis === 'horizontal' ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
              >
                Horizontal
              </button>
              <button
                onClick={() => setSymmetryAxis('both')}
                className={`px-2 py-1 text-xs rounded hover:bg-neutral-800 transition-colors
                  ${state.symmetryAxis === 'both' ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
              >
                Both
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History Actions */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-2">History</h3>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={undo}
            disabled={!state.canUndo}
            className={`flex items-center justify-center p-2 rounded hover:bg-neutral-800 transition-colors
              ${!state.canUndo ? 'opacity-50 cursor-not-allowed' : 'text-neutral-400'}`}
            title="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={redo}
            disabled={!state.canRedo}
            className={`flex items-center justify-center p-2 rounded hover:bg-neutral-800 transition-colors
              ${!state.canRedo ? 'opacity-50 cursor-not-allowed' : 'text-neutral-400'}`}
            title="Redo"
          >
            <Redo size={20} />
          </button>
        </div>
      </div>
      
      {/* File Operations */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-2">File</h3>
        <div className="grid grid-cols-1 gap-1">
          <button
            onClick={handleExport}
            className="flex items-center justify-center p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400"
            title="Export"
          >
            <Download size={20} />
          </button>
          <button
            className="flex items-center justify-center p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400"
            title="Save"
          >
            <Save size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;