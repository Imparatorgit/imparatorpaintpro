import { useRef, useEffect, useState, MouseEvent, TouchEvent } from 'react';
import { Point } from '../types';
import { getCanvasPosition, hexToRgba } from '../utils/helpers';

interface UseCanvasProps {
  color: string;
  brushSize: number;
  opacity: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
}

export const useCanvas = ({
  color,
  brushSize,
  opacity,
  canvasRef,
  isDrawing,
  setIsDrawing,
}: UseCanvasProps) => {
  const lastPointRef = useRef<Point | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Setting default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
    
    setContext(ctx);
  }, [canvasRef]);

  useEffect(() => {
    if (!context) return;
    context.strokeStyle = hexToRgba(color, opacity);
    context.lineWidth = brushSize;
  }, [color, brushSize, opacity, context]);

  const startDrawing = (point: Point) => {
    if (!context || !canvasRef.current) return;
    
    setIsDrawing(true);
    lastPointRef.current = point;
    
    // Draw a dot at the starting point
    context.beginPath();
    context.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    context.fill();
  };

  const draw = (point: Point) => {
    if (!context || !isDrawing || !lastPointRef.current) return;
    
    context.beginPath();
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    
    lastPointRef.current = point;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const point = getCanvasPosition(e.clientX, e.clientY, canvasRef.current);
    startDrawing(point);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !isDrawing) return;
    const point = getCanvasPosition(e.clientX, e.clientY, canvasRef.current);
    draw(point);
  };

  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const point = getCanvasPosition(touch.clientX, touch.clientY, canvasRef.current);
    
    // Check if the browser supports pressure
    if ('force' in touch) {
      point.pressure = touch.force;
    }
    
    startDrawing(point);
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current || !isDrawing || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const point = getCanvasPosition(touch.clientX, touch.clientY, canvasRef.current);
    
    // Check if the browser supports pressure
    if ('force' in touch) {
      point.pressure = touch.force;
    }
    
    draw(point);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    stopDrawing,
  };
};