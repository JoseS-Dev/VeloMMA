import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { faker } from '@faker-js/faker';
import type { BoutResult, WinMethod, BoutStatus, SubmissionType } from '../../../../generated/prisma/index.js';
import { pickRandom, randomInt } from '../../../../src/utils/seeders/seedUtils.js';

const REFEREES = [
  'Marc Goddard', 'Dan Miragliotta', 'Herb Dean',
  'Jason Herzog', 'Mike Beltran', 'Chris Tognoni',
  'Keith Peterson', 'Mark Smith',
];

interface BoutSeedResult {
  id: number;
  event_id: number;
  division_id: number;
  red_corner_id: number;
  blue_corner_id: number;
  result: string | null;
  status_bout: string;
}

export async function seedBouts(
  prisma: ExtendedPrismaClient,
  eventIds: number[],
  divisionIds: number[],
  fighterIds: number[],
): Promise<BoutSeedResult[]> {
  const pairs: Array<{ red: number; blue: number }> = [];
  const available = [...fighterIds];

  for (let i = 0; i < 20 && available.length >= 2; i++) {
    const redIdx = randomInt(0, available.length - 1);
    const red = available.splice(redIdx, 1)[0]!;
    const blueIdx = randomInt(0, available.length - 1);
    const blue = available.splice(blueIdx, 1)[0]!;
    pairs.push({ red, blue });
  }

  const boutsData = pairs.map((pair, i) => {
    const event = eventIds[i % eventIds.length]!;
    const division = divisionIds[i % divisionIds.length]!;
    const isFinalized = i < 12;

    let result: string | null = null;
    let method: string | null = null;
    let submission_type: string | null = null;
    let rounded_ended: number | null = null;
    let time_ended: number | null = null;
    let status: string = 'Programada';
    let upset = false;

    if (isFinalized) {
      result = faker.datatype.boolean(0.55) ? 'Win_Red' : 'Win_Blue';
      method = pickRandom([
        'KO', 'TKO', 'Submission', 'Unanimous_Decision',
        'Split_Decision', 'Majority_Decision',
      ] as const);
      rounded_ended = randomInt(1, 5);
      time_ended = randomInt(30, 300);
      status = 'Finalizada';

      if (method === 'Submission') {
        submission_type = pickRandom([
          'Rear_Naked_Choke', 'Guillotine_Choke', 'Armbar',
          'Triangle_Choke', 'Kimura', 'Heel_Hook',
        ] as const);
      }
      upset = faker.datatype.boolean(0.15);
    } else if (i < 15) {
      status = 'Programada';
    } else if (i < 17) {
      status = 'Cancelada';
    } else {
      status = 'En_Proceso';
    }

    return {
      event_id: event,
      division_id: division,
      red_corner_id: pair.red,
      blue_corner_id: pair.blue,
      result: result as BoutResult | null,
      method: method as WinMethod | null,
      submission_type: submission_type as SubmissionType | null,
      rounded_ended,
      time_ended,
      referee: pickRandom(REFEREES),
      is_title_fight: faker.datatype.boolean(0.2),
      upset,
      status_bout: status as BoutStatus,
    };
  });

  await prisma.bouts.createMany({ data: boutsData });

  const records = await prisma.bouts.findMany({
    where: { deleted_at: null },
    select: {
      id: true, event_id: true, division_id: true,
      red_corner_id: true, blue_corner_id: true,
      result: true, status_bout: true,
    },
    orderBy: { id: 'asc' },
  });
  return records;
}
