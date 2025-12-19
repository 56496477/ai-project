import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { categories } from '../mockData';
import { Button } from './Button';
import type { Category } from '../types';

interface Step1Props {
  onNext: (data: { categoryId: string, description: string }) => void;
  selectedCategoryId?: string;
  onCategorySelect: (category: Category) => void;
}

export const Step1: React.FC<Step1Props> = ({ onNext, selectedCategoryId, onCategorySelect }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedCategoryId || !description.trim()) return;
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onNext({ categoryId: selectedCategoryId, description });
    setLoading(false);
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">选择咨询主题</h2>
        <p className="text-gray-500">选择最符合您当前情况的分类</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategorySelect(category)}
            className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-4 aspect-[4/5] relative overflow-hidden group ${
              selectedCategoryId === category.id
                ? `${category.theme.primary} text-white border-transparent shadow-xl ring-4 ring-white/30`
                : 'bg-white/40 backdrop-blur-sm border-white/60 text-gray-600 hover:bg-white/60 hover:shadow-lg'
            }`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-tr from-white to-transparent`} />
            <span className="text-4xl filter drop-shadow-sm">{category.icon}</span>
            <span className="text-sm font-semibold text-center leading-tight tracking-wide">{category.name}</span>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={false}
        animate={{ 
          opacity: selectedCategoryId ? 1 : 0,
          height: selectedCategoryId ? 'auto' : 0,
          y: selectedCategoryId ? 0 : 20
        }}
        className="overflow-hidden"
      >
        {selectedCategoryId && (
          <div className="pt-8 space-y-6">
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 text-indigo-500" />
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-indigo-500 rounded-full inline-block"></span>
                有什么我们可以帮您的？
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请详细描述您的情况，以便我们更好地理解..."
                className="w-full h-48 p-6 rounded-2xl border-0 bg-white/50 focus:bg-white focus:ring-0 shadow-inner transition-all resize-none outline-none text-gray-700 placeholder-gray-400 text-lg leading-relaxed"
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={handleConfirm}
                isLoading={loading}
                disabled={!description.trim()}
                className={`${selectedCategory?.theme.primary} text-white shadow-lg shadow-current/20 w-full sm:w-auto`}
              >
                下一步
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
