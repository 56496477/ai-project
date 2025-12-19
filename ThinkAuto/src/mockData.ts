import type { Category, Question } from './types';

export const categories: Category[] = [
  {
    id: 'relationship',
    name: '情感 / 恋爱',
    icon: '❤️',
    theme: {
      primary: 'bg-rose-500 hover:bg-rose-600',
      background: 'bg-gradient-to-br from-rose-50 to-rose-200',
      accent: 'text-rose-600',
    },
  },
  {
    id: 'career',
    name: '职场 / 事业',
    icon: '💼',
    theme: {
      primary: 'bg-sky-500 hover:bg-sky-600',
      background: 'bg-gradient-to-br from-sky-50 to-sky-200',
      accent: 'text-sky-600',
    },
  },
  {
    id: 'growth',
    name: '个人成长',
    icon: '🌱',
    theme: {
      primary: 'bg-emerald-500 hover:bg-emerald-600',
      background: 'bg-gradient-to-br from-emerald-50 to-emerald-200',
      accent: 'text-emerald-600',
    },
  },
  {
    id: 'other',
    name: '其他问题',
    icon: '✨',
    theme: {
      primary: 'bg-violet-500 hover:bg-violet-600',
      background: 'bg-gradient-to-br from-violet-50 to-violet-200',
      accent: 'text-violet-600',
    },
  },
];

export const generateMockQuestions = (description: string): Question[] => {
  console.log('正在分析:', description);
  // Simulate AI generating questions based on description
  return [
    {
      id: 'q1',
      text: '这种困扰持续多久了？',
      type: 'choice',
      options: ['不到一周', '1-6 个月', '6 个月 - 1 年', '超过 1 年'],
    },
    {
      id: 'q2',
      text: '您之前尝试过什么解决办法吗？',
      type: 'text',
    },
    {
      id: 'q3',
      text: '这件事对您日常心情的影响程度是？(1-10分)',
      type: 'choice',
      options: ['1-3 (影响较小)', '4-7 (中等影响)', '8-10 (严重影响)'],
    },
  ];
};

export const generateMockResult = () => {
  return `根据您的回答，这是初步的分析建议：

1. **核心洞察**：您的情况似乎源于对稳定性的渴望与外部压力之间的冲突。
2. **建议方案**：试着将问题分解为更小、可管理的步骤。专注于您今天能控制的事情。
3. **下一步计划**：建议预约一次深入的咨询会议，以探索潜在的行为模式。

请记住，这只是 AI 的初步分析。请同时相信您的直觉。`;
};
