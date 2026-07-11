import {Router} from 'express';
import { MonitorController } from './monitor.controller.js';

const router: Router = Router();
const controller = new MonitorController();

// Ruta para obtener las métricas de Prometheus
router.get('/prometheus', controller.getPromotheusMetrics.bind(controller));
// Ruta para obtener las métricas de Prometheus en formato JSON
router.get('/prometheus/json', controller.getPromotheusMetricsJson.bind(controller));

export const MonitorRouter = router;

