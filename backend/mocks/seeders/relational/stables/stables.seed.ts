import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { faker } from '@faker-js/faker';
import { pickRandom } from '../../../../src/utils/seeders/seedUtils.js';

export async function seedFighterTeams(
  prisma: ExtendedPrismaClient,
  fighterIds: number[],
  teamIds: number[],
): Promise<void> {
  const data = fighterIds.map((fid) => ({
    fighter_id: fid,
    team_id: pickRandom(teamIds),
    is_current: faker.datatype.boolean(0.8),
    joined_date: faker.date.past({ years: 5 }),
    left_date: null,
  }));

  await prisma.fighterTeams.createMany({ data });
}
