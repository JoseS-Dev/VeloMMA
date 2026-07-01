/**
 * @openapi
 * components:
 *   schemas:
 *     Weight:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del peso oficial
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *         weight_recorded:
 *           type: number
 *           description: Peso registrado en kg
 *         date_recorded:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Fecha del pesaje
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
 *     CreateWeightInput:
 *       type: object
 *       required:
 *         - fighter_id
 *         - weight_recorded
 *       properties:
 *         fighter_id:
 *           type: integer
 *         weight_recorded:
 *           type: number
 *         date_recorded:
 *           type: string
 *           format: date
 *     UpdateWeightInput:
 *       type: object
 *       properties:
 *         weight_recorded:
 *           type: number
 *         date_recorded:
 *           type: string
 *           format: date
 *         is_active:
 *           type: boolean
 */

import { Router } from 'express';
import { WeightController } from './weight.controller.js';
import { WeightService } from './weight.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';
import { settings } from '../../../../config/settings.js';
import { clearCacheMiddleware } from '../../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new WeightController(new WeightService(prisma));

/**
 * @openapi
 * /weights:
 *   post:
 *     tags: [Pesos Oficiales]
 *     summary: Crear un nuevo peso oficial
 *     description: Registra un peso oficial de un luchador
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWeightInput'
 *     responses:
 *       '201':
 *         description: Peso oficial creado exitosamente
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
 *                   $ref: '#/components/schemas/Weight'
 */
router.post('/',clearCacheMiddleware(`${settings.basePath}/weights`), controller.create.bind(controller));

/**
 * @openapi
 * /weights/fighter/{fighterId}:
 *   get:
 *     tags: [Pesos Oficiales]
 *     summary: Obtener todos los pesos de un luchador
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     responses:
 *       '200':
 *         description: Lista de pesos del luchador obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Weight'
 */
router.get('/fighter/:fighterId', controller.findAll.bind(controller));

/**
 * @openapi
 * /weights/{weightId}:
 *   get:
 *     tags: [Pesos Oficiales]
 *     summary: Obtener un peso oficial por ID
 *     parameters:
 *       - in: path
 *         name: weightId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del peso oficial
 *     responses:
 *       '200':
 *         description: Peso oficial obtenido exitosamente
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
 *                   $ref: '#/components/schemas/Weight'
 */
router.get('/:weightId', controller.findById.bind(controller));

/**
 * @openapi
 * /weights/{weightId}:
 *   patch:
 *     tags: [Pesos Oficiales]
 *     summary: Actualizar un peso oficial
 *     description: Actualiza los datos de un peso oficial existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: weightId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del peso oficial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWeightInput'
 *     responses:
 *       '200':
 *         description: Peso oficial actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Weight'
 */
router.patch('/:weightId',clearCacheMiddleware(`${settings.basePath}/weights/:weightId`), controller.update.bind(controller));

/**
 * @openapi
 * /weights/soft/{weightId}:
 *   patch:
 *     tags: [Pesos Oficiales]
 *     summary: Eliminar un peso oficial (soft delete)
 *     description: Marca un peso oficial como eliminado sin borrarlo de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: weightId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del peso oficial
 *     responses:
 *       '200':
 *         description: Peso oficial eliminado exitosamente
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
 *                   $ref: '#/components/schemas/Weight'
 */
router.patch('/soft/:weightId',clearCacheMiddleware(`${settings.basePath}/weights/soft/:weightId`), controller.delete.bind(controller));

export const weightRoutes = router;