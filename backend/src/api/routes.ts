import { Router } from 'express';
import { settings } from '../../config/settings.js';
import { routesConfig } from '../utils/utils.js';
import { secureMiddleware } from '../middlewares/routes/route.middlewares.js';
import { middlewareRateLimit } from '../middlewares/ratedLimit/rate.middleware.js';

// Rutas de la API
const apiRouter: Router = Router();

const middlewareGlobalAPI = [
    middlewareRateLimit,
    secureMiddleware
]

routesConfig.forEach(({path, router}) => {
    apiRouter.use(`${settings.basePath}${path}`, middlewareGlobalAPI ,router)
})

export { apiRouter };
