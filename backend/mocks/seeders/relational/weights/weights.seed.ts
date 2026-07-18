import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { pickRandom } from '../../../../src/utils/seeders/seedUtils.js';

export async function seedFighterDivisions(
  prisma: ExtendedPrismaClient,
  fighterIds: number[],
  divisionIds: number[],
): Promise<void> {
  const data = fighterIds.map((fid, i) => ({
    fighter_id: fid,
    division_id: divisionIds[i % divisionIds.length]!,
    is_current: true,
  }));

  await prisma.fighterDivision.createMany({ data });
}
