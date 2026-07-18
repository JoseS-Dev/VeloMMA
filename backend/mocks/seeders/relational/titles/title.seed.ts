import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { faker } from '@faker-js/faker';
import { TitleType } from '../../../../generated/prisma/index.js';
import { pickRandom } from '../../../../src/utils/seeders/seedUtils.js';

const TITLE_TYPES = Object.values(TitleType);

export async function seedTitles(
  prisma: ExtendedPrismaClient,
  fighterIds: number[],
  divisionIds: number[],
): Promise<void> {
  const data = divisionIds.map((divId, i) => ({
    division_id: divId,
    fighter_id: fighterIds[i % fighterIds.length]!,
    title_type: pickRandom(TITLE_TYPES),
    won_date: faker.date.past({ years: 3 }),
    lost_date: faker.datatype.boolean(0.3) ? faker.date.recent({ days: 180 }) : null,
  }));

  await prisma.fighterTitles.createMany({ data });
}
