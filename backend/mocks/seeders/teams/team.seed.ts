import type { ExtendedPrismaClient } from '../../../src/utils/prisma/prisma.js';
import { faker } from '@faker-js/faker';
import { REAL_TEAMS } from '../../../src/utils/constants/constant.js';
import { generateTeamName, generateDescription } from '../../../src/utils/functions/function.js';

export async function seedTeams(prisma: ExtendedPrismaClient): Promise<number[]> {
  const teamsData = REAL_TEAMS.map((t) => ({
    name_team: t.name,
    description_team: t.description ?? `${t.name} — ${t.location}`,
    date_founded: faker.date.past({ years: 25 }),
    location: t.location,
  }));

  while (teamsData.length < 15) {
    const name = generateTeamName();
    teamsData.push({
      name_team: name,
      description_team: `${name} — Equipo de artes marciales mixtas`,
      date_founded: faker.date.past({ years: 20 }),
      location: faker.location.city(),
    });
  }

  await prisma.teams.createMany({ data: teamsData, skipDuplicates: true });

  const records = await prisma.teams.findMany({
    where: { deleted_at: null },
    select: { id: true },
    orderBy: { id: 'asc' },
  });
  return records.map((t) => t.id);
}
