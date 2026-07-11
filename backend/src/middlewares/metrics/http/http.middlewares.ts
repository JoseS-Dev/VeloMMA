import type {Request, Response, NextFunction} from 'express';
import {
    httpRequestsTotal,
    httpRequestDuration,
    httpRequestSize,
    httpResponseSize
} from '../../../../config/metrics/index.js';

// Middlewares para ver las metricas de las perticiones HTTP
export function middlewareHttpMetrics(req: Request, res: Response, next: NextFunction){
    const startTime = Date.now();
    const requestSize = parseInt(req.headers['content-length'] || '0', 10);

    const orginalSend = res.send;
    let responseSize = 0;

    // Interceptamos respuesta para medir el tamaño de la respuesta
    res.send = function(body: any) : Response {
        if(body) responseSize = Buffer.byteLength(JSON.stringify(body), 'utf8');
        return orginalSend.call(this, body)
    }

    // Cuando termine la respuesta , sacamos las metricas del endpoint
    res.on('finish',() => {
        const duration = (Date.now() - startTime) / 1000
        const route = req.route?.path || req.path || 'unknown'
        const method = req.method;
        const statusCode = res.statusCode.toString()
        const statusCategory = `${Math.floor(res.statusCode / 100)}xx`

        // Con estas variables incrementamos contador de las perticiones
        httpRequestsTotal.inc({
            method,
            route,
            status_code: statusCode,
            status_category: statusCategory
        })

        // Se registra la duración
        httpRequestDuration.observe(
            {method, route, status_code: statusCode},
            duration
        )
        // Registramos el tamaño
        if(requestSize > 0) httpRequestSize.observe({method, route}, requestSize)
        if(responseSize > 0) httpResponseSize.observe({method, route, status_code: statusCode}, responseSize)
        next()
    })
}