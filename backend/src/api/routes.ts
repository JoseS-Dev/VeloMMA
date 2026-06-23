import {Router} from 'express';
import { settings } from '../../config/settings.js';
import { fighterRoutes } from '../modules/fighters/fighter.route.js';
import { teamRoutes } from '../modules/teams/team.route.js';
import { divisionRoutes } from '../modules/divisions/division.route.js';
import { eventRoutes } from '../modules/events/event.route.js';

// Rutas de la API
const apiRouter: Router = Router();

// Rutas
apiRouter.use(`${settings.basePath}/fighters`, fighterRoutes);
apiRouter.use(`${settings.basePath}/teams`, teamRoutes);
apiRouter.use(`${settings.basePath}/divisions`, divisionRoutes);
apiRouter.use(`${settings.basePath}/events`, eventRoutes);

export { apiRouter };
