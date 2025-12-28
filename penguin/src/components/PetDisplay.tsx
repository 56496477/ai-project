import { useEffect, useState } from 'react';
import { RufflePlayer } from './RufflePlayer';
import { useGameStore } from '../store/gameStore';
import { DialogueBox } from './DialogueBox';
import { Briefcase, BookOpen, Clock } from 'lucide-react';

export const PetDisplay = () => {
  const currentAnim = useGameStore((state) => state.currentAnim);
  const isLooping = useGameStore((state) => state.isLooping);
  const dialog = useGameStore((state) => state.dialog);
  const resetAnimation = useGameStore((state) => state.resetAnimation);
  const clickEgg = useGameStore((state) => state.clickEgg);
  const isEgg = useGameStore((state) => state.isEgg);
  const workEndTime = useGameStore((state) => state.workEndTime);
  const workType = useGameStore((state) => state.workType);
  const [timeLeft, setTimeLeft] = useState('');

  // Update countdown
  useEffect(() => {
    if (workEndTime > 0) {
      const updateTimer = () => {
        const diff = Math.max(0, workEndTime - Date.now());
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [workEndTime]);

  // Auto-reset non-looping animations after a duration
  useEffect(() => {
    if (!isLooping && currentAnim) {
      // Estimate duration based on animation type or default to 5s
      const timer = setTimeout(() => {
        resetAnimation();
      }, 5000); // 5 seconds default for actions
      return () => clearTimeout(timer);
    }
  }, [currentAnim, isLooping, resetAnimation]);

  const handleInteraction = () => {
    if (isEgg) {
      clickEgg();
    } else {
      // Petting logic is handled by "play" action mostly, but clicking could trigger a reaction
      // For now, let's just make it a simple interaction
      // We can invoke a "touch" action if we added one
      console.log("Touched pet");
    }
  };

  if (currentAnim === 'HIDDEN') {
    return (
      <div className="relative w-[500px] h-[500px] flex justify-center items-center select-none">
        {workEndTime > 0 ? (
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 animate-pulse border border-white/50">
            {workType === 'work' ? (
              <Briefcase size={48} className="text-blue-500" />
            ) : (
              <BookOpen size={48} className="text-purple-500" />
            )}
            <div className="text-xl font-bold text-gray-700">
              {workType === 'work' ? '努力打工中...' : '专心学习中...'}
            </div>
            <div className="flex items-center gap-2 text-gray-500 font-mono text-lg font-bold bg-white/50 px-4 py-1 rounded-lg">
              <Clock size={20} />
              {timeLeft}
            </div>
          </div>
        ) : (
          dialog.visible && <DialogueBox text={dialog.text} />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-[500px] h-[500px] flex justify-center items-center select-none">
      {/* Dialog Bubble - Inside container but positioned absolutely */}
      {dialog.visible && (
        <DialogueBox text={dialog.text} />
      )}

      {/* Pet Container */}
      <div 
        className="w-full h-full cursor-pointer transition-transform active:scale-95"
        onClick={handleInteraction}
      >
        <RufflePlayer 
          swfUrl={currentAnim} 
          width="100%" 
          height="100%" 
        />
      </div>
    </div>
  );
};
