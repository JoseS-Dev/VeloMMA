import { Router } from 'express';
import { settings } from '../../config/settings.js';
import { routesConfig } from '../utils/utils.js';
import { secureMiddleware } from '../middlewares/routes/route.middlewares.js';

// Rutas de la API
const apiRouter: Router = Router();

routesConfig.forEach(({path, router}) => {
    apiRouter.use(`${settings.basePath}${path}`, secureMiddleware ,router)
})

export { apiRouter };
