import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { pickRandomN, randomInt } from '../../../../src/utils/seeders/seedUtils.js';

const JUDGE_NAMES = [
  'Derek Cleary', 'Sal D\'Amato', 'Chris Lee',
  'Glenn Trowbridge', 'Junichiro Kamijo', 'Mike Bell',
  'Dave Tirelli', 'Doug Crosby', 'Ron McCarthy',
  'Adelaide Byrd', 'Patricia Morse Jarman',
];

export async function seedJudges(
  prisma: ExtendedPrismaClient,
  bouts: Array<{ id: number; status_bout: string; red_corner_id: number; blue_corner_id: number }>,
): Promise<void> {
  const finalized = bouts.filter((b) => b.status_bout === 'Finalizada');
  if (finalized.length === 0) return;

  const judgesData = finalized.flatMap((bout) => {
    const selected = pickRandomN(JUDGE_NAMES, 3);
    return selected.map((name) => ({
      bout_id: bout.id,
      judge_name: name,
      red_score: randomInt(27, 30),
      blue_score: randomInt(27, 30),
    }));
  });

  await prisma.boutJudges.createMany({ data: judgesData });
}
