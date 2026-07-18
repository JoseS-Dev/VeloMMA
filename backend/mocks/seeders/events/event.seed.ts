import type { ExtendedPrismaClient } from '../../../src/utils/prisma/prisma.js';
import { faker } from '@faker-js/faker';
import { LOCATIONS } from '../../../src/utils/constants/constant.js';
import { pickRandom, randomFloat } from '../../../src/utils/seeders/seedUtils.js';

export async function seedEvents(prisma: ExtendedPrismaClient): Promise<number[]> {
  const eventsData = Array.from({ length: 15 }, () => {
    const isPast = faker.datatype.boolean(0.7);
    const date = isPast
      ? faker.date.past({ years: 2 })
      : faker.date.future({ years: 1 });

    return {
      name_event: `UFC ${faker.number.int({ min: 280, max: 350 })}: ${faker.location.city()}`,
      date_event: date,
      location_event: pickRandom(LOCATIONS),
      venue_event: faker.company.name() + ' Arena',
      octagon_size: randomFloat(25, 30),
    };
  });

  await prisma.events.createMany({ data: eventsData, skipDuplicates: true });

  const records = await prisma.events.findMany({
    where: { deleted_at: null },
    select: { id: true },
    orderBy: { id: 'asc' },
  });
  return records.map((e) => e.id);
}
