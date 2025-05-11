import React, { useRef, useState, useEffect } from 'react';
import { usePaint } from '../context/PaintContext';
import { useCanvas } from '../hooks/useCanvas';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Grid, Ruler, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const Canvas: React.FC = () => {
  const { state, toggleGrid, toggleRulers, setColor, setZoom, resetTransform } = usePaint();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    tool: state.currentTool,
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

  const handleEyeDropper = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.currentTool === 'eyedropper' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
      const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
      
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
      setColor(color);
    }
  };

  const handleMousePositionUpdate = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * (canvasRef.current.width / rect.width));
    const y = Math.round((e.clientY - rect.top) * (canvasRef.current.height / rect.height));
    setMousePosition({ x, y });
  };

  const getCursorStyle = () => {
    switch (state.currentTool) {
      case 'brush':
        return { cursor: 'crosshair' };
      case 'eraser':
        return { cursor: 'crosshair' };
      case 'eyedropper':
        return { cursor: 'crosshair' };
      case 'move':
        return { cursor: 'grab' };
      case 'zoom':
        return { cursor: 'zoom-in' };
      default:
        return { cursor: 'default' };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleGrid}
            className={`p-2 rounded ${state.showGrid ? 'bg-blue-600' : 'bg-neutral-700'} hover:bg-opacity-80 transition-colors`}
            title="Toggle Grid"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={toggleRulers}
            className={`p-2 rounded ${state.showRulers ? 'bg-blue-600' : 'bg-neutral-700'} hover:bg-opacity-80 transition-colors`}
            title="Toggle Rulers"
          >
            <Ruler size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-400">
            {mousePosition.x}, {mousePosition.y}px
          </span>
          <div className="h-4 w-px bg-neutral-700 mx-2" />
          <button
            onClick={() => setZoom(state.zoom - 0.1)}
            className="p-2 rounded bg-neutral-700 hover:bg-opacity-80 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-sm text-neutral-400 min-w-[60px] text-center">
            {Math.round(state.zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(state.zoom + 0.1)}
            className="p-2 rounded bg-neutral-700 hover:bg-opacity-80 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={resetTransform}
            className="p-2 rounded bg-neutral-700 hover:bg-opacity-80 transition-colors"
            title="Reset Transform"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden bg-neutral-800 border border-neutral-700 rounded-lg relative"
      >
        <TransformWrapper
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          disabled={state.currentTool !== 'move'}
          onZoom={({ state: { scale } }) => setZoom(scale)}
        >
          <TransformComponent>
            <div className="relative">
              {state.showRulers && (
                <>
                  <div className="absolute top-0 left-0 w-full h-6 bg-neutral-900/80 backdrop-blur-sm" />
                  <div className="absolute top-0 left-0 w-6 h-full bg-neutral-900/80 backdrop-blur-sm" />
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
                onMouseDown={(e) => {
                  if (state.currentTool === 'eyedropper') {
                    handleEyeDropper(e);
                  } else {
                    handleMouseDown(e);
                  }
                }}
                onMouseMove={(e) => {
                  handleMouseMove(e);
                  handleMousePositionUpdate(e);
                }}
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