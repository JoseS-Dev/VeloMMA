import type {
    Request,
    Response,
    NextFunction
} from 'express';
import { settings } from '../../../config/settings.js';

// Middleware para establecer rutas publicas y privadas
export function secureMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    if(req.method === 'GET') return next();

    // Si no es una petición GET, exigimos la API KEY
    const apikey = req.headers['x-api-key'];
    if(!apikey || apikey !== settings.apiKey){
        return res.status(401).json({message: 'No autorizado'});
    }
    return next();
}