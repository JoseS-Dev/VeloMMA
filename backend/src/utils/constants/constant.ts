import { Gender } from "../../../generated/prisma/index.js";
// Listas de nacionalidades comunes en UFC/MMA
export const NATIONALITIES = [
  'Estados Unidos', 'Brasil', 'Rusia', 'Reino Unido', 
  'Australia', 'Canadá', 'México', 'Japón', 'Corea del Sur',
  'China', 'Polonia', 'Suecia', 'Nigeria', 'Francia',
  'Países Bajos', 'Nueva Zelanda', 'Irlanda', 'Cuba',
  'Ucrania', 'Georgia', 'Armenia', 'Tailandia'
];

// Lista de apodos famosos para inspiración
export const NICKNAME_PREFIXES = [
  'El', 'The', 'King', 'Prince', 'Lord', 'Captain',
  'Super', 'Mega', 'Ultra', 'Killer', 'Beast', 'Demon',
  'Angel', 'Warrior', 'Champion', 'Legend', 'Phoenix'
];

export const NICKNAME_SUFFIXES = [
  'Killer', 'Beast', 'Demon', 'Wolf', 'Lion', 'Tiger',
  'Dragon', 'Phoenix', 'Warrior', 'Gladiator', 'Samurai',
  'Ninja', 'Viking', 'Knight', 'Legend'
];

// Equipos reales de MMA para generar afiliaciones
export const REAL_TEAMS = [
  { 
    name: 'American Top Team', 
    location: 'Coconut Creek, Florida, USA',
    description: 'Uno de los equipos más exitosos en MMA con múltiples campeones mundiales'
  },
  { 
    name: 'Jackson Wink MMA', 
    location: 'Albuquerque, Nuevo México, USA',
    description: 'Fundado por Greg Jackson, famoso por entrenar a Jon Jones y Georges St-Pierre'
  },
  { 
    name: 'Team Alpha Gender.Masculino', 
    location: 'Sacramento, California, USA',
    description: 'Equipo fundado por Urijah Faber, especialista en wrestlers y luchadores de peso ligero'
  },
  { 
    name: 'Straight Blast Gym (SBG)', 
    location: 'Dublín, Irlanda',
    description: 'Hogar de Conor McGregor, conocido por su enfoque en el striking y carisma'
  },
  { 
    name: 'Kill Cliff FC', 
    location: 'Deerfield Beach, Florida, USA',
    description: 'Antiguo Sanford MMA, equipo de élite con múltiples campeones'
  },
  { 
    name: 'Fight Ready', 
    location: 'Scottsdale, Arizona, USA',
    description: 'Centro de entrenamiento de alta especialización con enfoque científico'
  },
  { 
    name: 'Kings MMA', 
    location: 'Huntington Beach, California, USA',
    description: 'Dirigido por Rafael Cordeiro, especialista en Muay Thai y striking'
  },
  { 
    name: 'Elevation Fight Team', 
    location: 'Denver, Colorado, USA',
    description: 'Conocido por su entrenamiento en altitud y grandes pesos completos'
  },
  { 
    name: 'Cerro Negro Fighting', 
    location: 'Buenos Aires, Argentina',
    description: 'Uno de los equipos más importantes de Sudamérica en MMA'
  },
  { 
    name: 'Nova União', 
    location: 'Río de Janeiro, Brasil',
    description: 'Cuna del Jiu-Jitsu Brasileño y MMA en Brasil'
  },
  { 
    name: 'Chute Boxe', 
    location: 'Curitiba, Brasil',
    description: 'Famoso por su agresivo estilo de Muay Thai y fighters como Wanderlei Silva'
  },
  { 
    name: 'AKA (American Kickboxing Academy)', 
    location: 'San José, California, USA',
    description: 'Equipo de élite conocido por Cain Velasquez y Daniel Cormier'
  },
];

// Sufijos para equipos ficticios
export const TEAM_SUFFIXES = [
  'MMA', 'Fight Team', 'Academy', 'Combat Club', 
  'Fighting System', 'Martial Arts', 'Jiu-Jitsu',
  'BJJ', 'Muay Thai', 'Boxing', 'Wrestling',
  'Submission Fighting', 'Grappling', 'Striking'
];

