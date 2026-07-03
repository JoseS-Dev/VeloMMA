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
  { path: '/stats',  router: statsRouter }
];