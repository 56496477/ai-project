import { StatsDisplay } from './components/StatsDisplay';
import { ActionMenu } from './components/ActionMenu';
import { PetDisplay } from './components/PetDisplay';
import { MiniGame } from './components/MiniGame';
import { useGameLoop } from './hooks/useGameLoop';
import { useState } from 'react';

function App() {
  // Start the game loop
  useGameLoop();
  
  const [showMiniGame, setShowMiniGame] = useState(false);
  
  // Intercept the play action to show mini-game instead
  // Actually, we should probably modify ActionMenu to handle this state, 
  // or expose a way to toggle it.
  // For simplicity, let's pass a handler to ActionMenu
  
  return (
    <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
      {/* Background Overlay if needed, but body has gradient */}
      
      {/* Mini Game Overlay */}
      {showMiniGame && <MiniGame onClose={() => setShowMiniGame(false)} />}

      {/* Game UI */}
      <StatsDisplay />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center w-full h-full">
        <PetDisplay />
        <ActionMenu onPlayClick={() => setShowMiniGame(true)} />
      </main>

      {/* Version/Footer - Removed */}
    </div>
  );
}

export default App;
