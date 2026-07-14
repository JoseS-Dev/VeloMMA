// src/middlewares/metrics/http-metrics.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import {
    httpRequestsTotal,
    httpRequestDuration,
    httpRequestSize,
    httpResponseSize
} from '../../../../config/metrics/index.js';

// ✅ Versión optimizada - Sin sobrescritura de res.send
export function middlewareHttpMetrics(req: Request, res: Response, next: NextFunction) {
    const startTime = process.hrtime();
    const requestSize = parseInt(req.headers['content-length'] || '0', 10);
    const method = req.method;
    const route = req.route?.path || req.path || 'unknown';

    res.on('finish', () => {
        const diff = process.hrtime(startTime);
        const duration = diff[0] + diff[1] / 1e9;

        const statusCode = res.statusCode.toString();
        const statusCategory = `${Math.floor(res.statusCode / 100)}xx`;

        try {
            httpRequestsTotal.inc({
                method,
                route,
                status_code: statusCode,
                status_category: statusCategory,
            });

            httpRequestDuration.observe(
                { method, route, status_code: statusCode },
                duration
            );

            if (requestSize > 0) {
                httpRequestSize.observe({ method, route }, requestSize);
            }

            const contentLength = res.getHeader('content-length');
            if (contentLength) {
                const size = parseInt(contentLength as string, 10);
                if (size > 0) {
                    httpResponseSize.observe(
                        { method, route, status_code: statusCode },
                        size
                    );
                }
            }
        } catch (error) {
            console.error('❌ Error recording HTTP metrics:', error);
        }
    });

    next();
}