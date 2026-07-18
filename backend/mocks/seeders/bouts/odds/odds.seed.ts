import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { randomFloat } from '../../../../src/utils/seeders/seedUtils.js';

const PROVIDERS = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'Bet365'];

export async function seedOdds(
  prisma: ExtendedPrismaClient,
  bouts: Array<{ id: number }>,
): Promise<void> {
  const oddsData = bouts.flatMap((bout) => {
    const provider = PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)]!;
    const redOpen = Math.random() * 500 + 100;
    const blueOpen = Math.random() * 500 + 100;

    return {
      bout_id: bout.id,
      red_opening_odds: -parseFloat(redOpen.toFixed(2)),
      blue_opening_odds: -parseFloat(blueOpen.toFixed(2)),
      red_closing_odds: -randomFloat(100, 600),
      blue_closing_odds: -randomFloat(100, 600),
      provider,
    };
  });

  await prisma.boutOdds.createMany({ data: oddsData });
}
