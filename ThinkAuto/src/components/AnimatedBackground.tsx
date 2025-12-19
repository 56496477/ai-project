import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  // Extract color class to determine base hue roughly or just overlay
  // Since we pass tailwind classes like "bg-rose-500", it's hard to interpolate exactly without mapping.
  // Instead, we will use a set of floating orbs that take the accent color from context or just subtle multi-color.
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -left-1/4 w-2/3 h-2/3 rounded-full bg-gradient-to-br from-white/40 to-white/0 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 rounded-full bg-gradient-to-tl from-white/40 to-white/0 blur-3xl"
      />
    </div>
  );
};
