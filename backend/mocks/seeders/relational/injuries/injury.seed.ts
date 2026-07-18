import type { ExtendedPrismaClient } from '../../../../src/utils/prisma/prisma.js';
import { faker } from '@faker-js/faker';
import { InjurySeverity } from '../../../../generated/prisma/index.js';
import { pickRandom, pickRandomN } from '../../../../src/utils/seeders/seedUtils.js';

const INJURY_DESCRIPTIONS = [
  'Desgarro de ligamento cruzado anterior',
  'Fractura de mano',
  'Conmoción cerebral',
  'Lesión de hombro',
  'Distensión de cuádriceps',
  'Desgarro de bíceps',
  'Fractura de costilla',
  'Esguince de tobillo',
  'Lesión de espalda',
  'Corte en el párpado',
  'Fractura de nariz',
  'Desgarro de menisco',
];

const SEVERITIES = Object.values(InjurySeverity);

export async function seedInjuries(
  prisma: ExtendedPrismaClient,
  fighterIds: number[],
): Promise<void> {
  const injured = pickRandomN(fighterIds, Math.min(10, fighterIds.length));

  const data = injured.map((fid) => {
    const isActive = faker.datatype.boolean(0.2);
    const injuryDate = faker.date.past({ years: 2 });

    return {
      fighter_id: fid,
      description_injury: pickRandom(INJURY_DESCRIPTIONS),
      severity_injury: pickRandom(SEVERITIES),
      injury_date: injuryDate,
      recovery_date: isActive ? null : faker.date.soon({ days: 90, refDate: injuryDate }),
      is_active: isActive || false,
    };
  });

  await prisma.fighterInjuries.createMany({ data });
}
