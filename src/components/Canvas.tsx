import React, { useRef, useState, useEffect } from 'react';
import { usePaint } from '../context/PaintContext';
import { useCanvas } from '../hooks/useCanvas';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Grid, Ruler } from 'lucide-react';

const Canvas: React.FC = () => {
  const { state, toggleGrid, toggleRulers } = usePaint();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const {
    handleMouseDown,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    stopDrawing
  } = useCanvas({
    color: state.currentColor,
    brushSize: state.brushSize,
    opacity: state.brushOpacity,
    canvasRef,
    isDrawing,
    setIsDrawing
  });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const getCursorStyle = () => {
    const size = Math.max(state.brushSize, 8);
    
    if (state.currentTool === 'brush') {
      return {
        cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="none" stroke="%23000" stroke-width="1"/></svg>') ${size/2} ${size/2}, auto`
      };
    } else if (state.currentTool === 'eraser') {
      return {
        cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="none" stroke="%23000" stroke-width="1"/><line x1="${size/4}" y1="${size/4}" x2="${3*size/4}" y2="${3*size/4}" stroke="%23000" stroke-width="1"/><line x1="${3*size/4}" y1="${size/4}" x2="${size/4}" y2="${3*size/4}" stroke="%23000" stroke-width="1"/></svg>') ${size/2} ${size/2}, auto`
      };
    } else if (state.currentTool === 'eyedropper') {
      return { cursor: 'crosshair' };
    } else if (state.currentTool === 'zoom') {
      return { cursor: 'zoom-in' };
    } else {
      return { cursor: 'default' };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={toggleGrid}
          className={`p-2 rounded ${state.showGrid ? 'bg-blue-600' : 'bg-neutral-700'}`}
          title="Toggle Grid"
        >
          <Grid size={16} />
        </button>
        <button
          onClick={toggleRulers}
          className={`p-2 rounded ${state.showRulers ? 'bg-blue-600' : 'bg-neutral-700'}`}
          title="Toggle Rulers"
        >
          <Ruler size={16} />
        </button>
        <span className="text-sm text-neutral-400">Zoom: {Math.round(state.zoom * 100)}%</span>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden bg-neutral-800 border border-neutral-700 rounded-lg"
      >
        <TransformWrapper
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          disabled={state.currentTool !== 'zoom'}
        >
          <TransformComponent>
            <div className="relative">
              {state.showRulers && (
                <>
                  <div className="absolute top-0 left-0 w-full h-6 bg-neutral-900" />
                  <div className="absolute top-0 left-0 w-6 h-full bg-neutral-900" />
                </>
              )}
              
              {state.showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))] grid-rows-[repeat(auto-fill,minmax(20px,1fr))]">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} className="border border-neutral-700/30" />
                    ))}
                  </div>
                </div>
              )}

              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="w-full h-full touch-none"
                style={getCursorStyle()}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={stopDrawing}
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default Canvas;