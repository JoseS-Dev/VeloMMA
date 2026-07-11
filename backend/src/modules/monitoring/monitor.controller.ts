import type { Request, Response }from 'express';
import { register } from '../../../config/metrics/index.js';
// Controlador para el monitoreo de la app
export class MonitorController {
    // Contrlador para obtener las metricas de prometheus
    async getPromotheusMetrics(req: Request, res: Response){
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        return res.status(200).send(metrics);
    }

    // Controlador para obtener las metricas de promotheus en formato json
    async getPromotheusMetricsJson(req: Request, res: Response){
        const metrics = await register.metrics();
        return res.status(200).json(metrics);
    }
}