// Ubicaciones realistas
export const LOCATIONS = [
    'Los Ángeles, California, USA',
    'Las Vegas, Nevada, USA',
    'Miami, Florida, USA',
    'Nueva York, Nueva York, USA',
    'Chicago, Illinois, USA',
    'Houston, Texas, USA',
    'São Paulo, Brasil',
    'Río de Janeiro, Brasil',
    'Londres, Reino Unido',
    'Moscú, Rusia',
    'Sídney, Australia',
    'Tokio, Japón',
    'Seúl, Corea del Sur',
    'Pekín, China',
    'Ciudad de México, México',
    'Madrid, España',
    'Berlín, Alemania',
    'París, Francia',
    'Dublín, Irlanda',
    'Ámsterdam, Países Bajos'
]

// Prefijos para nombres de equipos
export const TEAM_PREFIXES = [
  'Team', 'Clube', 'Fight Club', 'Combat', 'Warrior',
  'Champion', 'Elite', 'Iron', 'Dragon', 'Tiger',
  'Phoenix', 'Lion', 'Eagle', 'Wolf', 'Shark',
  'Viper', 'Falcon', 'Spartan', 'Samurai', 'Viking',
  'Gladiator', 'Knight', 'Legend', 'Supreme', 'Total'
];

// Divisiones reales de UFC/MMA
export const DIVISIONS_DATA = [
  // Masculinas
  {
    name_division: 'Peso Mosca',
    weight_class: '125 lb (56.7 kg)',
    gender: Gender.Masculino,
    is_active: true
  },
  {
    name_division: 'Peso Gallo',
    weight_class: '135 lb (61.2 kg)',
    gender: Gender.Masculino,
    is_active: true
  },
  {
    name_division: 'Peso Pluma',
    weight_class: '145 lb (65.8 kg)',
    gender: Gender.Masculino,
    is_active: true
  },
  {
    name_division: 'Peso Ligero',
    weight_class: '155 lb (70.3 kg)',
    gender: Gender.Masculino,
    is_active: true
  },
  {
    name_division: 'Peso Wélter',
    weight_class: '170 lb (77.1 kg)',
    gender: Gender.Masculino,
    is_active: true
  },
  {
    name_division: 'Peso Medio',
    weight_class: '185 lb (83.9 kg)',
    gender: Gender.Masculino,
    is_active: true
  },
  {
    name_division: 'Peso Semipesado',
    weight_class: '205 lb (93.0 kg)',
    gender: Gender.Masculino,
    is_active: true
  },
  {
    name_division: 'Peso Pesado',
    weight_class: '265 lb (120.2 kg)',
    gender: Gender.Masculino,
    is_active: true
  },
  
  // Femeninas
  {
    name_division: 'Peso Paja Femenino',
    weight_class: '115 lb (52.2 kg)',
    gender: Gender.Femenino,
    is_active: true
  },
  {
    name_division: 'Peso Mosca Femenino',
    weight_class: '125 lb (56.7 kg)',
    gender: Gender.Femenino,
    is_active: true
  },
  {
    name_division: 'Peso Gallo Femenino',
    weight_class: '135 lb (61.2 kg)',
    gender: Gender.Femenino,
    is_active: true
  },
  {
    name_division: 'Peso Pluma Femenino',
    weight_class: '145 lb (65.8 kg)',
    gender: Gender.Femenino,
    is_active: true
  }
];

// Divisiones adicionales de otras organizaciones
export const EXTRA_DIVISIONS = [
  {
    name_division: 'Peso Átomo Femenino',
    weight_class: '105 lb (47.6 kg)',
    gender: Gender.Femenino,
    is_active: true
  },
  {
    name_division: 'Peso Superpesado',
    weight_class: '265+ lb (120.2+ kg)',
    gender: Gender.Masculino,
    is_active: false
  },
  {
    name_division: 'Peso Crucero',
    weight_class: '225 lb (102.1 kg)',
    gender: Gender.Masculino,
    is_active: false
  },
  {
    name_division: 'Peso Pluma Femenino',
    weight_class: '145 lb (65.8 kg)',
    gender: Gender.Femenino,
    is_active: false
  }
];