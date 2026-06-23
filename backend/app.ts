import express, { json } from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorsMiddleware } from './src/middlewares/Exception/errors.middleware.js';
import { settings } from './config/settings.js';
import { apiRouter } from './src/api/routes.js';

// Inició e servidor express
const app: express.Application = express();

// Middlewares
app.use(json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(errorsMiddleware);

// Rate Limit de peticiones
app.use(rateLimit(settings.rateLimit));

// Ruta de bienvenida
app.get(`${settings.basePath}`, (req: Request, res: Response) => {
    return res.send('Bienvenido a la API de VeloMMA');
})

// Rutas
app.use(apiRouter);

// Escuchamos el servidor
if(settings.nodeEnv === 'development'){
    app.listen(settings.port, () => {
        console.log(`Servidor corriendo en http://localhost:${settings.port}${settings.basePath}`);
    })
}

export default app;
