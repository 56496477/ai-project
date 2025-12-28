import { useGameStore } from '../store/gameStore';
import clsx from 'clsx';
import { Heart, Utensils, Smile, Sparkles, Brain, Coins } from 'lucide-react';

const ProgressBar = ({ label, value, color, max = 100, icon: Icon }: { label: string, value: number, color: string, max?: number, icon: any }) => (
  <div className="flex flex-col w-full mb-3">
    <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1">
      <div className="flex items-center gap-1">
        <Icon size={14} className="text-gray-500" />
        <span>{label}</span>
      </div>
      <span className="opacity-70">{Math.floor(value)}/{max}</span>
    </div>
    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner">
      <div 
        className={clsx("h-full transition-all duration-500 ease-out shadow-sm", color)} 
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  </div>
);

export const StatsDisplay = () => {
  const stats = useGameStore((state) => state.stats);
  const level = useGameStore((state) => state.level);
  const exp = useGameStore((state) => state.exp);
  const coins = useGameStore((state) => state.coins);

  return (
    <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50 w-64 absolute top-2 left-2 z-20 animate-fade-in transition-all hover:bg-white/90">
      <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Lv.{level}</h2>
          <div className="flex items-center gap-1 text-yellow-500 font-bold text-xs mt-1 bg-yellow-50 px-2 py-0.5 rounded-full w-fit">
            <Coins size={12} />
            <span>{coins}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 font-bold mb-1">EXP</div>
          <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div className="h-full bg-blue-500 w-full" style={{ width: `${exp}%` }} />
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <ProgressBar label="健康 (Health)" value={stats.health} color="bg-rose-500" icon={Heart} />
        <ProgressBar label="饥饿 (Hunger)" value={stats.hunger} color="bg-orange-500" icon={Utensils} />
        <ProgressBar label="心情 (Mood)" value={stats.mood} color="bg-yellow-400" icon={Smile} />
        <ProgressBar label="清洁 (Hygiene)" value={stats.hygiene} color="bg-cyan-400" icon={Sparkles} />
        <ProgressBar label="智慧 (IQ)" value={stats.intelligence} color="bg-purple-500" icon={Brain} />
      </div>
    </div>
  );
};
