import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import type { Question } from '../types';

interface Step2Props {
  questions: Question[];
  onNext: (answers: Record<string, string>) => void;
  themeColor: string; // e.g. "bg-rose-500"
}

export const Step2: React.FC<Step2Props> = ({ questions, onNext, themeColor }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const isComplete = questions.every(q => answers[q.id]?.trim());

  const handleSubmit = async () => {
    if (!isComplete) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onNext(answers);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
       <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">了解更多细节</h2>
        <p className="text-gray-500">帮助我们更好地理解您的处境</p>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/50 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-50" />
            <label className="block text-xl font-medium text-gray-800 mb-6 pl-2 border-l-4 border-transparent">
              {q.text}
            </label>
            
            {q.type === 'text' ? (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full p-4 rounded-xl border-0 bg-white/50 focus:bg-white shadow-inner focus:ring-0 transition-all outline-none text-lg text-gray-700"
                placeholder="请输入您的回答..."
              />
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {q.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswerChange(q.id, opt)}
                    className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden group/btn ${
                      answers[q.id] === opt
                        ? `${themeColor} text-white border-transparent shadow-md transform scale-[1.02]`
                        : 'bg-white/50 border-white/60 text-gray-600 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-medium">{opt}</span>
                      {answers[q.id] === opt && (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit}
          isLoading={loading}
          disabled={!isComplete}
          className={`${themeColor} text-white w-full sm:w-auto shadow-lg`}
        >
          生成分析报告
        </Button>
      </div>
    </div>
  );
};
