import { create } from 'zustand';
import { RESOURCES, ANIMATION_PRIORITY } from '../constants/resources';

interface Stats {
  health: number;
  hunger: number;
  mood: number;
  hygiene: number;
  intelligence: number;
}

interface DialogState {
  text: string;
  visible: boolean;
  timestamp: number;
}

interface GameState {
  // Core Stats
  stats: Stats;
  level: number;
  exp: number;
  coins: number;
  age: number; // In game days
  gameTime: number; // In game minutes (starts at 0)
  isEgg: boolean;
  eggClicks: number;

  // Animation State
  currentAnim: string;
  animPriority: number;
  isLooping: boolean; // If current animation should loop (e.g. sick, hungry)

  // Dialog System
  dialog: DialogState;

  // Work/Study State
  workEndTime: number;
  workType: 'work' | 'study' | null;
  workDuration: number; // in minutes

  // Health Decay State
  lowHungerStartTime: number;
  lowMoodStartTime: number;

  // Actions
  clickEgg: () => void;
  addExp: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  updateStats: (changes: Partial<Stats>) => void;
  setAnimation: (anim: string, priority: number, loop?: boolean) => void;
  resetAnimation: () => void;
  showDialog: (text: string, duration?: number) => void;
  hideDialog: () => void;
  tick: () => void;
  
  // Specific Interactions
  feed: (type: 'snack' | 'meal' | 'feast' | 'water' | 'coffee' | 'drink') => void;
  clean: () => void;
  treat: (type: 'shot' | 'pill' | 'surgery') => void;
  play: () => void;
  startWork: (duration: number) => void;
  startStudy: (duration: number) => void;
  cancelWork: () => void;
}

