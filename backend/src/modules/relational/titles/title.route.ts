/**
 * @openapi
 * components:
 *   schemas:
 *     Title:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del título
 *           example: 1
 *         division_id:
 *           type: integer
 *           description: ID de la división
 *           example: 1
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *           example: 1
 *         title_type:
 *           type: string
 *           enum: [Undisputed, Interim, Unified]
 *           description: Tipo de título
 *           example: Undisputed
 *         won_date:
 *           type: string
 *           format: date-time
 *           description: Fecha en que ganó el título
 *           example: 2024-01-20T23:00:00.000Z
 *         lost_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha en que perdió el título
 *           example: 2024-06-15T23:00:00.000Z
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha de eliminación (soft delete)
 *     CreateTitleInput:
 *       type: object
 *       required:
 *         - division_id
 *         - fighter_id
 *         - title_type
 *         - won_date
 *       properties:
 *         division_id:
 *           type: integer
 *           description: ID de la división
 *           example: 1
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *           example: 1
 *         title_type:
 *           type: string
 *           enum: [Undisputed, Interim, Unified]
 *           description: Tipo de título
 *           example: Undisputed
 *         won_date:
 *           type: string
 *           format: date-time
 *           description: Fecha en que ganó el título
 *           example: 2024-01-20T23:00:00.000Z
 *         lost_date:
 *           type: string
 *           format: date-time
 *           description: Fecha en que perdió el título
 *           example: 2024-06-15T23:00:00.000Z
 *     UpdateTitleInput:
 *       type: object
 *       properties:
 *         title_type:
 *           type: string
 *           enum: [Undisputed, Interim, Unified]
 *           description: Tipo de título
 *           example: Undisputed
 *         won_date:
 *           type: string
 *           format: date-time
 *           description: Fecha en que ganó el título
 *           example: 2024-01-20T23:00:00.000Z
 *         lost_date:
 *           type: string
 *           format: date-time
 *           description: Fecha en que perdió el título
 *           example: 2024-06-15T23:00:00.000Z
 */

import {Router} from 'express';
import { TitleController } from './title.controller.js';
import { TitleService } from './title.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';
import { settings } from '../../../../config/settings.js';
import { clearCacheMiddleware } from '../../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new TitleController(new TitleService(prisma));

/**
 * @openapi
 * /titles:
 *   post:
 *     tags: [Títulos]
 *     summary: Crear un nuevo título
 *     description: Registra un nuevo título de un luchador en una división
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTitleInput'
 *     responses:
 *       '201':
 *         description: Título creado exitosamente
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
 *                   $ref: '#/components/schemas/Title'
 */
router.post('/', clearCacheMiddleware(`${settings.basePath}/titles`), controller.create.bind(controller));

/**
 * @openapi
 * /titles/fighter/{fighterId}:
 *   get:
 *     tags: [Títulos]
 *     summary: Obtener todos los títulos de un luchador
 *     description: Retorna todos los títulos que ha tenido un luchador
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     responses:
 *       '200':
 *         description: Lista de títulos del luchador obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Title'
 */
router.get('/fighter/:fighterId', controller.findAllByFighter.bind(controller));

/**
 * @openapi
 * /titles/division/{divisionId}:
 *   get:
 *     tags: [Títulos]
 *     summary: Obtener todos los títulos de una división
 *     description: Retorna todos los títulos de una división específica
 *     parameters:
 *       - in: path
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la división
 *     responses:
 *       '200':
 *         description: Lista de títulos de la división obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Title'
 */
router.get('/division/:divisionId', controller.findAllByDivision.bind(controller));

/**
 * @openapi
 * /titles/division/{divisionId}/title-type/{titleType}:
 *   get:
 *     tags: [Títulos]
 *     summary: Obtener títulos por división y tipo
 *     description: Retorna todos los títulos de una división específica y tipo de título
 *     parameters:
 *       - in: path
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la división
 *       - in: path
 *         name: titleType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Undisputed, Interim, Unified]
 *         description: Tipo de título
 *     responses:
 *       '200':
 *         description: Lista de títulos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Title'
 */
router.get('/division/:divisionId/title-type/:titleType', controller.findAllByDivisionAndTitleType.bind(controller));

/**
 * @openapi
 * /titles/{titleId}:
 *   get:
 *     tags: [Títulos]
 *     summary: Obtener un título por ID
 *     parameters:
 *       - in: path
 *         name: titleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del título
 *     responses:
 *       '200':
 *         description: Título obtenido exitosamente
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
 *                   $ref: '#/components/schemas/Title'
 */
router.get('/:titleId', controller.findById.bind(controller));

/**
 * @openapi
 * /titles/{titleId}:
 *   patch:
 *     tags: [Títulos]
 *     summary: Actualizar un título
 *     description: Actualiza los datos de un título existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: titleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del título
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTitleInput'
 *     responses:
 *       '200':
 *         description: Título actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Title'
 */
router.patch('/:titleId', clearCacheMiddleware(`${settings.basePath}/titles`), controller.update.bind(controller));

/**
 * @openapi
 * /titles/soft/{titleId}:
 *   patch:
 *     tags: [Títulos]
 *     summary: Eliminar un título (soft delete)
 *     description: Marca un título como eliminado sin borrarlo de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: titleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del título
 *     responses:
 *       '200':
 *         description: Título eliminado exitosamente
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
 *                   $ref: '#/components/schemas/Title'
 */
router.patch('/soft/:titleId', clearCacheMiddleware(`${settings.basePath}/titles`), controller.delete.bind(controller));

export const titleRouter = router;