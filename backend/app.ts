import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { settings } from './config/settings.js';

// Inició e servidor express
const app: express.Application = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Rate Limit de peticiones
app.use(rateLimit(settings.rateLimit));

// Ruta de bienvenida
app.get(`/`, (req: Request, res: Response) => {
    return res.send('Bienvenido a la API de VeloMMA');
})

// Rutas

// Escuchamos el servidor
if(settings.nodeEnv === 'development'){
    app.listen(settings.port, () => {
        console.log(`Servidor corriendo en http://localhost:${settings.port}`);
    })
}

export default app;
