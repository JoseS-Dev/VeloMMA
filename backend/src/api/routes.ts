import {Router} from 'express';
import { settings } from '../../config/settings.js';
import { fighterRoutes } from '../modules/fighters/fighter.route.js';
import { teamRoutes } from '../modules/teams/team.route.js';
import { divisionRoutes } from '../modules/divisions/division.route.js';
import { eventRoutes } from '../modules/events/event.route.js';
import { 
    injuryRoutes,
    stableRoutes,
    weightRoutes
} from '../modules/relational/index.js';
import {
    judgeRoutes,
    weighInsRoutes,
    boutRoutes
} from '../modules/bouts/index.js';

// Rutas de la API
const apiRouter: Router = Router();

// Rutas
apiRouter.use(`${settings.basePath}/fighters`, fighterRoutes);
apiRouter.use(`${settings.basePath}/teams`, teamRoutes);
apiRouter.use(`${settings.basePath}/divisions`, divisionRoutes);
apiRouter.use(`${settings.basePath}/events`, eventRoutes);
apiRouter.use(`${settings.basePath}/injuries`, injuryRoutes);
apiRouter.use(`${settings.basePath}/stables`, stableRoutes);
apiRouter.use(`${settings.basePath}/weights`, weightRoutes);
apiRouter.use(`${settings.basePath}/judges`, judgeRoutes);
apiRouter.use(`${settings.basePath}/weighIns`, weighInsRoutes);
apiRouter.use(`${settings.basePath}/bouts`, boutRoutes);

export { apiRouter };
