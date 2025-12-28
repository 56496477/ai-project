import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useGameLoop = () => {
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    // Tick every 10 seconds for testing (production might be 1 min)
    const interval = setInterval(() => {
      tick();
    }, 10000);

    return () => clearInterval(interval);
  }, [tick]);
};
