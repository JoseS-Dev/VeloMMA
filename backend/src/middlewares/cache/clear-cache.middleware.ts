import type { Request, Response, NextFunction } from 'express';
import { client } from '../../../config/cache/redis.js';

// Middleware para limpiar la cache
export function clearCacheMiddleware(pattern: string){
    return async (req: Request, res: Response, next: NextFunction) => {
        const orginalJSON = res.json;
        res.json = function(body): Response {
            if(res.statusCode === 200 || res.statusCode === 201){
                client.keys(`cache:${pattern}*`)
                .then((keys) => {
                    if(keys.length > 0){
                        client.del(keys)
                        .catch(err => console.error('Error al limpiar cache', err));
                    }
                })
                .catch(err => console.error('Error al limpiar cache', err));
            }
            return orginalJSON(body);
        }
        next();
    }
}