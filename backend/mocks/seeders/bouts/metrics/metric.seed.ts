import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { randomInt } from '../../../../src/utils/seeders/seedUtils.js';

interface BoutInfo {
  id: number;
  status_bout: string;
  red_corner_id: number;
  blue_corner_id: number;
}

export async function seedMetrics(
  prisma: ExtendedPrismaClient,
  bouts: BoutInfo[],
): Promise<void> {
  const finalized = bouts.filter((b) => b.status_bout === 'Finalizada');
  if (finalized.length === 0) return;

  const metricsData = finalized.flatMap((bout) => {
    const maxRound = randomInt(1, 5);
    const fighters = [bout.red_corner_id, bout.blue_corner_id];

    return fighters.flatMap((fighterId) =>
      Array.from({ length: maxRound }, (_, round) => ({
        bout_id: bout.id,
        fighter_id: fighterId,
        round: round + 1,
        sig_strikes_landed: randomInt(0, 60),
        sig_strikes_attempted: randomInt(0, 100),
        total_strikes_landed: randomInt(0, 100),
        total_strikes_attempted: randomInt(0, 150),
        head_strikes_landed: randomInt(0, 30),
        body_strikes_landed: randomInt(0, 20),
        leg_strikes_landed: randomInt(0, 15),
        head_strikes_attempted: randomInt(0, 60),
        body_strikes_attempted: randomInt(0, 40),
        leg_strikes_attempted: randomInt(0, 25),
        distance_strikes_landed: randomInt(0, 40),
        clinch_strikes_landed: randomInt(0, 20),
        ground_strikes_landed: randomInt(0, 15),
        distance_strikes_attempted: randomInt(0, 80),
        clinch_strikes_attempted: randomInt(0, 30),
        ground_strikes_attempted: randomInt(0, 25),
        takedowns_landed: randomInt(0, 5),
        takedowns_attempted: randomInt(0, 10),
        submissions_landed: randomInt(0, 3),
        reversals: randomInt(0, 3),
        control_time: randomInt(0, 300),
        knockdowns: randomInt(0, 3),
      })),
    );
  });

  await prisma.boutMetrics.createMany({ data: metricsData });
}
