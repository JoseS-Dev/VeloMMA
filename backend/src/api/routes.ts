import {Router} from 'express';
import { settings } from '../../config/settings.js';
import { fighterRoutes } from '../modules/fighters/fighter.route.js';

// Rutas de la API
const router: Router = Router();

export const Routes = {
    fighters: {
        fighter: router.use(`${settings.basePath}/fighters`, fighterRoutes),
    }
}