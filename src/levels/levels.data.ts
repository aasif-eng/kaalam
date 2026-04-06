// src/levels/levels.data.ts

export interface Level {
  id: string;
  name: string;
  description: string;
  price: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export const STATIC_LEVELS: Level[] = [
  {
    id: 'LVL_001',
    name: 'Forest Beginner',
    description: 'A peaceful forest walk to ease you in',
    price: 0.99,
    difficulty: 'easy',
  },
  {
    id: 'LVL_002',
    name: 'Desert Storm',
    description: 'Navigate through a relentless sandstorm',
    price: 1.99,
    difficulty: 'medium',
  },
  {
    id: 'LVL_003',
    name: 'Volcanic Caverns',
    description: 'Survive the scorching underground lava maze',
    price: 2.99,
    difficulty: 'hard',
  },
  {
    id: 'LVL_004',
    name: 'Sky Fortress',
    description: 'Battle enemies on a floating sky citadel',
    price: 3.99,
    difficulty: 'hard',
  },
  {
    id: 'LVL_005',
    name: 'Abyss of Eternity',
    description: 'The ultimate challenge — few have survived',
    price: 4.99,
    difficulty: 'expert',
  },
];

export function findLevelById(levelId: string): Level | undefined {
  return STATIC_LEVELS.find((l) => l.id === levelId);
}
