import type { Request, Response, NextFunction } from 'express';
import { logger, logHttpRequest } from '../../utils/logger/logger.js';
import { getCorrelationId } from '../../utils/context/correlation.context.js';

// ✅ Middleware para loggear todas las requests
export function httpLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const correlationId = req.correlationId || getCorrelationId();

    // ✅ Log de inicio de request
    logger.debug(`→ ${req.method} ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        body: req.body,
        query: req.query,
        params: req.params,
        correlationId,
    });

    // ✅ Interceptar respuesta para log
    const originalSend = res.send;
    res.send = function(body: any): Response {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;

        // ✅ Log según status
        if (statusCode >= 500) {
            logger.error(`✗ ${req.method} ${req.originalUrl} - ${statusCode} (${duration}ms)`, {
                method: req.method,
                url: req.originalUrl,
                status: statusCode,
                duration: `${duration}ms`,
                correlationId,
                body: body,
            });
        } else if (statusCode >= 400) {
            logger.warn(`⚠ ${req.method} ${req.originalUrl} - ${statusCode} (${duration}ms)`, {
                method: req.method,
                url: req.originalUrl,
                status: statusCode,
                duration: `${duration}ms`,
                correlationId,
                body: body,
            });
        } else {
            logger.info(`✓ ${req.method} ${req.originalUrl} - ${statusCode} (${duration}ms)`, {
                method: req.method,
                url: req.originalUrl,
                status: statusCode,
                duration: `${duration}ms`,
                correlationId,
            });
        }

        // ✅ Llamar al método original
        return originalSend.call(this, body);
    };

    next();
}