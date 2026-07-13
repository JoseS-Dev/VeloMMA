import {faker} from '@faker-js/faker';
import { 
    generateFighterName,
    generateSlug,
    generateNickname 
} from '../../../src/utils/functions/function.js';
import { NATIONALITIES } from '../../../src/utils/constants/constant.js';
import { Gender, Stance } from '../../../generated/prisma/index.js';
import type { ExtendedPrismaClient } from '../../../src/utils/prisma/prisma.js';

interface SeedFightersOptions {
    total: number;
    batchSize: number;
    teams: any[];
    divisions: any[];
}

// Función para generar un conjunto de luchadores falsos
function generateFighters(){
    const {firstName, lastName} = generateFighterName();
    const gender = faker.helpers.arrayElement([Gender.Masculino, Gender.Femenino, Gender.Otro]);
    const isActive = faker.datatype.boolean(0.5);

    // Altura y pesos realistas según el género
    let height, weight;
    if(gender === Gender.Masculino){
        height = faker.number.float({ min: 1.55, max: 2.0, fractionDigits: 2 });
        weight = faker.number.float({ min: 56, max: 120, fractionDigits: 1 });
    }
    else {
        height = faker.number.float({ min: 1.50, max: 1.85, fractionDigits: 2 });
        weight = faker.number.float({ min: 48, max: 75, fractionDigits: 1 });
    }

    const birthDate = faker.date.birthdate({ min: 18, max: 40, mode: 'age' });
    const nickname = generateNickname(firstName);
    const slug = generateSlug(firstName, lastName);

    return {
        first_name: firstName,
        last_name: lastName,
        nickname: nickname,
        slug: slug,
        birth_date: birthDate,
        gender: gender,
        nationality: faker.helpers.arrayElement(NATIONALITIES),
        height: height,
        weight: weight,
        stance: faker.helpers.arrayElement([Stance.Orthodox, Stance.Southpaw, Stance.Switch, Stance.Open_Stance]),
        reach: faker.number.float({ min: 150, max: 210, fractionDigits: 1 }),
        is_active: isActive,
        created_at: faker.date.past({ years: 10 }),
        updated_at: new Date(),
        deleted_at: null
    }
}

// Función para el seed de los luchadores
export async function seedFighters(prisma: ExtendedPrismaClient, options: SeedFightersOptions) {
  const { total, batchSize = 10, teams, divisions } = options;
  
  const fighters = [];
  const fighterTeams = [];
  const fighterDivisions = [];
  
  for (let i = 0; i < total; i++) {
    const fighter = generateFighters();
    fighters.push(fighter);
    
    // Asignar equipos (1-2 por fighter)
    if (teams.length > 0) {
      const numTeams = faker.number.int({ min: 1, max: Math.min(2, teams.length) });
      const selectedTeams = faker.helpers.shuffle(teams).slice(0, numTeams);
      
      for (const team of selectedTeams) {
        fighterTeams.push({
          fighter_id: i + 1, // Se actualizará después
          team_id: team.id,
          joined_date: faker.date.past({ years: faker.number.int({ min: 1, max: 10 }) }),
          is_current: faker.datatype.boolean(0.7),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }
    
    // Asignar división (1 por fighter)
    if (divisions.length > 0) {
      const availableDivisions = divisions.filter(d => d.gender === fighter.gender);
      if (availableDivisions.length > 0) {
        const division = faker.helpers.arrayElement(availableDivisions);
        fighterDivisions.push({
          fighter_id: i + 1, // Se actualizará después
          division_id: division.id,
          is_current: true,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }
  }
  
  // Crear fighters en lotes
  const createdFighters = [];
  for (let i = 0; i < fighters.length; i += batchSize) {
    const batch = fighters.slice(i, i + batchSize);
    const result = await prisma.fighters.createMany({
      data: batch,
      skipDuplicates: true,
    });
    
    // Obtener los fighters creados para actualizar relaciones
    const createdBatch = await prisma.fighters.findMany({
      where: {
        slug: { in: batch.map(f => f.slug) }
      },
      orderBy: { id: 'asc' }
    });
    createdFighters.push(...createdBatch);
    
  }
  
  // Actualizar relaciones con IDs reales
  if (createdFighters.length > 0) {
    // Actualizar fighterTeams con IDs reales
    const updatedFighterTeams = [];
    for (let i = 0; i < createdFighters.length; i++) {
      const fighter = createdFighters[i];
      const fighterIndex = fighters.findIndex(f => f.slug === fighter!.slug);
      
      if (fighterIndex !== -1) {
        // Asignar equipos
        const teamRelations = fighterTeams.filter((_, index) => 
          index >= fighterIndex * 2 && index < (fighterIndex + 1) * 2
        );
        
        for (const rel of teamRelations) {
          updatedFighterTeams.push({
            ...rel,
            fighter_id: fighter!.id,
          });
        }
        
        // Asignar división
        const divisionRel = fighterDivisions[fighterIndex];
        if (divisionRel) {
          await prisma.fighterDivision.create({
            data: {
              ...divisionRel,
              fighter_id: fighter!.id,
            },
          });
        }
      }
    }
    
    // Crear relaciones fighter-teams
    if (updatedFighterTeams.length > 0) {
      for (let i = 0; i < updatedFighterTeams.length; i += batchSize) {
        const batch = updatedFighterTeams.slice(i, i + batchSize);
        await prisma.fighterTeams.createMany({
          data: batch,
          skipDuplicates: true,
        });
      }
    }
  }
  
  return createdFighters;
}

