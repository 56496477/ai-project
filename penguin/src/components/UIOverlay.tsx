import React from 'react';
import type { PetState } from '../types';
import { CONFIG } from '../constants';

interface UIOverlayProps {
  state: PetState;
  actionLog: string;
  onFeed: () => void;
  onClean: () => void;
  onPlay: () => void;
  onSleep: () => void;
}

const ProgressBar = ({ value, max = 100, color, label }: { value: number, max?: number, color: string, label: string }) => (
  <div className="stat-bar-container">
    <div className="stat-label">{label}</div>
    <div className="progress-bg">
      <div 
        className="progress-fill" 
        style={{ 
          width: `${Math.min(100, (value / max) * 100)}%`,
          backgroundColor: color
        }} 
      />
    </div>
    <div className="stat-value">{Math.round(value)}/{max}</div>
  </div>
);

const UIOverlay: React.FC<UIOverlayProps> = ({ state, actionLog, onFeed, onClean, onPlay, onSleep }) => {
  return (
    <div className="ui-overlay">
      {/* Top Info */}
      <div className="top-panel">
        <div className="level-badge">
          <span>Lv.{state.level}</span>
        </div>
        <div className="exp-bar-wrapper">
          <ProgressBar 
            value={state.exp} 
            max={state.level * CONFIG.LEVEL_UP_EXP} 
            color="#4CAF50" 
            label="EXP" 
          />
        </div>
      </div>

      {/* Stats Panel */}
      <div className="stats-panel">
        <ProgressBar value={state.health} color="#F44336" label="Health" />
        <ProgressBar value={state.hunger} color="#FF9800" label="Hunger" />
        <ProgressBar value={state.cleanliness} color="#2196F3" label="Clean" />
        <ProgressBar value={state.mood} color="#E91E63" label="Mood" />
      </div>

      {/* Action Log Panel */}
      <div className="action-log-panel">
        <p>{actionLog}</p>
      </div>

      {/* Bottom Toolbar */}
      <div className="toolbar">
        <button className="action-btn" onClick={onFeed} disabled={state.hunger >= 100}>
          🍖 Feed
        </button>
        <button className="action-btn" onClick={onClean} disabled={state.cleanliness >= 100}>
          🛁 Clean
        </button>
        <button className="action-btn" onClick={onPlay} disabled={state.hunger <= 10}>
          ⚽ Play
        </button>
        <button className="action-btn" onClick={onSleep}>
          💤 Sleep
        </button>
      </div>
    </div>
  );
};

export default UIOverlay;
