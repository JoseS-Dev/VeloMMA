/**
 * @openapi
 * components:
 *   schemas:
 *     WeighIn:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del pesaje
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *         weight_recorded:
 *           type: number
 *           description: Peso registrado en kg
 *         missed_weight:
 *           type: boolean
 *           description: Indica si el luchador no dio el peso
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateWeighInInput:
 *       type: object
 *       required:
 *         - bout_id
 *         - fighter_id
 *         - weight_recorded
 *       properties:
 *         bout_id:
 *           type: integer
 *         fighter_id:
 *           type: integer
 *         weight_recorded:
 *           type: number
 *         missed_weight:
 *           type: boolean
 *     UpdateWeighInInput:
 *       type: object
 *       properties:
 *         weight_recorded:
 *           type: number
 *         missed_weight:
 *           type: boolean
 */

import {Router} from 'express';
import { WeighInsController } from './weighIns.controller.js';
import { WeighInsService } from './weighIns.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';
import { settings } from '../../../../config/settings.js';
import { clearCacheMiddleware } from '../../../middlewares/cache/clear-cache.middleware.js';
import { clear } from 'node:console';

const router: Router = Router();
const controller = new WeighInsController(new WeighInsService(prisma));

/**
 * @openapi
 * /weighIns:
 *   post:
 *     tags: [Pesajes]
 *     summary: Crear un nuevo pesaje oficial
 *     description: Registra el pesaje oficial de un luchador para una pelea
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWeighInInput'
 *     responses:
 *       '201':
 *         description: Pesaje creado exitosamente
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
 *                   $ref: '#/components/schemas/WeighIn'
 */
router.post('/',clearCacheMiddleware(`${settings.basePath}/weighIns`), controller.create.bind(controller));

/**
 * @openapi
 * /weighIns:
 *   get:
 *     tags: [Pesajes]
 *     summary: Obtener todos los pesajes
 *     description: Retorna una lista de todos los pesajes registrados
 *     responses:
 *       '200':
 *         description: Lista de pesajes obtenida exitosamente
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
 *                     $ref: '#/components/schemas/WeighIn'
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @openapi
 * /weighIns/bout/{boutId}:
 *   get:
 *     tags: [Pesajes]
 *     summary: Obtener pesajes por pelea
 *     description: Retorna todos los pesajes de una pelea específica
 *     parameters:
 *       - in: path
 *         name: boutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pelea
 *     responses:
 *       '200':
 *         description: Pesajes de la pelea obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/WeighIn'
 */
router.get('/bout/:boutId', controller.findByBoutId.bind(controller));

/**
 * @openapi
 * /weighIns/{id}:
 *   get:
 *     tags: [Pesajes]
 *     summary: Obtener un pesaje por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pesaje
 *     responses:
 *       '200':
 *         description: Pesaje obtenido exitosamente
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
 *                   $ref: '#/components/schemas/WeighIn'
 */
router.get('/:id', controller.findById.bind(controller));

/**
 * @openapi
 * /weighIns/{id}:
 *   patch:
 *     tags: [Pesajes]
 *     summary: Actualizar un pesaje
 *     description: Actualiza los datos de un pesaje existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pesaje
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWeighInInput'
 *     responses:
 *       '200':
 *         description: Pesaje actualizado exitosamente
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
 *                   $ref: '#/components/schemas/WeighIn'
 */
router.patch('/:id',clearCacheMiddleware(`${settings.basePath}/weighIns/:id`), controller.update.bind(controller));

/**
 * @openapi
 * /weighIns/soft/{id}:
 *   patch:
 *     tags: [Pesajes]
 *     summary: Eliminar un pesaje (soft delete)
 *     description: Marca un pesaje como eliminado sin borrarlo de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pesaje
 *     responses:
 *       '200':
 *         description: Pesaje eliminado exitosamente
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
 *                   $ref: '#/components/schemas/WeighIn'
 */
router.patch('/soft/:id',clearCacheMiddleware(`${settings.basePath}/weighIns/soft/:id`), controller.delete.bind(controller));

export const weighInsRoutes = router;