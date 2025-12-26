export const CONFIG = {
  TICK_RATE: 1000, // Update every second
  DECAY_RATES: {
    hunger: 0.5,
    mood: 0.5,
    cleanliness: 0.5,
  },
  LEVEL_UP_EXP: 100,
  MAX_STATS: 100,
};

export const INITIAL_STATE = {
  hunger: 80,
  mood: 80,
  cleanliness: 80,
  health: 100,
  level: 1,
  exp: 0,
  lastUpdate: Date.now(),
};

export const STORAGE_KEY = 'penguin_pet_state';
