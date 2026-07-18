import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { generateHash } from '../../../../src/utils/functions/function.js';
import { randomFloat } from '../../../../src/utils/seeders/seedUtils.js';

export async function seedStats(
  prisma: ExtendedPrismaClient,
  fighterIds: number[],
): Promise<void> {
  const data = fighterIds.map((fid) => {
    const sigAcc = randomFloat(30, 65);
    const tdAcc = randomFloat(20, 55);
    const tdDef = randomFloat(40, 85);
    const sigAbs = randomFloat(2, 8);
    const avgTime = randomFloat(300, 900);

    const hashRaw = `${fid}-${sigAcc}-${tdAcc}-${tdDef}-${sigAbs}-${avgTime}`;

    return {
      fighter_id: fid,
      sig_strikes_accuracy: sigAcc,
      sig_strikes_absorbed_pm: sigAbs,
      takedown_accuracy: tdAcc,
      takedown_defense: tdDef,
      average_fight_time: avgTime,
      data_hash: generateHash(hashRaw),
    };
  });

  await prisma.fighterStats.createMany({ data });
}
