/**
 * @openapi
 * components:
 *   schemas:
 *     Metric:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la métrica
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *         round:
 *           type: integer
 *           description: Número de ronda
 *         sig_strikes_landed:
 *           type: integer
 *           description: Golpes significativos conectados
 *         sig_strikes_attempted:
 *           type: integer
 *           description: Golpes significativos intentados
 *         total_strikes_landed:
 *           type: integer
 *           description: Golpes totales conectados
 *         total_strikes_attempted:
 *           type: integer
 *           description: Golpes totales intentados
 *         head_strikes_landed:
 *           type: integer
 *           description: Golpes a la cabeza conectados
 *         body_strikes_landed:
 *           type: integer
 *           description: Golpes al cuerpo conectados
 *         leg_strikes_landed:
 *           type: integer
 *           description: Golpes a las piernas conectados
 *         takedowns_landed:
 *           type: integer
 *           description: Derribos conectados
 *         takedowns_attempted:
 *           type: integer
 *           description: Derribos intentados
 *         submissions_landed:
 *           type: integer
 *           description: Sumisiones conectadas
 *         reversals:
 *           type: integer
 *           description: Reversales
 *         control_time:
 *           type: integer
 *           description: Tiempo de control en segundos
 *         knockdowns:
 *           type: integer
 *           description: Derribos (knockdowns)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateMetricInput:
 *       type: object
 *       required:
 *         - bout_id
 *         - fighter_id
 *         - round
 *       properties:
 *         bout_id:
 *           type: integer
 *         fighter_id:
 *           type: integer
 *         round:
 *           type: integer
 *         sig_strikes_landed:
 *           type: integer
 *         sig_strikes_attempted:
 *           type: integer
 *         total_strikes_landed:
 *           type: integer
 *         total_strikes_attempted:
 *           type: integer
 *         head_strikes_landed:
 *           type: integer
 *         body_strikes_landed:
 *           type: integer
 *         leg_strikes_landed:
 *           type: integer
 *         takedowns_landed:
 *           type: integer
 *         takedowns_attempted:
 *           type: integer
 *         submissions_landed:
 *           type: integer
 *         reversals:
 *           type: integer
 *         control_time:
 *           type: integer
 *         knockdowns:
 *           type: integer
 *     UpdateMetricInput:
 *       type: object
 *       properties:
 *         sig_strikes_landed:
 *           type: integer
 *         sig_strikes_attempted:
 *           type: integer
 *         total_strikes_landed:
 *           type: integer
 *         total_strikes_attempted:
 *           type: integer
 *         head_strikes_landed:
 *           type: integer
 *         body_strikes_landed:
 *           type: integer
 *         leg_strikes_landed:
 *           type: integer
 *         takedowns_landed:
 *           type: integer
 *         takedowns_attempted:
 *           type: integer
 *         submissions_landed:
 *           type: integer
 *         reversals:
 *           type: integer
 *         control_time:
 *           type: integer
 *         knockdowns:
 *           type: integer
 */

import {Router} from "express";
import {MetricController} from "./metric.controller.js";
import { MetricService } from "./metric.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";
import { settings } from '../../../../config/settings.js';
import { clearCacheMiddleware } from '../../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new MetricController(new MetricService(prisma));

/**
 * @openapi
 * /metrics:
 *   post:
 *     tags: [Métricas]
 *     summary: Crear una nueva métrica
 *     description: Registra las métricas de un luchador en una ronda de una pelea
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMetricInput'
 *     responses:
 *       '201':
 *         description: Métrica creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Metric'
 */
router.post('/', clearCacheMiddleware(`${settings.basePath}/metrics`), controller.create.bind(controller));

/**
 * @openapi
 * /metrics/bout/{BoutId}:
 *   get:
 *     tags: [Métricas]
 *     summary: Obtener todas las métricas de una pelea
 *     parameters:
 *       - in: path
 *         name: BoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pelea
 *     responses:
 *       '200':
 *         description: Métricas de la pelea obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Metric'
 */
router.get('/bout/:BoutId', controller.findAll.bind(controller));

/**
 * @openapi
 * /metrics/bout/{BoutId}/fighter/{fighterId}/round/{round}:
 *   get:
 *     tags: [Métricas]
 *     summary: Obtener métricas de un luchador en una ronda específica
 *     parameters:
 *       - in: path
 *         name: BoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pelea
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *       - in: path
 *         name: round
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de ronda
 *     responses:
 *       '200':
 *         description: Métricas del luchador en la ronda obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Metric'
 */
router.get('/bout/:BoutId/fighter/:fighterId/round/:round', controller.findAllByFighter.bind(controller));

/**
 * @openapi
 * /metrics/{MetricId}:
 *   get:
 *     tags: [Métricas]
 *     summary: Obtener una métrica por ID
 *     parameters:
 *       - in: path
 *         name: MetricId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la métrica
 *     responses:
 *       '200':
 *         description: Métrica obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Metric'
 */
router.get('/:MetricId', controller.findById.bind(controller));

/**
 * @openapi
 * /metrics/{MetricId}:
 *   patch:
 *     tags: [Métricas]
 *     summary: Actualizar una métrica
 *     description: Actualiza los datos de una métrica existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: MetricId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la métrica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMetricInput'
 *     responses:
 *       '200':
 *         description: Métrica actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Metric'
 */
router.patch('/:MetricId', clearCacheMiddleware(`${settings.basePath}/metrics/:MetricId`), controller.update.bind(controller));

/**
 * @openapi
 * /metrics/soft/{MetricId}:
 *   patch:
 *     tags: [Métricas]
 *     summary: Eliminar una métrica (soft delete)
 *     description: Marca una métrica como eliminada sin borrarla de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: MetricId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la métrica
 *     responses:
 *       '200':
 *         description: Métrica eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Metric'
 */
router.patch('/soft/:MetricId', clearCacheMiddleware(`${settings.basePath}/metrics/soft/:MetricId`), controller.delete.bind(controller));

export const metricRoutes = router;