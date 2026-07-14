import {faker} from '@faker-js/faker';
import { 
    REAL_TEAMS,
    LOCATIONS 
} from '../../../src/utils/constants/constant.js';
import { 
    generateTeamName,
    generateDescription 
} from '../../../src/utils/functions/function.js';
import type { ExtendedPrismaClient } from '../../../src/utils/prisma/prisma.js';

// Función para generar un conjunto de equipos falsos
export function generateTeams(){
    const teamName = generateTeamName();
    const isActive = faker.datatype.boolean(0.5);

    // Buscamos equipos reales para obtener la ubicación realista
    const realTeam = REAL_TEAMS.find(team => team.name === teamName);
    return {
        name_team: teamName,
        description_team: generateDescription(teamName),
        date_founded: faker.date.birthdate({ min: 5, max: 30, mode: 'age' }),
        location: realTeam ? realTeam.location : faker.helpers.arrayElement(LOCATIONS),
        is_active: isActive,
        created_at: faker.date.past({ years: 15 }),
        updated_at: new Date(),
        deleted_at: null
    }
}

// Función para el seed de los equipos
export async function seedTeams(prisma: ExtendedPrismaClient, total: number = 30){
    const teams = [];
    for(let i = 0; i < total; i++){
        const team = generateTeams();
        teams.push(team);
    }
    return await prisma.$transaction(
        teams.map(team => prisma.teams.create({ data: team }))
    );
}

