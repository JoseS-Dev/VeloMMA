import { env } from './validation/env.js';
import helmet from 'helmet';

// Variables de entorno del servidor
export const settings = {
    port: env.PORT,
    secret: env.JWT_SECRET,
    databaseUrl: env.DATABASE_URL,
    basePath: env.BASE_PATH,
    nodeEnv: env.NODE_ENV,
    corsOrigin: env.CORS_ORIGIN,
    apiKey: env.API_SECRET_KEY,
    cookieSecret: env.COOKIE_SECRET,
    redisUrl: env.REDIS_URL,
    redisPort: env.REDIS_PORT,
    redisEnv: env.REDIS_ENV,
    readLimit: {
        windowMs: env.LIMIT_READ_WINDOW_MS,
        max: env.LIMIT_READ_MAX,
        message: 'Demasiados intentos de acceso, por favor espere cinco minutos y vuelva a intentarlo.',
    },
    writeLimit: {
        windowMs: env.LIMIT_WRITE_WINDOW_MS,
        max: env.LIMIT_WRITE_MAX,
        message: 'Demasiadas peticiones de escritura, por favor espere un minuto y vuelva a intentarlo.',
    }
} as const;

// Configuraciones del Helmet
export const helmetConfig = helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    dnsPrefetchControl: false,
    frameguard: false,
    hidePoweredBy: true,
    hsts: false,
    ieNoOpen: false,
    noSniff: true,
    referrerPolicy: false,
    xssFilter: false,
})