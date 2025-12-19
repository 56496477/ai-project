import React, { useState } from 'react';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Logo } from './components/Logo';
import { generateMockQuestions, generateMockResult } from './mockData';
import type { Category, Question } from './types';

function App() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState('');

  // Default theme if no category selected
  const currentTheme = selectedCategory?.theme || {
    primary: 'bg-indigo-600',
    background: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    accent: 'text-indigo-600',
  };

  const handleStep1Next = (data: { categoryId: string, description: string }) => {
    // In real app, we would send description to backend to get questions
    const qs = generateMockQuestions(data.description);
    setQuestions(qs);
    setStep(2);
  };

  const handleStep2Next = (answers: Record<string, string>) => {
    // In real app, send answers to backend
    console.log(answers);
    const res = generateMockResult();
    setResult(res);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedCategory(undefined);
    setQuestions([]);
    setResult('');
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ease-in-out ${currentTheme.background} flex flex-col relative overflow-hidden font-sans`}>
      <AnimatedBackground />
      
      <header className="p-8 flex justify-center sticky top-0 z-50">
        <div className="bg-white/30 backdrop-blur-md px-8 py-4 rounded-full shadow-sm border border-white/40">
          <Logo />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center w-full z-10 relative">
        {step === 1 && (
          <Step1
            onNext={handleStep1Next}
            selectedCategoryId={selectedCategory?.id}
            onCategorySelect={setSelectedCategory}
          />
        )}
        {step === 2 && (
          <Step2
            questions={questions}
            onNext={handleStep2Next}
            themeColor={currentTheme.primary}
          />
        )}
        {step === 3 && (
          <Step3
            result={result}
            onReset={handleReset}
            themeColor={currentTheme.primary}
          />
        )}
      </main>
      
      <footer className="p-8 text-center text-gray-500 text-sm font-medium relative z-10">
        © 2025 ThinkAuto 智能咨询平台
      </footer>
    </div>
  );
}

export default App;
