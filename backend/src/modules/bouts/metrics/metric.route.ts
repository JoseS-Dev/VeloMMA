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
 *           example: 1
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *           example: 1
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *           example: 1
 *         round:
 *           type: integer
 *           description: Número de ronda
 *           example: 1
 *         sig_strikes_landed:
 *           type: integer
 *           description: Golpes significativos conectados
 *           example: 25
 *         sig_strikes_attempted:
 *           type: integer
 *           description: Golpes significativos intentados
 *           example: 40
 *         total_strikes_landed:
 *           type: integer
 *           description: Golpes totales conectados
 *           example: 45
 *         total_strikes_attempted:
 *           type: integer
 *           description: Golpes totales intentados
 *           example: 60
 *         head_strikes_landed:
 *           type: integer
 *           description: Golpes a la cabeza conectados
 *           example: 12
 *         body_strikes_landed:
 *           type: integer
 *           description: Golpes al cuerpo conectados
 *           example: 8
 *         leg_strikes_landed:
 *           type: integer
 *           description: Golpes a las piernas conectados
 *           example: 5
 *         takedowns_landed:
 *           type: integer
 *           description: Derribos conectados
 *           example: 2
 *         takedowns_attempted:
 *           type: integer
 *           description: Derribos intentados
 *           example: 4
 *         submissions_landed:
 *           type: integer
 *           description: Sumisiones conectadas
 *           example: 1
 *         reversals:
 *           type: integer
 *           description: Reversales
 *           example: 0
 *         control_time:
 *           type: integer
 *           description: Tiempo de control en segundos
 *           example: 120
 *         knockdowns:
 *           type: integer
 *           description: Derribos (knockdowns)
 *           example: 1
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
 *           example: 1
 *         fighter_id:
 *           type: integer
 *           example: 1
 *         round:
 *           type: integer
 *           example: 1
 *         sig_strikes_landed:
 *           type: integer
 *           example: 25
 *         sig_strikes_attempted:
 *           type: integer
 *           example: 40
 *         total_strikes_landed:
 *           type: integer
 *           example: 45
 *         total_strikes_attempted:
 *           type: integer
 *           example: 60
 *         head_strikes_landed:
 *           type: integer
 *           example: 12
 *         body_strikes_landed:
 *           type: integer
 *           example: 8
 *         leg_strikes_landed:
 *           type: integer
 *           example: 5
 *         takedowns_landed:
 *           type: integer
 *           example: 2
 *         takedowns_attempted:
 *           type: integer
 *           example: 4
 *         submissions_landed:
 *           type: integer
 *           example: 1
 *         reversals:
 *           type: integer
 *           example: 0
 *         control_time:
 *           type: integer
 *           example: 120
 *         knockdowns:
 *           type: integer
 *           example: 1
 *     UpdateMetricInput:
 *       type: object
 *       properties:
 *         sig_strikes_landed:
 *           type: integer
 *           example: 25
 *         sig_strikes_attempted:
 *           type: integer
 *           example: 40
 *         total_strikes_landed:
 *           type: integer
 *           example: 45
 *         total_strikes_attempted:
 *           type: integer
 *           example: 60
 *         head_strikes_landed:
 *           type: integer
 *           example: 12
 *         body_strikes_landed:
 *           type: integer
 *           example: 8
 *         leg_strikes_landed:
 *           type: integer
 *           example: 5
 *         takedowns_landed:
 *           type: integer
 *           example: 2
 *         takedowns_attempted:
 *           type: integer
 *           example: 4
 *         submissions_landed:
 *           type: integer
 *           example: 1
 *         reversals:
 *           type: integer
 *           example: 0
 *         control_time:
 *           type: integer
 *           example: 120
 *         knockdowns:
 *           type: integer
 *           example: 1
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