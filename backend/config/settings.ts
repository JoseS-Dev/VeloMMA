import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __currentDir = path.dirname(__filename);


dotenv.config({
    path: process.env.NODE_ENV === 'test' ? 
    path.resolve(__currentDir, '../.env.test') 
    : path.resolve(__currentDir, '../.env.local'),
    override: true
});

// Variables de entorno del servidor
export const settings = {
    port: process.env.PORT || 3000,
    secret: process.env.JWT_SECRET || 'secret',
    databaseUrl: process.env.DATABASE_URL || '',
    basePath: process.env.BASE_PATH || '',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    apiKey: process.env.API_SECRET_KEY || '',
    cookieSecret: process.env.COOKIE_SECRET || '',
    redisUrl: process.env.REDIS_URL || '',
    redisPort: process.env.REDIS_PORT || 6379,
    redisEnv: process.env.REDIS_ENV !== undefined ? process.env.REDIS_ENV === 'true' : false,
    rateLimit: {
        windowMs: 1 * 60 * 1000, // 5 minutos
        max: 100, // 100 peticiones
        message: 'Demasiados intentos de acceso, por favor espere un minuto y vuelva a intentarlo.',
    }
}