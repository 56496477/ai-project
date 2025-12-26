export interface PetState {
  hunger: number;
  mood: number;
  cleanliness: number;
  health: number;
  level: number;
  exp: number;
  lastUpdate: number;
}

export type AnimationState = 'IDLE' | 'WALK' | 'JUMP' | 'EAT' | 'SHOWER' | 'SLEEP' | 'PLAY';

export interface PetAction {
  type: 'FEED' | 'PLAY' | 'CLEAN' | 'SLEEP';
}
