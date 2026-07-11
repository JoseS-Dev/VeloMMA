import type {Request, Response, NextFunction} from 'express';
import { settings } from '../../../config/settings.js';
import rateLimit from 'express-rate-limit';

const isTest = settings.nodeEnv === 'test';

const readLimiter = rateLimit({
    windowMs: settings.readLimit.windowMs,
    max: settings.readLimit.max,
    message: 'Demasiadas perticiones de lectura, por favor espere cinco minutos y vuelva a intentarlo.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => req.path.includes(`${settings.basePath}/health`) || isTest
});

const writeLimiter = rateLimit({
    windowMs: settings.writeLimit.windowMs,
    max: settings.writeLimit.max,
    message: 'Demasiadas peticiones de escritura, por favor espere un minuto y vuelva a intentarlo.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => isTest
});


// Middleware para limitar la cantidad de peticiones a la API
export function middlewareRateLimit(req: Request, res: Response, next: NextFunction) {
    if(isTest) return next();
    const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    const limiter = isWriteMethod ? writeLimiter : readLimiter;
    limiter(req, res, next);
}