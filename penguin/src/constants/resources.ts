// 资源路径常量定义
export const RESOURCES = {
  BIRTH: {
    EGG: 'resource/birth/1.swf', // 孵化/破壳
  },
  UPGRADE: {
    LEVEL_UP: 'resource/upgrade/1.swf',
  },
  DAILY: {
    IDLE: 'resource/daily/ok.swf', // 眨眼/默认
    SCRATCH: 'resource/daily/1.swf', // 挠背
    LOOK_DL: 'resource/daily/2.swf', // 左下看
    LOOK_UL: 'resource/daily/3.swf', // 左上看
    LOOK_DL2: 'resource/daily/4.swf', // 左下看2
    LOOK_UL2: 'resource/daily/5.swf', // 左上看2
    PLAY: 'resource/daily/6.swf', // 玩耍
    NOD: 'resource/daily/7.swf', // 点头
    SHAKE: 'resource/daily/8.swf', // 摇头
    SHY: 'resource/daily/9.swf', // 畏缩
    KISS: 'resource/daily/10.swf', // 亲吻
    HAND: 'resource/daily/11.swf', // 伸手
    IGNORE: 'resource/daily/12.swf', // 无所谓
    DRAG: 'resource/daily/drag.swf', // 拎起来
    DROP: 'resource/daily/drop.swf', // 落下
    LAND: 'resource/daily/land.swf', // 摔倒
  },
  SICK: {
    COLD: 'resource/sick/1.swf', // 生病/冷
  },
  TREATMENT: {
    SHOT: 'resource/treatment/1.swf',
    PILL: 'resource/treatment/2.swf',
    SURGERY: 'resource/treatment/3.swf',
  },
  EAT: {
    SNACK: 'resource/eat/1.swf', // 吃零食
    FAST_FOOD: 'resource/eat/2.swf', // 吃快餐
    FEAST: 'resource/eat/3.swf', // 吃大餐
    WATER: 'resource/eat/4.swf', // 喝水
    COFFEE: 'resource/eat/5.swf', // 喝咖啡
    DRINK: 'resource/eat/6.swf', // 喝冷饮
    HUNGRY: 'resource/eat/7.swf', // 饿动画
  },
  CLEAN: {
    BATH: 'resource/clean/1.swf', // 洗澡
    ITCHY: 'resource/clean/2.swf', // 痒
  },
  STUDY: {
    READ: 'resource/study/1.swf', // 看书
  },
  WORK: {
    MAIL: 'resource/work/1.swf', // 送邮件
  },
  SAD: {
    DRINK: 'resource/sad/1.swf', // 喝酒
  },
  DEAD: {
    DIE: 'resource/dead/1.swf', // 死亡
    TOMBSTONE: 'resource/dead/2.swf', // 墓碑
  },
  EXIT: {
    ENTER: 'resource/exit/1.swf', // 进场1
    ENTER2: 'resource/exit/2.swf', // 进场2
    ENTER3: 'resource/exit/3.swf', // 进场3
    EXIT: 'resource/exit/4.swf', // 离场
  },
  OTHER: {
    DIALOG_BG: 'resource/other/dialog.png',
  }
};

export const ANIMATION_PRIORITY = {
  MAX: 4,     // 死亡, 强制离场
  HIGH: 3,    // 异常状态, 升级, 破壳
  MEDIUM: 2,  // 交互动作 (吃饭, 洗澡等)
  LOW: 1,     // 随机动画
  IDLE: 0,    // 默认
};
