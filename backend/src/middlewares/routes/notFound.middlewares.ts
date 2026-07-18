import type {Request, Response, NextFunction} from 'express';
import { NotFoundException } from '../../common/errors/error.js';
import { settings } from '../../../config/settings.js';

// Middleware para manejar rutas no encontradas
export function notFoundMiddleware(req: Request, res: Response, next: NextFunction){
    try {
        const isDevelopment = settings.nodeEnv === 'development';

        if(isDevelopment){
            const notFound = new NotFoundException(`La ruta ${req.originalUrl} no existe en el servidor`);
            try {
                (notFound as any).details = {
                    availableRoutes: req.app._router?.stack
                        ?.filter((layer: any) => layer.route && layer.route.path !== '/*')
                        ?.map((layer: any) => {
                            const route = layer.route;
                            const methods = Object.keys(route.methods).join(', ').toUpperCase();
                            return `${methods} ${route.path}`;
                        }),
                    hint: 'Revise la documentación de la API',
                };
            } catch {
                (notFound as any).details = { hint: 'Revise la documentación de la API' };
            }
            return next(notFound);
        }

        if(settings.nodeEnv === 'test'){
            return next(new NotFoundException('No encontrada'));
        }

        return next(new NotFoundException(`La ruta ${req.originalUrl} no existe en el servidor`));
    } catch (error) {
        return next(error);
    }
}