/**
 * @openapi
 * components:
 *   schemas:
 *     Stable:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del registro de equipo
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *         team_id:
 *           type: integer
 *           description: ID del equipo
 *         is_current:
 *           type: boolean
 *           description: Indica si es el equipo actual del luchador
 *         joined_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Fecha de ingreso al equipo
 *         left_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Fecha de salida del equipo
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateStableInput:
 *       type: object
 *       required:
 *         - fighter_id
 *         - team_id
 *       properties:
 *         fighter_id:
 *           type: integer
 *         team_id:
 *           type: integer
 *         is_current:
 *           type: boolean
 *         joined_date:
 *           type: string
 *           format: date
 *         left_date:
 *           type: string
 *           format: date
 *     UpdateStableInput:
 *       type: object
 *       properties:
 *         team_id:
 *           type: integer
 *         is_current:
 *           type: boolean
 *         joined_date:
 *           type: string
 *           format: date
 *         left_date:
 *           type: string
 *           format: date
 */

import { Router } from 'express';
import { StableController } from './stable.controller.js';
import { StableService } from './stable.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';
import { settings } from '../../../../config/settings.js';
import { clearCacheMiddleware } from '../../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new StableController(new StableService(prisma));

/**
 * @openapi
 * /stables:
 *   post:
 *     tags: [Equipos de Luchadores]
 *     summary: Crear una asignación de equipo para un luchador
 *     description: Asigna un luchador a un equipo
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStableInput'
 *     responses:
 *       '201':
 *         description: Asignación creada exitosamente
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
 *                   $ref: '#/components/schemas/Stable'
 */
router.post('/',clearCacheMiddleware(`${settings.basePath}/stables`), controller.create.bind(controller));

/**
 * @openapi
 * /stables/fighter/{fighterId}:
 *   get:
 *     tags: [Equipos de Luchadores]
 *     summary: Obtener todos los equipos de un luchador
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     responses:
 *       '200':
 *         description: Lista de equipos del luchador obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Stable'
 */
router.get('/fighter/:fighterId', controller.findAll.bind(controller));

/**
 * @openapi
 * /stables/{stableId}:
 *   get:
 *     tags: [Equipos de Luchadores]
 *     summary: Obtener una asignación de equipo por ID
 *     parameters:
 *       - in: path
 *         name: stableId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación
 *     responses:
 *       '200':
 *         description: Asignación obtenida exitosamente
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
 *                   $ref: '#/components/schemas/Stable'
 */
router.get('/:stableId', controller.findById.bind(controller));

/**
 * @openapi
 * /stables/{stableId}:
 *   patch:
 *     tags: [Equipos de Luchadores]
 *     summary: Actualizar una asignación de equipo
 *     description: Actualiza los datos de una asignación existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: stableId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStableInput'
 *     responses:
 *       '200':
 *         description: Asignación actualizada exitosamente
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
 *                   $ref: '#/components/schemas/Stable'
 */
router.patch('/:stableId',clearCacheMiddleware(`${settings.basePath}/stables/:stableId`), controller.update.bind(controller));

/**
 * @openapi
 * /stables/soft/{stableId}:
 *   patch:
 *     tags: [Equipos de Luchadores]
 *     summary: Eliminar una asignación de equipo (soft delete)
 *     description: Marca una asignación como eliminada sin borrarla de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: stableId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación
 *     responses:
 *       '200':
 *         description: Asignación eliminada exitosamente
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
 *                   $ref: '#/components/schemas/Stable'
 */
router.patch('/soft/:stableId', clearCacheMiddleware(`${settings.basePath}/stables/soft/:stableId`), controller.delete.bind(controller));

export const stableRoutes = router;