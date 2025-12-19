import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import html2canvas from 'html2canvas';

interface Step3Props {
  result: string;
  onReset: () => void;
  themeColor: string;
}

export const Step3: React.FC<Step3Props> = ({ result, themeColor }) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveImage = async () => {
    if (!resultRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: null, // Transparent background if possible, or let it capture styles
        scale: 2, // High resolution
        useCORS: true
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `thinkauto-analysis-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to save image', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <motion.div
        ref={resultRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/60 text-left relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
           </svg>
        </div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className={`p-4 rounded-2xl ${themeColor} text-white shadow-lg`}>
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">分析结果</h2>
            <p className="text-gray-500 text-sm mt-1">ThinkAuto 智能咨询报告</p>
          </div>
        </div>
        
        <div className="prose prose-lg text-gray-600 whitespace-pre-line leading-loose relative z-10 font-medium">
          {result}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-end opacity-60">
           <div className="text-xs text-gray-400">
             生成于 {new Date().toLocaleDateString()}
           </div>
           <div className="flex items-center gap-2">
             <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-400">ThinkAuto</span>
           </div>
        </div>
      </motion.div>

      <div className="flex justify-center pb-8">
        <Button
          onClick={handleSaveImage}
          isLoading={saving}
          className="bg-gray-900 text-white hover:bg-gray-800 shadow-xl px-8 py-4 rounded-2xl flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          保存为图片
        </Button>
      </div>
    </div>
  );
};
