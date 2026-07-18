import type { Request, Response, NextFunction } from 'express';
import { client } from '../../../config/cache/redis.js';
import { 
    TTL_SECONDS,
    EXCLUDED_PATHS 
} from '../../utils/constants/constant.js';

// middleware global para cache
export async function globalCacheMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    if(req.method !== 'GET' || !client) return next();
    if(EXCLUDED_PATHS.some(path => req.originalUrl.startsWith(path))) return next();
    // LLave unica
    const cacheKey = `cache:${req.originalUrl}`;
    try{
        // Verificamos buscar si esa query existe en la cache
        const cachedResponse = await client?.get(cacheKey);
        if(cachedResponse){
            res.setHeader('X-Cache', 'HIT');
            return res.json(JSON.parse(cachedResponse));
        }

        const originalJSON = res.json.bind(res);
        res.json = function (body): Response {
            if(res.statusCode === 200){
                client?.setEx(cacheKey, TTL_SECONDS, JSON.stringify(body));
                res.setHeader('X-Cache', 'MISS');
            }
            res.json = originalJSON;
            return originalJSON(body);
        }
        next();
    }
    catch(err){
        console.error('Error al guardar en cache', err);
        next();
    }
}