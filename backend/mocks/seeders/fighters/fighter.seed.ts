import type { ExtendedPrismaClient } from '../../../src/utils/prisma/prisma.js';
import { faker } from '@faker-js/faker';
import type { Stance } from '../../../generated/prisma/index.js';
import { Gender } from '../../../generated/prisma/index.js';
import { generateFighterName, generateNickname, generateSlug } from '../../../src/utils/functions/function.js';
import { NATIONALITIES } from '../../../src/utils/constants/constant.js';
import { pickRandom, randomFloat, randomInt } from '../../../src/utils/seeders/seedUtils.js';

const ALL_STANCES: Stance[] = ['Orthodox', 'Southpaw', 'Switch', 'Open_Stance'];

export async function seedFighters(prisma: ExtendedPrismaClient): Promise<number[]> {
  const fightersData = Array.from({ length: 40 }, () => {
    const { firstName, lastName } = generateFighterName();
    const gender = pickRandom(['Masculino', 'Femenino'] as const);

    return {
      first_name: firstName,
      last_name: lastName,
      nickname: generateNickname(firstName),
      slug: generateSlug(firstName, lastName),
      birth_date: faker.date.birthdate({ min: 18, max: 42, mode: 'age' }),
      gender,
      nationality: pickRandom(NATIONALITIES),
      height: randomFloat(160, 200),
      weight: gender === 'Femenino' ? randomFloat(52, 70) : randomFloat(56, 120),
      stance: pickRandom(ALL_STANCES),
      reach: randomFloat(160, 210),
      is_active: faker.datatype.boolean(0.9),
    };
  });

  await prisma.fighters.createMany({ data: fightersData, skipDuplicates: true });

  const records = await prisma.fighters.findMany({
    where: { deleted_at: null },
    select: { id: true },
    orderBy: { id: 'asc' },
  });
  return records.map((f) => f.id);
}
