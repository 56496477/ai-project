import { useState, useEffect, useCallback } from 'react';
import type { PetState, AnimationState } from '../types';
import { CONFIG, INITIAL_STATE, STORAGE_KEY } from '../constants';

export const usePetGame = () => {
  const [state, setState] = useState<PetState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });
  const [animation, setAnimation] = useState<AnimationState>('IDLE');
  const [actionLog, setActionLog] = useState<string>('企鹅正安静地站在原地，期待着主人的互动。');

  // Game Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => {
        const newHunger = prev.hunger - CONFIG.DECAY_RATES.hunger;
        const newMood = prev.mood - CONFIG.DECAY_RATES.mood;
        const newCleanliness = prev.cleanliness - CONFIG.DECAY_RATES.cleanliness;
        let healthChange = 0;
        
        if (newHunger < 20) healthChange -= 0.1;
        if (newCleanliness < 20) healthChange -= 0.1;

        // Level Up Logic
        let newLevel = prev.level;
        let newExp = prev.exp;
        
        if (newExp >= newLevel * CONFIG.LEVEL_UP_EXP) {
          newExp -= newLevel * CONFIG.LEVEL_UP_EXP;
          newLevel += 1;
        }

        const newState = {
          ...prev,
          hunger: Math.max(0, newHunger),
          mood: Math.max(0, newMood),
          cleanliness: Math.max(0, newCleanliness),
          health: Math.max(0, Math.min(100, prev.health + healthChange)),
          level: newLevel,
          exp: newExp,
          lastUpdate: Date.now(),
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        return newState;
      });
    }, CONFIG.TICK_RATE);

    return () => clearInterval(timer);
  }, []);

  const feed = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      exp: prev.exp + 5,
    }));
    setAnimation('EAT');
    setActionLog('企鹅快乐地张开嘴巴，一口吞下了一条漂浮在空中的蓝色小鱼，满足地吧唧着嘴。');
    setTimeout(() => {
      setAnimation('IDLE');
      setActionLog('企鹅吃饱了，满意地拍了拍圆滚滚的肚子，继续期待着下一次互动。');
    }, 2000);
  }, []);

  const clean = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cleanliness: Math.min(100, prev.cleanliness + 40),
      exp: prev.exp + 5,
    }));
    setAnimation('SHOWER');
    setActionLog('企鹅站在淋浴下，开心地抖动身体，周围飘满了晶莹剔透的肥皂泡，享受着清凉的沐浴。');
    setTimeout(() => {
      setAnimation('IDLE');
      setActionLog('企鹅洗完澡了，浑身散发着清新的香气，精神焕发地站在原地。');
    }, 2000);
  }, []);

  const play = useCallback(() => {
    setState((prev) => ({
      ...prev,
      mood: Math.min(100, prev.mood + 20),
      exp: prev.exp + 10,
    }));
    setAnimation('PLAY');
    setActionLog('企鹅左右摇摆着胖乎乎的身体，兴奋地追逐着足球，最后来了一个帅气的射门！');
    setTimeout(() => {
      setAnimation('IDLE');
      setActionLog('企鹅玩累了，停下脚步喘了口气，眨着大眼睛看着你。');
    }, 4000);
  }, []);

  const sleep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      health: Math.min(100, prev.health + 20),
      exp: prev.exp + 10,
    }));
    setAnimation('SLEEP');
    setActionLog('企鹅趴在地上，歪着小脑袋进入梦乡，头顶冒出了一个个白色的"Z"字气泡，看起来睡得很香。');
    setTimeout(() => {
      setAnimation('IDLE');
      setActionLog('企鹅睡醒了，伸了个大大的懒腰，揉了揉惺忪的睡眼。');
    }, 6000); // Sleep for 6 seconds
  }, []);

  return {
    state,
    animation,
    actionLog,
    actions: { feed, clean, play, sleep }
  };
};
