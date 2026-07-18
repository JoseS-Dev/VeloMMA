import { prisma } from '../../src/utils/prisma/prisma.js';
import { cleanDatabase } from '../../src/utils/seeders/seedUtils.js';
import { seedDivisions } from './divisions/division.seed.js';
import { seedEvents } from './events/event.seed.js';
import { seedTeams } from './teams/team.seed.js';
import { seedFighters } from './fighters/fighter.seed.js';
import { seedBouts } from './bouts/bout/bout.seed.js';
import { seedMetrics } from './bouts/metrics/metric.seed.js';
import { seedJudges } from './bouts/judges/judge.seed.js';
import { seedWeighIns } from './bouts/weighIns/weighIns.seed.js';
import { seedBonuses } from './bouts/bonus/bonus.seed.js';
import { seedOdds } from './bouts/odds/odds.seed.js';
import { seedFighterDivisions } from './relational/weights/weights.seed.js';
import { seedFighterTeams } from './relational/stables/stables.seed.js';
import { seedInjuries } from './relational/injuries/injury.seed.js';
import { seedRankings } from './relational/ranking/rank.seed.js';
import { seedTitles } from './relational/titles/title.seed.js';
import { seedTrainingCamps } from './relational/camps/camp.seed.js';
import { seedStats } from './relational/stats/stats.seed.js';

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...\n');

  await cleanDatabase(prisma);
  console.log('✅ Base de datos limpiada correctamente\n');

  const divisionIds = await seedDivisions(prisma);
  console.log(`✅ ${divisionIds.length} divisiones creadas\n`);

  const eventIds = await seedEvents(prisma);
  console.log(`✅ ${eventIds.length} eventos creados\n`);

  const teamIds = await seedTeams(prisma);
  console.log(`✅ ${teamIds.length} equipos creados\n`);

  const fighterIds = await seedFighters(prisma);
  console.log(`✅ ${fighterIds.length} luchadores creados\n`);

  const bouts = await seedBouts(prisma, eventIds, divisionIds, fighterIds);
  console.log(`✅ ${bouts.length} peleas creadas\n`);

  await seedMetrics(prisma, bouts);
  console.log('✅ Métricas de pelea creadas\n');

  await seedJudges(prisma, bouts);
  console.log('✅ Jueces de pelea creados\n');

  await seedWeighIns(prisma, bouts);
  console.log('✅ Pesajes oficiales creados\n');

  await seedBonuses(prisma, bouts);
  console.log('✅ Bonos de pelea creados\n');

  await seedOdds(prisma, bouts);
  console.log('✅ Apuestas creadas\n');

  await seedFighterDivisions(prisma, fighterIds, divisionIds);
  console.log('✅ Relaciones luchador-división creadas\n');

  await seedFighterTeams(prisma, fighterIds, teamIds);
  console.log('✅ Relaciones luchador-equipo creadas\n');

  await seedInjuries(prisma, fighterIds);
  console.log('✅ Lesiones creadas\n');

  await seedRankings(prisma, fighterIds, divisionIds);
  console.log(`✅ Rankings creados\n`);

  await seedTitles(prisma, fighterIds, divisionIds);
  console.log('✅ Títulos creados\n');

  await seedTrainingCamps(prisma, bouts, teamIds);
  console.log('✅ Campamentos de entrenamiento creados\n');

  await seedStats(prisma, fighterIds);
  console.log('✅ Estadísticas de luchadores creadas\n');

  console.log('🎉 Seeding completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
