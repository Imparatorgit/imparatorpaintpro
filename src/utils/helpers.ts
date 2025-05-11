export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const getCanvasPosition = (
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement
): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
};

// Hex to RGBA conversion
export const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Canvas utility to get image data
export const getImageData = (context: CanvasRenderingContext2D): ImageData => {
  return context.getImageData(0, 0, context.canvas.width, context.canvas.height);
};

// Canvas utility to put image data
export const putImageData = (
  context: CanvasRenderingContext2D,
  imageData: ImageData
): void => {
  context.putImageData(imageData, 0, 0);
};

// Canvas utility to clear canvas
export const clearCanvas = (canvas: HTMLCanvasElement): void => {
  const context = canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
};