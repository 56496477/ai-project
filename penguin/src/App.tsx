import React from 'react';
import { usePetGame } from './hooks/usePetGame';
import PetCanvas from './components/PetCanvas';
import UIOverlay from './components/UIOverlay';
import './App.css';

function App() {
  const { state, animation, actionLog, actions } = usePetGame();

  return (
    <div className="app-container">
      <PetCanvas animation={animation} />
      <UIOverlay 
        state={state}
        actionLog={actionLog}
        onFeed={actions.feed}
        onClean={actions.clean}
        onPlay={actions.play}
        onSleep={actions.sleep}
      />
    </div>
  );
}

export default App;
