import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import clsx from 'clsx';
import { Utensils, ShowerHead, Gamepad2, Briefcase, BookOpen, Pill } from 'lucide-react';

const ActionButton = ({ onClick, label, icon: Icon, active = false }: { onClick: () => void, label: string, icon: any, active?: boolean }) => (
  <button
    onClick={onClick}
    className={clsx(
      "group flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl transition-all duration-300 transform active:scale-95",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 -translate-y-4 scale-110" 
        : "bg-white/60 backdrop-blur-md text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:scale-110 border border-white/60"
    )}
  >
    <Icon size={26} strokeWidth={2} className="transition-transform group-hover:scale-110" />
    <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100">{label}</span>
  </button>
);

const SubMenu = ({ items, onSelect, onClose }: { items: { label: string, id: string }[], onSelect: (id: any) => void, onClose: () => void }) => (
  <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-30">
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-2 border border-white/50 flex flex-col gap-1 min-w-[140px] animate-fade-in-up origin-bottom">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => { onSelect(item.id); onClose(); }}
          className="text-center px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 text-sm rounded-xl text-gray-600 font-bold transition-colors"
        >
          {item.label}
        </button>
      ))}
      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 rotate-45 border-r border-b border-white/50"></div>
    </div>
  </div>
);

export const ActionMenu = ({ onPlayClick }: { onPlayClick?: () => void }) => {
  const store = useGameStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handlePlay = () => {
    if (onPlayClick) {
      onPlayClick();
    } else {
      store.play();
    }
    setActiveMenu(null);
  };

  return (
    <div className="z-20 mt-8">
      <div className="flex items-end gap-3 px-6 py-4 bg-white/40 backdrop-blur-md rounded-[32px] border border-white/40 shadow-2xl shadow-black/5">
        
        {/* Feed Menu */}
        <div className="relative">
          {activeMenu === 'feed' && (
            <SubMenu 
              onClose={() => setActiveMenu(null)}
              onSelect={(id) => store.feed(id)}
              items={[
                { label: '零食 (-10)', id: 'snack' },
                { label: '快餐 (-30)', id: 'meal' },
                { label: '大餐 (-100)', id: 'feast' },
                { label: '喝水 (免费)', id: 'water' },
                { label: '咖啡 (-15)', id: 'coffee' },
                { label: '冷饮 (-5)', id: 'drink' },
              ]}
            />
          )}
          <ActionButton label="喂食" icon={Utensils} onClick={() => toggleMenu('feed')} active={activeMenu === 'feed'} />
        </div>

        {/* Basic Actions */}
        <ActionButton label="清洁 (-20)" icon={ShowerHead} onClick={() => { store.clean(); setActiveMenu(null); }} />
        <ActionButton label="玩耍" icon={Gamepad2} onClick={handlePlay} />
        
        {/* Medical Menu */}
        <div className="relative">
          {activeMenu === 'treat' && (
            <SubMenu 
              onClose={() => setActiveMenu(null)}
              onSelect={(id) => store.treat(id)}
              items={[
                { label: '打针 (-200)', id: 'shot' },
                { label: '吃药 (-100)', id: 'pill' },
                { label: '手术 (-1000)', id: 'surgery' },
              ]}
            />
          )}
          <ActionButton label="治疗" icon={Pill} onClick={() => toggleMenu('treat')} active={activeMenu === 'treat'} />
        </div>

        {/* Study Menu */}
        <div className="relative">
          {activeMenu === 'study' && (
            <SubMenu 
              onClose={() => setActiveMenu(null)}
              onSelect={(id) => store.startStudy(parseInt(id))}
              items={[
                { label: '学习 1分钟', id: '1' },
                { label: '学习 2分钟', id: '2' },
                { label: '学习 3分钟', id: '3' },
              ]}
            />
          )}
          <ActionButton label="学习" icon={BookOpen} onClick={() => toggleMenu('study')} active={activeMenu === 'study'} />
        </div>

        {/* Work Menu */}
        <div className="relative">
          {activeMenu === 'work' && (
            <SubMenu 
              onClose={() => setActiveMenu(null)}
              onSelect={(id) => store.startWork(parseInt(id))}
              items={[
                { label: '打工 1分钟', id: '1' },
                { label: '打工 2分钟', id: '2' },
                { label: '打工 3分钟', id: '3' },
              ]}
            />
          )}
          <ActionButton label="打工" icon={Briefcase} onClick={() => toggleMenu('work')} active={activeMenu === 'work'} />
        </div>

      </div>
    </div>
  );
};
