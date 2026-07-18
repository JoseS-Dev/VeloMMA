import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { BonusType } from '../../../../generated/prisma/index.js';
import { pickRandom, randomInt } from '../../../../src/utils/seeders/seedUtils.js';

const BONUS_TYPES = Object.values(BonusType);

export async function seedBonuses(
  prisma: ExtendedPrismaClient,
  bouts: Array<{ id: number; status_bout: string; red_corner_id: number; blue_corner_id: number }>,
): Promise<void> {
  const finalized = bouts.filter((b) => b.status_bout === 'Finalizada');
  if (finalized.length === 0) return;

  const bonusesData = finalized.flatMap((bout) => {
    if (Math.random() > 0.6) return [];

    const count = randomInt(1, 2);
    return Array.from({ length: count }, () => ({
      bout_id: bout.id,
      fighter_id: randomInt(0, 1) === 0 ? bout.red_corner_id : bout.blue_corner_id,
      bonus_type: pickRandom(BONUS_TYPES),
    }));
  });

  if (bonusesData.length > 0) {
    await prisma.boutBonuses.createMany({ data: bonusesData });
  }
}
