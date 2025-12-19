import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <motion.div 
        className="relative w-10 h-10 flex items-center justify-center"
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl opacity-80 blur-sm" />
        <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border border-indigo-100 overflow-hidden">
          <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" fillOpacity="0.2"/>
            <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="currentColor"/>
            <circle cx="15" cy="9" r="1" className="text-purple-500" fill="currentColor" />
          </svg>
        </div>
      </motion.div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 tracking-tight">
          ThinkAuto
        </span>
        <span className="text-xs font-medium text-indigo-500 tracking-widest uppercase">
          智询
        </span>
      </div>
    </div>
  );
};
