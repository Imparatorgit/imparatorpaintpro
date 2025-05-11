export type Point = {
  x: number;
  y: number;
  pressure?: number;
};

export type BrushType = 'pen' | 'pencil' | 'marker' | 'spray' | 'watercolor' | 'airbrush';

export type Tool = 'brush' | 'eraser' | 'eyedropper' | 'move' | 'zoom' | 'magic' | 'shape' | 'text';

export type Layer = {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  canvas: HTMLCanvasElement | null;
};

export type ColorHistory = string[];

export type BrushPreset = {
  id: string;
  name: string;
  type: BrushType;
  size: number;
  opacity: number;
  color: string;
};

export type Filter = 'grayscale' | 'sepia' | 'invert' | 'blur' | 'sharpen';

export interface PaintState {
  currentColor: string;
  brushSize: number;
  brushOpacity: number;
  brushType: BrushType;
  currentTool: Tool;
  layers: Layer[];
  activeLayerIndex: number;
  colorHistory: ColorHistory;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  showGrid: boolean;
  showRulers: boolean;
  symmetryEnabled: boolean;
  symmetryAxis: 'vertical' | 'horizontal' | 'both';
  brushPresets: BrushPreset[];
}