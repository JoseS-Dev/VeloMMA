import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { faker } from '@faker-js/faker';
import { randomFloat } from '../../../../src/utils/seeders/seedUtils.js';

export async function seedWeighIns(
  prisma: ExtendedPrismaClient,
  bouts: Array<{ id: number; red_corner_id: number; blue_corner_id: number }>,
): Promise<void> {
  const weighInsData = bouts.flatMap((bout) => [
    {
      bout_id: bout.id,
      fighter_id: bout.red_corner_id,
      weight_recorded: randomFloat(125, 265),
      missed_weight: faker.datatype.boolean(0.05),
    },
    {
      bout_id: bout.id,
      fighter_id: bout.blue_corner_id,
      weight_recorded: randomFloat(125, 265),
      missed_weight: faker.datatype.boolean(0.05),
    },
  ]);

  await prisma.boutWeighIns.createMany({ data: weighInsData });
}
