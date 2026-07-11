import { fighterRoutes } from '../modules/fighters/fighter.route.js';
import { teamRoutes } from '../modules/teams/team.route.js';
import { divisionRoutes } from '../modules/divisions/division.route.js';
import { eventRoutes } from '../modules/events/event.route.js';
import { 
    injuryRoutes,
    stableRoutes,
    weightRoutes,
    rankingRoutes,
    titleRouter,
    campRouter,
    statsRouter
} from '../modules/relational/index.js';
import {
    judgeRoutes,
    weighInsRoutes,
    boutRoutes,
    metricRoutes,
    bonusRoutes,
    oddsRouter
} from '../modules/bouts/index.js';
import { MonitorRouter } from '../modules/monitoring/monitor.route.js';

export const routesConfig = [
  { path: '/fighters', router: fighterRoutes },
  { path: '/teams',    router: teamRoutes },
  { path: '/divisions',router: divisionRoutes },
  { path: '/events',   router: eventRoutes },
  { path: '/injuries', router: injuryRoutes },
  { path: '/stables',  router: stableRoutes },
  { path: '/weights',  router: weightRoutes },
  { path: '/judges',   router: judgeRoutes },
  { path: '/weighIns', router: weighInsRoutes },
  { path: '/bouts',    router: boutRoutes },
  { path: '/metrics',  router: metricRoutes },
  { path: '/rankings', router: rankingRoutes },
  { path: '/bonuses',  router: bonusRoutes },
  { path: '/titles',  router: titleRouter },
  { path: '/odds',  router: oddsRouter },
  { path: '/camps',  router: campRouter },
  { path: '/stats',  router: statsRouter },
  { path: '/monitoring', router: MonitorRouter },
];

// Lista de los nombres de las tablas de la base de datos que se deben limpiar antes de cada test
export const tablesToClear: string[] = [
    // Tablas con dependencias (orden inverso)
    'bout_metrics',           // Depende de bouts y fighters
    'bout_judges',            // Depende de bouts
    'bout_weigh_ins',         // Depende de bouts y fighters
    'bout_bonuses',           // Depende de bouts y fighters
    'bout_odds',              // Depende de bouts
    'training_camps',         // Depende de bouts, teams y fighters
    'fighter_titles',         // Depende de divisions y fighters
    'fighter_rankings',       // Depende de fighters y divisions
    'fighter_stats',          // Depende de fighters (unique)
    'fighter_injuries',       // Depende de fighters
    'fighter_teams',          // Depende de fighters y teams
    'fighter_division',       // Depende de fighters y divisions
    
    // Tablas principales (dependen de otras pero no tienen dependientes)
    'bouts',                  // Depende de events, divisions, fighters
    'fighters',               // Depende de sí misma (relaciones)
    
    // Tablas base (independientes o con pocas dependencias)
    'events',                 // Independiente
    'divisions',              // Independiente
    'teams',                  // Independiente
]