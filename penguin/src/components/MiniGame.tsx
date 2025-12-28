import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import clsx from 'clsx';
import { X } from 'lucide-react';

const CHOICES = [
  { id: 'rock', label: '石头', icon: '✊' },
  { id: 'paper', label: '布', icon: '✋' },
  { id: 'scissors', label: '剪刀', icon: '✌️' },
] as const;

type Choice = typeof CHOICES[number]['id'];

export const MiniGame = ({ onClose }: { onClose: () => void }) => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [pcChoice, setPcChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { addCoins, updateStats, showDialog } = useGameStore();

  const handlePlay = (choice: Choice) => {
    if (isAnimating) return;
    
    setPlayerChoice(choice);
    setIsAnimating(true);
    setResult(null);
    setPcChoice(null);

    // Simulate thinking time
    setTimeout(() => {
      const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
      setPcChoice(randomChoice);
      setIsAnimating(false);
      
      determineWinner(choice, randomChoice);
    }, 1000);
  };

  const determineWinner = (player: Choice, pc: Choice) => {
    let res: 'win' | 'lose' | 'draw';
    
    if (player === pc) {
      res = 'draw';
    } else if (
      (player === 'rock' && pc === 'scissors') ||
      (player === 'paper' && pc === 'rock') ||
      (player === 'scissors' && pc === 'paper')
    ) {
      res = 'win';
      addCoins(20);
      updateStats({ mood: 10 });
      showDialog("耶！赢了！(+20金币)");
    } else {
      res = 'lose';
      updateStats({ mood: -5 });
      showDialog("呜呜...输了...");
    }
    
    setResult(res);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="animate-fade-in-up w-full max-w-sm px-4">
        <div className="bg-white/95 rounded-[32px] p-8 shadow-2xl shadow-black/20 border border-white/60 flex flex-col items-center gap-8 relative overflow-hidden">
          
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all active:scale-95"
          >
            <X size={24} />
          </button>

          <h3 className="text-2xl font-black text-gray-800 tracking-tight">猜拳对决</h3>

          <div className="flex justify-between items-center w-full px-2">
            <div className="flex flex-col items-center gap-3">
              <div className="text-xs font-bold text-gray-400 tracking-widest uppercase bg-gray-50 px-3 py-1 rounded-full">You</div>
              <div className={clsx(
                "text-6xl transition-transform duration-300 filter drop-shadow-lg",
                isAnimating ? "animate-bounce" : "hover:scale-110"
              )}>
                {playerChoice ? CHOICES.find(c => c.id === playerChoice)?.icon : '❓'}
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-gray-200 italic">VS</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="text-xs font-bold text-gray-400 tracking-widest uppercase bg-gray-50 px-3 py-1 rounded-full">Pet</div>
              <div className={clsx(
                "text-6xl transition-transform duration-300 filter drop-shadow-lg",
                isAnimating ? "animate-spin" : "hover:scale-110"
              )}>
                {pcChoice ? CHOICES.find(c => c.id === pcChoice)?.icon : '❓'}
              </div>
            </div>
          </div>

          <div className="h-12 flex items-center justify-center w-full">
            {result ? (
              <div className={clsx(
                "px-6 py-2 rounded-2xl font-bold text-sm animate-fade-in-up shadow-sm flex items-center gap-2",
                result === 'win' ? "bg-yellow-50 text-yellow-600 border border-yellow-100" : 
                result === 'lose' ? "bg-gray-50 text-gray-500 border border-gray-100" : "bg-blue-50 text-blue-500 border border-blue-100"
              )}>
                {result === 'win' ? '🎉 胜利！获得20金币' : result === 'lose' ? '💨 遗憾落败' : '🤝 平局，再来一次！'}
              </div>
            ) : (
              <div className="text-sm text-gray-400 font-medium animate-pulse">请出拳...</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            {CHOICES.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handlePlay(choice.id)}
                disabled={isAnimating}
                className="group relative flex flex-col items-center justify-center py-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
              >
                <span className="text-3xl mb-1 transition-transform group-hover:scale-110 duration-300">{choice.icon}</span>
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors">{choice.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
