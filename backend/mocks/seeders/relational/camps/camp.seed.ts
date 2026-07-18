import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { pickRandom } from '../../../../src/utils/seeders/seedUtils.js';

export async function seedTrainingCamps(
  prisma: ExtendedPrismaClient,
  bouts: Array<{ id: number; red_corner_id: number; blue_corner_id: number }>,
  teamIds: number[],
): Promise<void> {
  const data = bouts.flatMap((bout) => [
    {
      bout_id: bout.id,
      team_id: pickRandom(teamIds),
      fighter_id: bout.red_corner_id,
    },
    {
      bout_id: bout.id,
      team_id: pickRandom(teamIds),
      fighter_id: bout.blue_corner_id,
    },
  ]);

  await prisma.trainingCamps.createMany({ data });
}
