import type { Request, Response, NextFunction } from 'express';
import { correlationContext } from '../../utils/context/correlation.context.js';
import type { CorrelationContext } from '../../utils/context/correlation.context.js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger/logger.js';

// Middleware para generar y adjuntar un Correlation ID a cada solicitud entrante
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction){
    // Se genera el correlation ID usando UUID v4
    const correlationId = uuidv4();
    req.correlationId = correlationId;
    req.contextStartTime = Date.now();

    res.setHeader('X-Correlation-ID', correlationId);

    // Creamos el contexto de correlación para la solicitud actual
    const context: CorrelationContext = {
        correlationId: correlationId,
        startTime: req.contextStartTime
    };
    
    correlationContext.run(context, () => {
        res.on('finish', () => {
            const duration = Date.now() - (req.contextStartTime || Date.now());
            logger.info(`Pertición finalizada: ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`, {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration: `${duration}ms`,
                correlationId: correlationId,
            });
        });
        next();
    })
}