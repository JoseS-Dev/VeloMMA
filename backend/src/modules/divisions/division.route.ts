/**
 * @openapi
 * components:
 *   schemas:
 *     Division:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la división
 *         name_division:
 *           type: string
 *           description: Nombre de la división
 *         weight_class:
 *           type: string
 *           description: Clase de peso
 *         gender:
 *           type: string
 *           enum: [Masculino, Femenino, Otro]
 *           description: Género de la división
 *         is_active:
 *           type: boolean
 *           description: Indica si la división está activa
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateDivisionInput:
 *       type: object
 *       required:
 *         - name_division
 *         - weight_class
 *         - gender
 *       properties:
 *         name_division:
 *           type: string
 *         weight_class:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [Masculino, Femenino, Otro]
 *     UpdateDivisionInput:
 *       type: object
 *       properties:
 *         name_division:
 *           type: string
 *         weight_class:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [Masculino, Femenino, Otro]
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
import { DivisionController } from './division.controller.js';
import { DivisionService } from './division.services.js';
import { prisma } from '../../utils/prisma/prisma.js';
import { settings } from '../../../config/settings.js';
import { clearCacheMiddleware } from '../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new DivisionController(new DivisionService(prisma));

/**
 * @openapi
 * /divisions:
 *   post:
 *     tags: [Divisiones]
 *     summary: Crear una nueva división
 *     description: Crea una nueva división de peso en el sistema
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDivisionInput'
 *     responses:
 *       '201':
 *         description: División creada exitosamente
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
 *                   $ref: '#/components/schemas/Division'
 */
router.post('/', clearCacheMiddleware(`${settings.basePath}/divisions`), controller.create.bind(controller));

/**
 * @openapi
 * /divisions:
 *   get:
 *     tags: [Divisiones]
 *     summary: Obtener todas las divisiones
 *     description: Retorna una lista de todas las divisiones de peso registradas
 *     responses:
 *       '200':
 *         description: Lista de divisiones obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Division'
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @openapi
 * /divisions/active:
 *   get:
 *     tags: [Divisiones]
 *     summary: Obtener todas las divisiones activas
 *     description: Retorna una lista de divisiones con is_active = true
 *     responses:
 *       '200':
 *         description: Lista de divisiones activas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Division'
 */
router.get('/active', controller.findAllActive.bind(controller));

/**
 * @openapi
 * /divisions/{divisionId}:
 *   get:
 *     tags: [Divisiones]
 *     summary: Obtener una división por ID
 *     parameters:
 *       - in: path
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la división
 *     responses:
 *       '200':
 *         description: División obtenida exitosamente
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
 *                   $ref: '#/components/schemas/Division'
 */
router.get('/:divisionId', controller.findById.bind(controller));

/**
 * @openapi
 * /divisions/{divisionId}:
 *   patch:
 *     tags: [Divisiones]
 *     summary: Actualizar una división
 *     description: Actualiza los datos de una división existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la división
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDivisionInput'
 *     responses:
 *       '200':
 *         description: División actualizada exitosamente
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
 *                   $ref: '#/components/schemas/Division'
 */
router.patch('/:divisionId', clearCacheMiddleware(`${settings.basePath}/divisions/:divisionId`), controller.update.bind(controller));

/**
 * @openapi
 * /divisions/{divisionId}/status:
 *   patch:
 *     tags: [Divisiones]
 *     summary: Cambiar el estado de una división
 *     description: Activa o desactiva una división
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la división
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeStatusInput'
 *     responses:
 *       '200':
 *         description: Estado de la división actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Division'
 */
router.patch('/:divisionId/status', clearCacheMiddleware(`${settings.basePath}/divisions/:divisionId/status`), controller.changeStatus.bind(controller));

/**
 * @openapi
 * /divisions/soft/{divisionId}:
 *   patch:
 *     tags: [Divisiones]
 *     summary: Eliminar una división (soft delete)
 *     description: Marca una división como eliminada sin borrarla de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la división
 *     responses:
 *       '200':
 *         description: División eliminada exitosamente
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
 *                   $ref: '#/components/schemas/Division'
 */
router.patch('/soft/:divisionId', clearCacheMiddleware(`${settings.basePath}/divisions/soft/:divisionId`), controller.delete.bind(controller));

export const divisionRoutes = router;