const MAX_EXP = 100;
const INITIAL_STATS: Stats = {
  health: 100,
  hunger: 80,
  mood: 80,
  hygiene: 100,
  intelligence: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  stats: { ...INITIAL_STATS },
  level: 1, // Start at level 1 but isEgg=true effectively means level 0 stage
  exp: 0,
  coins: 100, // Initial coins
  age: 1,
  gameTime: 0,
  isEgg: true,
  eggClicks: 0,

  workEndTime: 0,
  workType: null,
  workDuration: 0,
  lowHungerStartTime: 0,
  lowMoodStartTime: 0,

  currentAnim: RESOURCES.BIRTH.EGG, // Initially just a placeholder or egg image
  animPriority: ANIMATION_PRIORITY.HIGH, // Egg state is high priority
  isLooping: true,

  dialog: {
    text: '',
    visible: false,
    timestamp: 0,
  },

  clickEgg: () => {
    const { isEgg, eggClicks } = get();
    if (!isEgg) return;

    const newClicks = eggClicks + 1;
    if (newClicks >= 10) {
      // Hatch!
      set({ 
        isEgg: false, 
        eggClicks: 0,
        currentAnim: RESOURCES.BIRTH.EGG, // Hatch animation
        animPriority: ANIMATION_PRIORITY.HIGH,
        isLooping: false,
      });
      get().showDialog("哇！终于见到主人啦！最喜欢你了~");
    } else {
      set({ eggClicks: newClicks });
      // Could add wobble animation here if we had one
    }
  },

  addExp: (amount: number) => {
    const { exp, level } = get();
    let newExp = exp + amount;
    let newLevel = level;

    if (newExp >= MAX_EXP) {
      newExp -= MAX_EXP;
      newLevel += 1;
      // Level Up!
      set({ 
        level: newLevel, 
        exp: newExp,
      });
      get().setAnimation(RESOURCES.UPGRADE.LEVEL_UP, ANIMATION_PRIORITY.HIGH, false);
      get().showDialog("升级啦！感觉充满了力量！");
    } else {
      set({ exp: newExp });
    }
  },

  addCoins: (amount: number) => {
    set((state) => ({ coins: state.coins + amount }));
  },

  spendCoins: (amount: number) => {
    const { coins } = get();
    if (coins >= amount) {
      set({ coins: coins - amount });
      return true;
    }
    get().showDialog("金币不够了呢... 主人带我去打工好不好？");
    return false;
  },

  updateStats: (changes) => {
    set((state) => {
      const newStats = { ...state.stats };
      (Object.keys(changes) as Array<keyof Stats>).forEach((key) => {
        if (changes[key] !== undefined) {
          newStats[key] = Math.max(0, Math.min(100, (newStats[key] || 0) + changes[key]!));
        }
      });
      return { stats: newStats };
    });
  },

  setAnimation: (anim, priority, loop = false) => {
    const { animPriority, currentAnim } = get();
    // Only override if new priority >= current priority
    // Or if it's the same animation (refresh)
    if (priority >= animPriority || anim === currentAnim) {
      set({ 
        currentAnim: anim, 
        animPriority: priority, 
        isLooping: loop 
      });
    }
  },

  resetAnimation: () => {
    // Check status to decide what to play next
    const { stats, isEgg, workEndTime } = get();
    if (isEgg) return;

    // If working, hide the pet (after exit animation finishes)
    if (workEndTime > 0) {
        set({ 
          currentAnim: 'HIDDEN', 
          animPriority: ANIMATION_PRIORITY.MAX, 
          isLooping: true 
        });
        return;
    }

    // Check abnormal states
    if (stats.health < 40) {
      set({ 
        currentAnim: RESOURCES.SICK.COLD, 
        animPriority: ANIMATION_PRIORITY.HIGH, 
        isLooping: true 
      });
      get().showDialog("呜呜... 头好晕，不舒服...");
      return;
    }
    if (stats.hunger < 20) {
      set({ 
        currentAnim: RESOURCES.EAT.HUNGRY, 
        animPriority: ANIMATION_PRIORITY.HIGH, 
        isLooping: true 
      });
      get().showDialog("肚子咕咕叫了... 主人我想吃好吃的~");
      return;
    }
    if (stats.hygiene < 30) {
      set({ 
        currentAnim: RESOURCES.CLEAN.ITCHY, 
        animPriority: ANIMATION_PRIORITY.HIGH, 
        isLooping: true 
      });
      get().showDialog("身上痒痒的，想洗个香香的澡~");
      return;
    }

    // Default to Idle
    set({ 
      currentAnim: RESOURCES.DAILY.IDLE, 
      animPriority: ANIMATION_PRIORITY.IDLE, 
      isLooping: true 
    });
  },

  showDialog: (text, duration = 4000) => {
    set({ 
      dialog: { 
        text, 
        visible: true, 
        timestamp: Date.now() 
      } 
    });
    setTimeout(() => {
      // Only hide if it's still the same dialog
      const { dialog } = get();
      if (dialog.text === text && Date.now() - dialog.timestamp >= duration - 100) {
         set((state) => ({ dialog: { ...state.dialog, visible: false } }));
      }
    }, duration);
  },

  hideDialog: () => {
    set((state) => ({ dialog: { ...state.dialog, visible: false } }));
  },

  tick: () => {
    const { isEgg, workEndTime, workType, lowHungerStartTime, lowMoodStartTime, stats } = get();
    if (isEgg) return;

    // 0. Check Death
    if (stats.health <= 0) {
      if (get().currentAnim !== RESOURCES.DEAD.TOMBSTONE) {
         get().setAnimation(RESOURCES.DEAD.TOMBSTONE, ANIMATION_PRIORITY.MAX, true);
         get().showDialog("...");
      }
      return;
    }

    // Update Game Time & Age
    // 1 Real Sec = 12 Game Mins
    const ticks = 1; // tick() is called every ~1s roughly
    const minsPerTick = 12; 
    const newGameTime = get().gameTime + minsPerTick;
    const newAge = Math.floor(newGameTime / (24 * 60)) + 1; // Start at day 1
    
    set({ gameTime: newGameTime, age: newAge });

    // 1. Work/Study Check
    if (workEndTime > 0) {
      const now = Date.now();
      if (now >= workEndTime) {
        // Work Finished
        
        const duration = get().workDuration; // seconds now
        let earnedCoins = 0;
        let earnedExp = 0;
        let gainedIntel = 0;
        let hungerCost = 0;
        let moodCost = 0;

        // Scaling based on Game Time (10s = 2h)
        // Work: 15 coins / game hour
        // Study: Cost 5 coins / game hour, +2 Intel / game hour
        // Decay: Hunger -5/h, Mood -5/h
        
        // 10s = 120 game mins = 2 hours
        const gameHours = (duration * 12) / 60; // duration is sec, * 12 = mins

        if (workType === 'work') {
           const wagePerHour = 15;
           earnedCoins = Math.floor(wagePerHour * gameHours * (1 + stats.intelligence * 0.01));
           hungerCost = 5 * gameHours;
           moodCost = 5 * gameHours;
           earnedExp = Math.ceil(5 * gameHours); 
        } else {
           // Study
           gainedIntel = Math.ceil(2 * gameHours);
           earnedExp = Math.ceil(3 * gameHours);
           hungerCost = 3 * gameHours;
        }

        get().addCoins(earnedCoins);
        get().addExp(earnedExp);
        get().updateStats({ 
           intelligence: gainedIntel, 
           hunger: -hungerCost, 
           mood: -moodCost 
        });

        // Reset Work State
        set({ workEndTime: 0, workType: null, workDuration: 0 });
        
        // Random Return Animation
        const returnAnims = [RESOURCES.EXIT.ENTER, RESOURCES.EXIT.ENTER2, RESOURCES.EXIT.ENTER3];
        const randomReturnAnim = returnAnims[Math.floor(Math.random() * returnAnims.length)];
        
        set({ animPriority: ANIMATION_PRIORITY.IDLE }); 
        get().setAnimation(randomReturnAnim, ANIMATION_PRIORITY.HIGH, false);
        
        if (workType === 'work') {
            get().showDialog(`我回来啦！赚到了 ${earnedCoins} 金币，厉害吧！`);
        } else {
            get().showDialog(`学习完啦！感觉变聪明了呢！(智力 +${gainedIntel})`);
        }
        
        return; 
      } else {
        // Still working
        if (Math.random() < 0.1) {
             get().showDialog(workType === 'work' ? "呼哧呼哧... 加油干活！" : "好好学习... 天天向上...");
        }
        return; // Skip normal tick decay
      }
    }

    // 2. Natural Decay (Idle)
    // 1 Tick = 12 Game Mins = 0.2 Game Hours
    // Hunger: -5 / hour => -1 / tick
    // Hygiene: -2 / hour => -0.4 / tick
    // Mood: -5 / hour => -1 / tick
    
    get().updateStats({
      hunger: -1,
      hygiene: -0.4,
      mood: -1,
    });
    
    // 3. Health Decay (Sickness Logic)
    let healthDrop = 0;
    const now = Date.now();

    // Hunger Check
    if (stats.hunger < 20) {
       if (lowHungerStartTime === 0) {
         set({ lowHungerStartTime: now });
       } else if (now - lowHungerStartTime > 30 * 60 * 1000) {
         // > 30 mins
         healthDrop += 2; // Per minute? 
         // Since this runs every 10s, we should drop 2/6 = 0.33 per tick
         // Or just drop 0.5 per tick to be safe.
         healthDrop = 0.5; 
       }
    } else {
       if (lowHungerStartTime !== 0) set({ lowHungerStartTime: 0 });
    }

    // Mood Check
    if (stats.mood < 20) {
       if (lowMoodStartTime === 0) {
         set({ lowMoodStartTime: now });
       } else if (now - lowMoodStartTime > 60 * 60 * 1000) {
         healthDrop += 0.2; // 1/min => ~0.16/10s
       }
    } else {
       if (lowMoodStartTime !== 0) set({ lowMoodStartTime: 0 });
    }

    if (healthDrop > 0) {
       get().updateStats({ health: -healthDrop });
    }

    // 4. Random Animations (Idle)
    const { animPriority } = get();
    if (animPriority === ANIMATION_PRIORITY.IDLE && Math.random() < 0.1) {
      const randomAnims = [
        RESOURCES.DAILY.SCRATCH, RESOURCES.DAILY.LOOK_DL, RESOURCES.DAILY.LOOK_UL,
        RESOURCES.DAILY.PLAY, RESOURCES.DAILY.NOD, RESOURCES.DAILY.SHAKE,
        RESOURCES.DAILY.SHY, RESOURCES.DAILY.KISS, RESOURCES.DAILY.HAND
      ];
      const randomAnim = randomAnims[Math.floor(Math.random() * randomAnims.length)];
      get().setAnimation(randomAnim, ANIMATION_PRIORITY.LOW, false);
      
      const randomTalks = ["今天天气真不错~", "主人在干什么呢？", "好无聊啊...", "嘿嘿~"];
      if (Math.random() < 0.3) {
         get().showDialog(randomTalks[Math.floor(Math.random() * randomTalks.length)]);
      }
    }
    
    // 5. State Check (Reset Anim if needed)
    if (animPriority <= ANIMATION_PRIORITY.IDLE) {
       get().resetAnimation();
    }
  },

  // Interactions
  feed: (type) => {
    if (get().stats.health <= 0) return;
    if (get().workEndTime > 0) { get().showDialog("正在忙呢，不能吃东西！"); return; }

    let resource = RESOURCES.EAT.SNACK;
    let hungerGain = 10;
    let moodGain = 2;
    let cost = 0;
    
    switch(type) {
      case 'snack': resource = RESOURCES.EAT.SNACK; hungerGain = 10; moodGain=2; cost=10; break;
      case 'meal': resource = RESOURCES.EAT.FAST_FOOD; hungerGain = 40; moodGain=5; cost=30; break;
      case 'feast': resource = RESOURCES.EAT.FEAST; hungerGain = 100; moodGain=20; cost=100; break;
      case 'water': resource = RESOURCES.EAT.WATER; hungerGain = 0; moodGain=0; cost=0; break; // Special: thirst? Using hunger for now.
      case 'coffee': resource = RESOURCES.EAT.COFFEE; hungerGain = 0; moodGain=5; cost=15; break;
      case 'drink': resource = RESOURCES.EAT.DRINK; hungerGain = 5; moodGain=2; cost=5; break;
    }

    // Check money
    if (cost > 0 && !get().spendCoins(cost)) return;

    get().updateStats({ hunger: hungerGain, mood: moodGain });
    get().addExp(2);
    get().setAnimation(resource, ANIMATION_PRIORITY.MEDIUM, false);
    get().showDialog("哇！太好吃了！谢谢主人~");
  },

  clean: () => {
    if (get().stats.health <= 0) return;
    if (get().workEndTime > 0) return;
    
    const cost = 20;
    if (!get().spendCoins(cost)) return;

    get().updateStats({ hygiene: 100, mood: 5 });
    get().addExp(5);
    get().setAnimation(RESOURCES.CLEAN.BATH, ANIMATION_PRIORITY.MEDIUM, false);
    get().showDialog("洗完澡好舒服呀！香喷喷的~");
  },

  play: () => {
    if (get().stats.health <= 0) return;
    if (get().workEndTime > 0) return;

    // Play is free but consumes hunger
    get().updateStats({ mood: 5, hunger: -5 });
    get().addExp(5);
    get().setAnimation(RESOURCES.DAILY.PLAY, ANIMATION_PRIORITY.MEDIUM, false);
    get().showDialog("嘻嘻！最喜欢和主人玩了！");
  },

  treat: (type) => {
    if (get().workEndTime > 0) return;
    
    // Allow treating if dead? "Resurrection potion" needed for dead.
    // If just sick (health > 0 but low), use these.
    if (get().stats.health <= 0) {
        get().showDialog("它已经离开我们了... (需要复活药水)");
        return;
    }

    let resource = RESOURCES.TREATMENT.SHOT;
    let healthGain = 20;
    let cost = 0;
    
    switch(type) {
      case 'shot': resource = RESOURCES.TREATMENT.SHOT; healthGain = 30; cost=200; break;
      case 'pill': resource = RESOURCES.TREATMENT.PILL; healthGain = 15; cost=100; break;
      case 'surgery': resource = RESOURCES.TREATMENT.SURGERY; healthGain = 100; cost=1000; break;
    }

    if (!get().spendCoins(cost)) return;

    get().updateStats({ health: healthGain, mood: -5 });
    get().setAnimation(resource, ANIMATION_PRIORITY.MEDIUM, false);
    get().showDialog("感觉舒服多啦！谢谢主人照顾我~");
  },
  
  startWork: (duration) => {
    const { level, stats } = get();
    if (stats.health <= 0) return;

    // Requirements
    if (level < 3) { get().showDialog("等级达到3级才能打工哦！"); return; }
    if (stats.intelligence < 30) { get().showDialog("智慧达到30才能打工哦！"); return; }
    if (stats.hunger < 30) { get().showDialog("肚子饿得没力气干活了..."); return; }
    if (stats.health < 40) { get().showDialog("不太舒服... 想休息一会儿..."); return; }

    set({
        workType: 'work',
        workDuration: duration,
        workEndTime: Date.now() + duration * 1000
    });

    get().setAnimation(RESOURCES.EXIT.EXIT, ANIMATION_PRIORITY.MAX, false);
    get().showDialog(`我去努力工作啦！为了我们的家！(${duration}秒)`);
  },

  startStudy: (duration) => {
    const { stats, coins } = get();
    if (stats.health <= 0) return;

    if (stats.hunger < 30) { get().showDialog("饿得头晕眼花，看不进书..."); return; }

    // Cost logic updated for Game Time
    // Study Cost: 5 coins / game hour
    // 10s = 2 game hours => 10 coins
    const gameHours = (duration * 12) / 60; 
    const totalCost = Math.ceil(5 * gameHours);
    
    if (coins < totalCost) {
        get().showDialog(`学费不够呢... (需要 ${totalCost} 金币)`);
        return;
    }

    get().spendCoins(totalCost); // Pay upfront

    set({
        workType: 'study',
        workDuration: duration,
        workEndTime: Date.now() + duration * 1000
    });

    get().setAnimation(RESOURCES.EXIT.EXIT, ANIMATION_PRIORITY.MAX, false);
    get().showDialog(`我去学习啦！要变得更聪明！(${duration}秒)`);
  },

  cancelWork: () => {
      // Force cancel? 
      // For now, maybe just reset.
      set({ workEndTime: 0, workType: null, workDuration: 0 });
      // Random Return Animation
      const returnAnims = [RESOURCES.EXIT.ENTER, RESOURCES.EXIT.ENTER2, RESOURCES.EXIT.ENTER3];
      const randomReturnAnim = returnAnims[Math.floor(Math.random() * returnAnims.length)];
      get().setAnimation(randomReturnAnim, ANIMATION_PRIORITY.HIGH, false);
  }

}));
