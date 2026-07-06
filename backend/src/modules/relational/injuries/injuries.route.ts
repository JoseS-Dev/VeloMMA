/**
 * @openapi
 * components:
 *   schemas:
 *     Injury:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la lesión
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *         description_injury:
 *           type: string
 *           description: Descripción de la lesión
 *         severity_injury:
 *           type: string
 *           enum: [Menor, Moderado, Severo]
 *           description: Severidad de la lesión
 *         injury_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Fecha de la lesión
 *         recovery_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Fecha de recuperación
 *         is_active:
 *           type: boolean
 *           description: Indica si el registro está activo
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateInjuryInput:
 *       type: object
 *       required:
 *         - fighter_id
 *         - description_injury
 *         - severity_injury
 *       properties:
 *         fighter_id:
 *           type: integer
 *         description_injury:
 *           type: string
 *         severity_injury:
 *           type: string
 *           enum: [Menor, Moderado, Severo]
 *         injury_date:
 *           type: string
 *           format: date
 *         recovery_date:
 *           type: string
 *           format: date
 *     UpdateInjuryInput:
 *       type: object
 *       properties:
 *         description_injury:
 *           type: string
 *         severity_injury:
 *           type: string
 *           enum: [Menor, Moderado, Severo]
 *         injury_date:
 *           type: string
 *           format: date
 *         recovery_date:
 *           type: string
 *           format: date
 *         is_active:
 *           type: boolean
 *     ChangeStatusInput:
 *       type: object
 *       required:
 *         - is_active
 *       properties:
 *         is_active:
 *           type: boolean
 */

import {Router} from 'express';
import { InjuryController } from './injuries.controller.js';
import { InjuryService } from './injuries.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';
import { settings } from '../../../../config/settings.js';
import { clearCacheMiddleware } from '../../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new InjuryController(new InjuryService(prisma));

/**
 * @openapi
 * /injuries:
 *   post:
 *     tags: [Lesiones]
 *     summary: Crear una nueva lesión o inactividad
 *     description: Registra una lesión o inactividad para un luchador
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInjuryInput'
 *     responses:
 *       '201':
 *         description: Lesión creada exitosamente
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
 *                   $ref: '#/components/schemas/Injury'
 */
router.post('/',clearCacheMiddleware(`${settings.basePath}/injuries`), controller.create.bind(controller));

/**
 * @openapi
 * /injuries/fighter/{fighterId}:
 *   get:
 *     tags: [Lesiones]
 *     summary: Obtener todas las lesiones de un luchador
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     responses:
 *       '200':
 *         description: Lista de lesiones del luchador obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Injury'
 */
router.get('/fighter/:fighterId', controller.findAll.bind(controller));

/**
 * @openapi
 * /injuries/fighter/{fighterId}/severity:
 *   get:
 *     tags: [Lesiones]
 *     summary: Obtener lesiones por severidad
 *     description: Retorna las lesiones de un luchador filtradas por nivel de severidad
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *       - in: query
 *         name: severity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Menor, Moderado, Severo]
 *         description: Nivel de severidad
 *     responses:
 *       '200':
 *         description: Lesiones filtradas por severidad obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Injury'
 */
router.get('/fighter/:fighterId/severity', controller.findBySeverity.bind(controller));

/**
 * @openapi
 * /injuries/{injuryId}:
 *   get:
 *     tags: [Lesiones]
 *     summary: Obtener una lesión por ID
 *     parameters:
 *       - in: path
 *         name: injuryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la lesión
 *     responses:
 *       '200':
 *         description: Lesión obtenida exitosamente
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
 *                   $ref: '#/components/schemas/Injury'
 */
router.get('/:injuryId', controller.findById.bind(controller));

/**
 * @openapi
 * /injuries/{injuryId}:
 *   patch:
 *     tags: [Lesiones]
 *     summary: Actualizar una lesión
 *     description: Actualiza los datos de una lesión existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: injuryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la lesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInjuryInput'
 *     responses:
 *       '200':
 *         description: Lesión actualizada exitosamente
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
 *                   $ref: '#/components/schemas/Injury'
 */
router.patch('/:injuryId',clearCacheMiddleware(`${settings.basePath}/injuries/:injuryId`), controller.update.bind(controller));

/**
 * @openapi
 * /injuries/{injuryId}/status:
 *   patch:
 *     tags: [Lesiones]
 *     summary: Cambiar el estado de una lesión
 *     description: Activa o desactiva un registro de lesión
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: injuryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la lesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeStatusInput'
 *     responses:
 *       '200':
 *         description: Estado de la lesión actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Injury'
 */
router.patch('/:injuryId/status',clearCacheMiddleware(`${settings.basePath}/injuries/:injuryId/status`), controller.changeStatus.bind(controller));

/**
 * @openapi
 * /injuries/soft/{injuryId}:
 *   patch:
 *     tags: [Lesiones]
 *     summary: Eliminar una lesión (soft delete)
 *     description: Marca una lesión como eliminada sin borrarla de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: injuryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la lesión
 *     responses:
 *       '200':
 *         description: Lesión eliminada exitosamente
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
 *                   $ref: '#/components/schemas/Injury'
 */
router.patch('/soft/:injuryId',clearCacheMiddleware(`${settings.basePath}/injuries/soft/:injuryId`), controller.delete.bind(controller));

export const injuryRoutes = router;