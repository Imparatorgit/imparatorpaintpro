import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrushType, ColorHistory, Layer, PaintState, Tool, Filter } from '../types';
import { generateId } from '../utils/helpers';

interface PaintContextType {
  state: PaintState;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  setBrushType: (type: BrushType) => void;
  setTool: (tool: Tool) => void;
  addLayer: () => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (index: number) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  renameLayer: (id: string, name: string) => void;
  undo: () => void;
  redo: () => void;
  toggleGrid: () => void;
  toggleRulers: () => void;
  toggleSymmetry: () => void;
  setSymmetryAxis: (axis: 'vertical' | 'horizontal' | 'both') => void;
  setZoom: (zoom: number) => void;
  applyFilter: (filter: Filter) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
}

const initialState: PaintState = {
  currentColor: '#000000',
  brushSize: 5,
  brushOpacity: 1,
  brushType: 'pen',
  currentTool: 'brush',
  layers: [],
  activeLayerIndex: 0,
  colorHistory: ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'],
  canUndo: false,
  canRedo: false,
  zoom: 1,
  showGrid: false,
  showRulers: false,
  symmetryEnabled: false,
  symmetryAxis: 'vertical',
  brushPresets: [],
};

const PaintContext = createContext<PaintContextType | undefined>(undefined);

export const PaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PaintState>(initialState);
  
  useEffect(() => {
    if (state.layers.length === 0) {
      addLayer();
    }
  }, []);
  
  const setColor = (color: string) => {
    setState((prev) => {
      const colorHistory = prev.colorHistory.includes(color) 
        ? prev.colorHistory 
        : [color, ...prev.colorHistory].slice(0, 20);
      
      return {
        ...prev,
        currentColor: color,
        colorHistory,
      };
    });
  };
  
  const setBrushSize = (size: number) => {
    setState((prev) => ({
      ...prev,
      brushSize: size,
    }));
  };
  
  const setBrushOpacity = (opacity: number) => {
    setState((prev) => ({
      ...prev,
      brushOpacity: opacity,
    }));
  };
  
  const setBrushType = (type: BrushType) => {
    setState((prev) => ({
      ...prev,
      brushType: type,
    }));
  };
  
  const setTool = (tool: Tool) => {
    setState((prev) => ({
      ...prev,
      currentTool: tool,
    }));
  };
  
  const addLayer = () => {
    const newLayer: Layer = {
      id: generateId(),
      name: `Layer ${state.layers.length + 1}`,
      visible: true,
      locked: false,
      canvas: document.createElement('canvas'),
    };
    
    setState((prev) => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      activeLayerIndex: prev.layers.length,
    }));
  };
  
  const removeLayer = (id: string) => {
    setState((prev) => {
      const newLayers = prev.layers.filter((layer) => layer.id !== id);
      let newActiveIndex = prev.activeLayerIndex;
      
      if (newLayers.length === 0) {
        newActiveIndex = -1;
      } else if (newActiveIndex >= newLayers.length) {
        newActiveIndex = newLayers.length - 1;
      }
      
      return {
        ...prev,
        layers: newLayers,
        activeLayerIndex: newActiveIndex,
      };
    });
  };
  
  const setActiveLayer = (index: number) => {
    if (index >= 0 && index < state.layers.length) {
      setState((prev) => ({
        ...prev,
        activeLayerIndex: index,
      }));
    }
  };
  
  const toggleLayerVisibility = (id: string) => {
    setState((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      ),
    }));
  };
  
  const toggleLayerLock = (id: string) => {
    setState((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) =>
        layer.id === id ? { ...layer, locked: !layer.locked } : layer
      ),
    }));
  };
  
  const renameLayer = (id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) =>
        layer.id === id ? { ...layer, name } : layer
      ),
    }));
  };

  const reorderLayers = (fromIndex: number, toIndex: number) => {
    setState((prev) => {
      const newLayers = [...prev.layers];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      
      return {
        ...prev,
        layers: newLayers,
        activeLayerIndex: toIndex,
      };
    });
  };
  
  const undo = () => {
    // Implement undo logic using canvas state
    setState((prev) => ({
      ...prev,
      canUndo: false,
    }));
  };
  
  const redo = () => {
    // Implement redo logic using canvas state
    setState((prev) => ({
      ...prev,
      canRedo: false,
    }));
  };

  const toggleGrid = () => {
    setState((prev) => ({
      ...prev,
      showGrid: !prev.showGrid,
    }));
  };

  const toggleRulers = () => {
    setState((prev) => ({
      ...prev,
      showRulers: !prev.showRulers,
    }));
  };

  const toggleSymmetry = () => {
    setState((prev) => ({
      ...prev,
      symmetryEnabled: !prev.symmetryEnabled,
    }));
  };

  const setSymmetryAxis = (axis: 'vertical' | 'horizontal' | 'both') => {
    setState((prev) => ({
      ...prev,
      symmetryAxis: axis,
    }));
  };

  const setZoom = (zoom: number) => {
    setState((prev) => ({
      ...prev,
      zoom,
    }));
  };

  const applyFilter = (filter: Filter) => {
    const activeLayer = state.layers[state.activeLayerIndex];
    if (!activeLayer?.canvas) return;

    const ctx = activeLayer.canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const pixels = imageData.data;

    switch (filter) {
      case 'grayscale':
        for (let i = 0; i < pixels.length; i += 4) {
          const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          pixels[i] = avg;
          pixels[i + 1] = avg;
          pixels[i + 2] = avg;
        }
        break;
      case 'sepia':
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          pixels[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          pixels[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          pixels[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
      case 'invert':
        for (let i = 0; i < pixels.length; i += 4) {
          pixels[i] = 255 - pixels[i];
          pixels[i + 1] = 255 - pixels[i + 1];
          pixels[i + 2] = 255 - pixels[i + 2];
        }
        break;
      // Implement blur and sharpen filters
    }

    ctx.putImageData(imageData, 0, 0);
  };
  
  return (
    <PaintContext.Provider
      value={{
        state,
        setColor,
        setBrushSize,
        setBrushOpacity,
        setBrushType,
        setTool,
        addLayer,
        removeLayer,
        setActiveLayer,
        toggleLayerVisibility,
        toggleLayerLock,
        renameLayer,
        undo,
        redo,
        toggleGrid,
        toggleRulers,
        toggleSymmetry,
        setSymmetryAxis,
        setZoom,
        applyFilter,
        reorderLayers,
      }}
    >
      {children}
    </PaintContext.Provider>
  );
};

export const usePaint = (): PaintContextType => {
  const context = useContext(PaintContext);
  if (!context) {
    throw new Error('usePaint must be used within a PaintProvider');
  }
  return context;
};