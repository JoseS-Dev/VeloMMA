import type { Request, Response, NextFunction } from 'express';
import { client } from '../../../config/cache/redis.js';

// middleware global para cache
export async function globalCacheMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    if(req.method === 'GET') return next();
    // LLave unica
    const cacheKey = `cache:${req.originalUrl}`;
    try{
        // Verificamos buscar si esa query existe en la cache
        const cachedResponse = await client.get(cacheKey);
        if(cachedResponse){
            return res.json(JSON.parse(cachedResponse));
        }
        const originalJSON = res.json;
        res.json = function (body): Response {
            // Guardamos la respuesta en al cache si solo fue exitosa
            if(body?.status === 200 && res.statusCode === 200){
                const TTL_SECONDS = 120
                client.setEx(cacheKey, TTL_SECONDS, JSON.stringify(body))
                .catch(err => console.error('Error al guardar en cache', err));
            }
            return originalJSON(body);
        }
        next();
    }
    catch(err){
        console.error('Error al guardar en cache', err);
        next();
    }
}