"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MousePosition {
  x: number;
  y: number;
}

export function TorchLightEffect() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsActive(true);
      }
    };

    const handleMouseEnter = () => {
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Don't render on server-side to avoid hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30 torch-overlay"
    >
      {/* Dark overlay that creates the torch effect */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{ 
          opacity: isActive ? 0.6 : 0
        }} 
      />
      
      {/* Torch light that follows mouse */}
      {isActive && (
        <motion.div
          key="torch-light-main"
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 150, 
            damping: 20,
            duration: 0.3 
          }}
        >
          {/* Main torch light circle */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `
                radial-gradient(
                  circle,
                  rgba(255, 255, 255, 1) 0%,
                  rgba(255, 255, 255, 0.9) 20%,
                  rgba(255, 255, 255, 0.7) 40%,
                  rgba(255, 255, 255, 0.4) 60%,
                  rgba(255, 255, 255, 0.1) 80%,
                  transparent 100%
                )
              `,
              boxShadow: `
                0 0 100px rgba(255, 255, 255, 0.8),
                0 0 200px rgba(255, 255, 255, 0.4)
              `,
            }}
          />
        </motion.div>
      )}
    </div>
  );
} 