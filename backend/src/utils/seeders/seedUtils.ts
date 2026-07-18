import type { ExtendedPrismaClient } from '../prisma/prisma.js';

const TABLES = [
  'bout_metrics', 'bout_judges', 'bout_weigh_ins', 'bout_bonuses',
  'bout_odds', 'training_camps', 'fighter_titles', 'fighter_rankings',
  'fighter_stats', 'fighter_injuries', 'fighter_teams', 'fighter_division',
  'bouts', 'fighters', 'events', 'divisions', 'teams',
];

export async function cleanDatabase(prisma: ExtendedPrismaClient): Promise<void> {
  for (const table of TABLES) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
}

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
