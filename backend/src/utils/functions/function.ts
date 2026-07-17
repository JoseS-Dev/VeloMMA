import crypto from 'crypto';
import { faker } from '@faker-js/faker';
import { 
    NICKNAME_PREFIXES,
    NICKNAME_SUFFIXES,
    TEAM_PREFIXES,
    TEAM_SUFFIXES,
    REAL_TEAMS,
    DIVISIONS_DATA 
} from '../constants/constant.js';
import { Gender } from '../../../generated/prisma/index.js';

interface CursorOptions {
    cursor?: number;
    limit?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
    where?: { [key: string]: any };
}

// Function para cargar todas las rutas de la API en la raiz del servidor
export function registerRoutes(app: any, routes: Object) {
    Object.values(routes).forEach(moduleRoutes => {
        if(typeof moduleRoutes === 'object') {
            Object.values(moduleRoutes).forEach(route => {
                app.use(route);
            });
        }
    });
}

// Record para los estados de las peleas
export const BoutStatusRecord: Record<string, string[]> = {
    Programada: ['Cancelada', 'En_Proceso', 'Finalizada'],
    Cancelada: ['Programada'],
    En_Proceso: ['Finalizada', 'Cancelada'],
    Finalizada: []
}

// Función que genra un hash sha256 a partir de un string
export function generateHash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Función para la consulta base de los metodos findAll y findAllActive de los servicios de la API
export const buildQueryOptions = (options: CursorOptions) => {
    const { cursor, limit = 10, orderBy = { id: 'asc' }, where = {} } = options;
    const queryOptions: any = {
        take: limit,
        orderBy,
        where,
    };
    if (cursor){
        queryOptions.cursor = { id: cursor };
        queryOptions.skip = 1;
    }
    return queryOptions;
}

// Función para generar un slug único
export function generateSlug(firstName: string, lastName: string): string {
  const base = `${firstName}-${lastName}`.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '');
  
  const randomSuffix = faker.number.int({ min: 1000, max: 9999 });
  return `${base}-${randomSuffix}`;
}

// Función para generar un nombre completo realista
export function generateFighterName() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return { firstName, lastName };
}

// Función para generar nickname
export function generateNickname(firstName: string): string | null {
  if (Math.random() < 0.3) return null; // 30% sin apodo
  
  const prefix = faker.helpers.arrayElement(NICKNAME_PREFIXES);
  const suffix = faker.helpers.arrayElement(NICKNAME_SUFFIXES);
  
  // Diferentes formatos de apodo
  const formats = [
    `${prefix} ${suffix}`,
    `"${firstName} ${suffix}"`,
    `${prefix} ${firstName}`,
    `${suffix}`,
    `The ${suffix}`
  ];
  
  return faker.helpers.arrayElement(formats);
}

// Función para generar nombre de equipo
export function generateTeamName(): string {
  // 30% de probabilidad de usar un equipo real
  if (Math.random() < 0.3) {
    return faker.helpers.arrayElement(REAL_TEAMS).name;
  }
  
  const prefix = faker.helpers.arrayElement(TEAM_PREFIXES);
  const suffix = faker.helpers.arrayElement(TEAM_SUFFIXES);
  const location = faker.helpers.arrayElement([
    'City', 'State', 'Nation', 'World', 'United',
    'International', 'Global', 'Masters', 'Pro'
  ]);
  
  const formats = [
    `${prefix} ${suffix}`,
    `${prefix} ${suffix} ${location}`,
    `${prefix} de ${faker.location.city()}`,
    `${suffix} ${prefix}`,
    `${faker.word.adjective()} ${prefix}`
  ];
  
  return faker.helpers.arrayElement(formats);
}

// Función para generar descripción
export function generateDescription(teamName: string): string | null {
  if (Math.random() < 0.2) return null; // 20% sin descripción
  
  const specialties = [
    'especializado en striking', 'enfocado en wrestling', 
    'con énfasis en Jiu-Jitsu', 'centrado en Muay Thai',
    'especialista en sumisiones', 'enfocado en boxeo',
    'con gran tradición en grappling', 'especialista en MMA completo'
  ];
  
  const achievements = [
    'múltiples campeones mundiales', 'ganadores de torneos internacionales',
    'reconocido a nivel mundial', 'con años de experiencia',
    'cuna de grandes campeones', 'referente en el deporte'
  ];
  
  const descriptions = [
    `Equipo ${faker.helpers.arrayElement(specialties)}, ${faker.helpers.arrayElement(achievements)}.`,
    `${teamName} es un ${faker.helpers.arrayElement(specialties)} con ${faker.helpers.arrayElement(achievements)}.`,
    `Fundado para desarrollar talentos ${faker.helpers.arrayElement(specialties)}, ${faker.helpers.arrayElement(achievements)}.`,
    `Centro de entrenamiento ${faker.helpers.arrayElement(specialties)} donde ${faker.helpers.arrayElement(achievements)}.`
  ];
  
  return faker.helpers.arrayElement(descriptions);
}

// Función para generar divisiones generales creativas
export function generateCreativeDivision(): typeof DIVISIONS_DATA[0] | null {
    if (Math.random() > 0.3) return null; // 30% de generar división creativa
  
    const genders = [Gender.Masculino, Gender.Femenino];
    const gender = faker.helpers.arrayElement(genders);
    
    const weightPrefixes = [
      'Mini', 'Super', 'Ultra', 'Mega', 'Extreme',
      'Ligero', 'Medio', 'Pesado', 'Pluma', 'Gallo'
    ];

    const weightSuffixes = ['Weight', 'Class', 'Division'];

    const namePrefix = faker.helpers.arrayElement(weightPrefixes);
    const nameSuffix = faker.helpers.arrayElement(weightSuffixes);

    // Generar rangos de peso realistas
    let weightMin, weightMax;
    if (gender === 'Masculino') {
      weightMin = faker.number.int({ min: 115, max: 200 });
      weightMax = weightMin + faker.number.int({ min: 5, max: 20 });
    } else {
      weightMin = faker.number.int({ min: 95, max: 135 });
      weightMax = weightMin + faker.number.int({ min: 5, max: 15 });
    }

    const weightClass = `${weightMax} lb (${(weightMax * 0.453592).toFixed(1)} kg)`;
  
    return {
      name_division: `${namePrefix} ${nameSuffix}${gender === 'Femenino' ? ' Femenino' : 'Masculino'}`,
      weight_class: weightClass,
      gender: gender,
      is_active: faker.datatype.boolean(0.7)
    };
}
