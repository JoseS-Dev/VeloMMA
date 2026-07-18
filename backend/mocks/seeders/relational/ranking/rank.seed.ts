import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { faker } from '@faker-js/faker';

export async function seedRankings(
  prisma: ExtendedPrismaClient,
  fighterIds: number[],
  divisionIds: number[],
): Promise<void> {
  const data = divisionIds.flatMap((divId) => {
    const fightersInDiv = fighterIds.slice(0, Math.min(15, fighterIds.length));
    return fightersInDiv.map((fid, rank) => ({
      fighter_id: fid,
      division_id: divId,
      rank: rank + 1,
      as_of_date: faker.date.recent({ days: 30 }),
    }));
  });

  await prisma.fighterRankings.createMany({ data });
}
