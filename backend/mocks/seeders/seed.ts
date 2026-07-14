// prisma/seed.ts
import { prisma } from '../../src/utils/prisma/prisma.js';
import { seedFighters } from './fighters/fighters.seed.js';
import { seedTeams } from './teams/team.seed.js';
import { seedDivisions } from './divisions/division.seed.js';
import type { ExtendedPrismaClient } from '../../src/utils/prisma/prisma.js';

// Configuración global
const CONFIG = {
  TOTAL_FIGHTERS: 100,
  TOTAL_TEAMS: 30,
  BATCH_SIZE: 10,
  CLEAN_DATABASE: false, // Cambiar a true para limpiar antes de sembrar
};

async function cleanDatabase() {
  if (!CONFIG.CLEAN_DATABASE) return;
  
  console.log('🧹 Limpiando base de datos...');
  
  // Orden de eliminación respetando relaciones
  await prisma.$transaction([
    prisma.fighterTitles.deleteMany(),
    prisma.fighterRankings.deleteMany(),
    prisma.boutMetrics.deleteMany(),
    prisma.boutWeighIns.deleteMany(),
    prisma.boutBonuses.deleteMany(),
    prisma.bouts.deleteMany(),
    prisma.fighterDivision.deleteMany(),
    prisma.fighterTeams.deleteMany(),
    prisma.trainingCamps.deleteMany(),
    prisma.fighterInjuries.deleteMany(),
    prisma.fighterStats.deleteMany(),
    prisma.fighters.deleteMany(),
    prisma.teams.deleteMany(),
    prisma.divisions.deleteMany(),
  ]);
  
  console.log('✅ Base de datos limpiada');
}

async function main() {
  console.log('🌱 Iniciando proceso de seeding...\n');
  console.log(`📋 Configuración:`);
  console.log(`   - Fighters: ${CONFIG.TOTAL_FIGHTERS}`);
  console.log(`   - Teams: ${CONFIG.TOTAL_TEAMS}`);
  console.log(`   - Limpiar DB: ${CONFIG.CLEAN_DATABASE}\n`);
  
  try {
    // Limpiar base de datos si está configurado
    await cleanDatabase();
    
    // 1. Crear divisiones primero (no dependen de otros)
    console.log('📊 Paso 1: Creando divisiones...');
    const divisions = await seedDivisions(prisma);
    console.log(`✅ ${divisions.length} divisiones creadas\n`);
    
    // 2. Crear equipos
    console.log('🏋️ Paso 2: Creando equipos...');
    const teams = await seedTeams(prisma, CONFIG.TOTAL_TEAMS);
    console.log(`✅ ${teams.length} equipos creados\n`);
    
    // 3. Crear fighters y asignar relaciones
    console.log('🥊 Paso 3: Creando fighters y asignando relaciones...');
    const fighters = await seedFighters(prisma, {
      total: CONFIG.TOTAL_FIGHTERS,
      batchSize: CONFIG.BATCH_SIZE,
      teams: teams,
      divisions: divisions,
    });
    console.log(`✅ ${fighters.length} fighters creados con sus relaciones\n`);
    
    // 4. Mostrar estadísticas finales
    await showFinalStats(prisma);
    
    console.log('\n🎉 ¡Seeding completado exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error en el proceso de seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function showFinalStats(prisma: ExtendedPrismaClient) {
  console.log('📊 Estadísticas finales:');
  
  const stats = await prisma.$transaction([
    prisma.fighters.count(),
    prisma.fighters.count({ where: { is_active: true } }),
    prisma.teams.count(),
    prisma.teams.count({ where: { is_active: true } }),
    prisma.divisions.count(),
    prisma.divisions.count({ where: { is_active: true } }),
    prisma.fighterTeams.count(),
    prisma.fighterDivision.count(),
    prisma.fighterTitles.count(),
  ]);
  
  const [
    totalFighters,
    activeFighters,
    totalTeams,
    activeTeams,
    totalDivisions,
    activeDivisions,
    totalFighterTeams,
    totalFighterDivisions,
    totalTitles,
  ] = stats;
  
  console.log(`   🥊 Fighters: ${totalFighters} (${activeFighters} activos)`);
  console.log(`   🏋️ Teams: ${totalTeams} (${activeTeams} activos)`);
  console.log(`   📊 Divisiones: ${totalDivisions} (${activeDivisions} activas)`);
  console.log(`   🔗 Fighter-Teams: ${totalFighterTeams} relaciones`);
  console.log(`   🔗 Fighter-Divisions: ${totalFighterDivisions} relaciones`);
  console.log(`   🏆 Títulos: ${totalTitles}`);
}

// Ejecutar
main();