import express, { json } from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { errorsMiddleware } from './src/middlewares/Exception/errors.middleware.js';
import { globalCacheMiddleware } from './src/middlewares/cache/global-cache.middleware.js';
import { settings } from './config/settings.js';
import { apiRouter } from './src/api/routes.js';
import { swaggerSpec } from './config/swagger/docs.js';
import { connectRedis } from './config/cache/redis.js';
import { prisma } from './src/utils/prisma/prisma.js';
import { readLimiter, writeLimiter } from './src/middlewares/ratedLimit/rate.middleware.js';

// Inició e servidor express
const app: express.Application = express();
const isTest = settings.nodeEnv === 'test';

// Middlewares
app.use(json());
app.use(cors({
    origin: settings.corsOrigin,
    credentials: true
}));
app.use(helmet());
app.use(cookieParser());


if(!isTest){
    app.use(morgan('dev'));
    app.use(globalCacheMiddleware);
}

// Ruta de bienvenida
app.get(`${settings.basePath}`, (req: Request, res: Response) => {
    return res.json({
        message: 'Bienvenido a la API de VeloMMA',
        timestamp: new Date().toISOString()
    })
})

// Ruta de health
app.get(`${settings.basePath}/health`, async (req: Request, res: Response) => {
    return res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
            total: process.memoryUsage().heapTotal,
            used: process.memoryUsage().heapUsed,
            rss: process.memoryUsage().rss
        },
        version: process.version,
        environment: process.env.NODE_ENV || 'development',
        database: {
            status: `${await prisma.$queryRaw`SELECT 1` ? 'OK' : 'ERROR'}`,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                total: process.memoryUsage().heapTotal,
                used: process.memoryUsage().heapUsed,
                rss: process.memoryUsage().rss
            }
        },
        redis: {
            status: settings.redisEnv ? 'OK' : 'DISABLED',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                total: process.memoryUsage().heapTotal,
                used: process.memoryUsage().heapUsed,
                rss: process.memoryUsage().rss
            }
        }
    })
});

// Ruta de ping
app.get(`${settings.basePath}/ping`, (req: Request, res: Response) => {
    return res.json({
        status: 'pong',
        timestamp: new Date().toISOString()
    })
});

// Swagger
app.use(`${settings.basePath}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use(apiRouter);

app.use(errorsMiddleware);

if(!isTest){
    if(settings.redisEnv) await connectRedis();
    app.listen(settings.port, () => {
        console.log(`Servidor corriendo en http://localhost:${settings.port}${settings.basePath}`);
    });
}


export default app;
