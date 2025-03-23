'use client';

import { useEffect, useRef } from 'react';

interface GriddedBackgroundProps {
  children?: React.ReactNode;
}

const LightBlueGrid: React.FC<GriddedBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resize = () => {
      // Set canvas dimensions to match the window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      drawGrid();
    };

    const drawGrid = () => {
      if (!canvas || !context) return;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Get dimensions
      const w = canvas.width;
      const h = canvas.height;

      // Set grid properties
      const gridSize = 32; // Slightly smaller grid for more detail
      const gridColor = 'rgba(100, 116, 139, 0.2)'; // Light slate lines
      const gridHighlightColor = 'rgba(71, 85, 105, 0.3)'; // Darker slate for highlights
      const majorHighlightColor = 'rgba(59, 130, 246, 0.5)'; // Blue highlight for major lines

      // Draw the grid - vertical lines
      for (let x = 0; x <= w; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, h);
        
        // Major lines are blue-tinted
        if (x % (gridSize * 8) === 0) {
          context.strokeStyle = majorHighlightColor;
          context.lineWidth = 1.5;
        }
        // Medium lines are darker slate
        else if (x % (gridSize * 4) === 0) {
          context.strokeStyle = gridHighlightColor;
          context.lineWidth = 1;
        } 
        // Standard lines are light slate
        else {
          context.strokeStyle = gridColor;
          context.lineWidth = 0.5;
        }
        
        context.stroke();
      }

      // Draw the grid - horizontal lines
      for (let y = 0; y <= h; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(w, y);
        
        // Major lines are blue-tinted
        if (y % (gridSize * 8) === 0) {
          context.strokeStyle = majorHighlightColor;
          context.lineWidth = 1.5;
        }
        // Medium lines are darker slate
        else if (y % (gridSize * 4) === 0) {
          context.strokeStyle = gridHighlightColor;
          context.lineWidth = 1;
        } 
        // Standard lines are light slate
        else {
          context.strokeStyle = gridColor;
          context.lineWidth = 0.5;
        }
        
        context.stroke();
      }

      // Add grid points at intersections
      for (let x = 0; x <= w; x += gridSize * 2) { // Reduced density of dots
        for (let y = 0; y <= h; y += gridSize * 2) {
          // Major intersection points (blue glow)
          if (x % (gridSize * 8) === 0 && y % (gridSize * 8) === 0) {
            // Outer glow
            context.beginPath();
            context.arc(x, y, 3, 0, Math.PI * 2);
            context.fillStyle = 'rgba(59, 130, 246, 0.4)';
            context.fill();
            
            // Inner point
            context.beginPath();
            context.arc(x, y, 1.5, 0, Math.PI * 2);
            context.fillStyle = 'rgba(59, 130, 246, 0.7)';
            context.fill();
          }
          // Medium intersection points
          else if ((x % (gridSize * 4) === 0 && y % (gridSize * 4) === 0)) {
            context.beginPath();
            context.arc(x, y, 1.5, 0, Math.PI * 2);
            context.fillStyle = 'rgba(71, 85, 105, 0.5)';
            context.fill();
          }
          // Standard intersection points (reduced frequency)
          else if ((x % (gridSize * 2) === 0 && y % (gridSize * 2) === 0)) {
            context.beginPath();
            context.arc(x, y, 1, 0, Math.PI * 2);
            context.fillStyle = 'rgba(100, 116, 139, 0.3)';
            context.fill();
          }
        }
      }
    };

    // Initial draw
    resize();

    // Redraw on resize
    window.addEventListener('resize', resize);

    // Clean up
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Subtle blue radial gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-full radial-blue-gradient z-0"></div>
      
      {/* Canvas for grid */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      
      
      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
      
      <style jsx>{`
        .radial-blue-gradient {
          background: radial-gradient(circle at 50% 50%, rgba(191, 219, 254, 0.3), rgba(191, 219, 254, 0) 70%);
        }
        
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .particle {
          position: absolute;
          background-color: rgba(59, 130, 246, 0.6);
          border-radius: 50%;
          animation: float linear infinite;
          box-shadow: 0 0 4px rgba(59, 130, 246, 0.4);
        }
        
        @keyframes float {
          0% { transform: scale(1) translate(0, 0); }
          25% { transform: scale(1.2) translate(10px, 10px); }
          50% { transform: scale(1) translate(20px, 0); }
          75% { transform: scale(1.2) translate(10px, -10px); }
          100% { transform: scale(1) translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default LightBlueGrid;