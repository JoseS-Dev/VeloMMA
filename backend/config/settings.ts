import dotenv from 'dotenv';

dotenv.config();

// Variables de entorno del servidor
export const settings = {
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || 'secret',
    databaseUrl: process.env.DATABASE_URL || '',
    basePath: process.env.BASE_PATH || '',
    nodeEnv: process.env.NODE_ENV || 'development',
    rateLimit: {
        windowMs: 1 * 60 * 1000, // 5 minutos
        max: 100, // 100 peticiones
        message: 'Demasiados intentos de acceso, por favor espere un minuto y vuelva a intentarlo.',
    }
}