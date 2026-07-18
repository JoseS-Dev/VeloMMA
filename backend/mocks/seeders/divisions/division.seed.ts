import type { ExtendedPrismaClient } from '../../../src/utils/prisma/prisma.js';
import { DIVISIONS_DATA, EXTRA_DIVISIONS } from '../../../src/utils/constants/constant.js';

export async function seedDivisions(prisma: ExtendedPrismaClient): Promise<number[]> {
  const allDivisions = [...DIVISIONS_DATA, ...EXTRA_DIVISIONS];

  await prisma.divisions.createMany({ data: allDivisions, skipDuplicates: true });

  const records = await prisma.divisions.findMany({
    where: { deleted_at: null },
    select: { id: true, name_division: true },
  });
  return records.map((d) => d.id);
}
