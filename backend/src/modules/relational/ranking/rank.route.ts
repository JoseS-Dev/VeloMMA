/**
 * @openapi
 * components:
 *   schemas:
 *     Ranking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del ranking
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *         division_id:
 *           type: integer
 *           description: ID de la división
 *         rank:
 *           type: integer
 *           description: Posición en el ranking
 *         as_of_date:
 *           type: string
 *           format: date
 *           description: Fecha de vigencia del ranking
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateRankingInput:
 *       type: object
 *       required:
 *         - fighter_id
 *         - division_id
 *         - rank
 *         - as_of_date
 *       properties:
 *         fighter_id:
 *           type: integer
 *         division_id:
 *           type: integer
 *         rank:
 *           type: integer
 *         as_of_date:
 *           type: string
 *           format: date
 *     UpdateRankingInput:
 *       type: object
 *       properties:
 *         rank:
 *           type: integer
 *         as_of_date:
 *           type: string
 *           format: date
 */

import { Router } from "express";
import { RankingController } from "./rank.controller.js";
import { RankingService } from "./rank.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";
import { settings } from '../../../../config/settings.js';
import { clearCacheMiddleware } from '../../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new RankingController(new RankingService(prisma));

/**
 * @openapi
 * /rankings:
 *   post:
 *     tags: [Rankings]
 *     summary: Crear una nueva clasificación
 *     description: Registra la clasificación de un luchador en una división
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRankingInput'
 *     responses:
 *       '201':
 *         description: Clasificación creada exitosamente
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
 *                   $ref: '#/components/schemas/Ranking'
 */
router.post('/',clearCacheMiddleware(`${settings.basePath}/rankings`), controller.create.bind(controller));

/**
 * @openapi
 * /rankings:
 *   get:
 *     tags: [Rankings]
 *     summary: Obtener todas las clasificaciones
 *     description: Retorna una lista de todas las clasificaciones registradas
 *     responses:
 *       '200':
 *         description: Lista de clasificaciones obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Ranking'
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @openapi
 * /rankings/division/{DivisionId}:
 *   get:
 *     tags: [Rankings]
 *     summary: Obtener clasificaciones por división
 *     description: Retorna todas las clasificaciones de una división específica
 *     parameters:
 *       - in: path
 *         name: DivisionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la división
 *     responses:
 *       '200':
 *         description: Clasificaciones de la división obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Ranking'
 */
router.get('/division/:DivisionId', controller.findAllByDivision.bind(controller));

/**
 * @openapi
 * /rankings/{RankingId}:
 *   get:
 *     tags: [Rankings]
 *     summary: Obtener una clasificación por ID
 *     parameters:
 *       - in: path
 *         name: RankingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la clasificación
 *     responses:
 *       '200':
 *         description: Clasificación obtenida exitosamente
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
 *                   $ref: '#/components/schemas/Ranking'
 */
router.get('/:RankingId', controller.findById.bind(controller));

/**
 * @openapi
 * /rankings/{RankingId}:
 *   patch:
 *     tags: [Rankings]
 *     summary: Actualizar una clasificación
 *     description: Actualiza los datos de una clasificación existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: RankingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la clasificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRankingInput'
 *     responses:
 *       '200':
 *         description: Clasificación actualizada exitosamente
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
 *                   $ref: '#/components/schemas/Ranking'
 */
router.patch('/:RankingId',clearCacheMiddleware(`${settings.basePath}/rankings/:RankingId`), controller.update.bind(controller));

/**
 * @openapi
 * /rankings/soft/{RankingId}:
 *   patch:
 *     tags: [Rankings]
 *     summary: Eliminar una clasificación (soft delete)
 *     description: Marca una clasificación como eliminada sin borrarla de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: RankingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la clasificación
 *     responses:
 *       '200':
 *         description: Clasificación eliminada exitosamente
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
 *                   $ref: '#/components/schemas/Ranking'
 */
router.patch('/soft/:RankingId',clearCacheMiddleware(`${settings.basePath}/rankings/soft/:RankingId`), controller.delete.bind(controller));

export const rankingRoutes = router;