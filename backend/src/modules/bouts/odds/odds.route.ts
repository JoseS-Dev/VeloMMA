/**
 * @openapi
 * components:
 *   schemas:
 *     Odds:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la casa de apuestas
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *         red_opening_odds:
 *           type: number
 *           description: Cuota de apertura para el luchador de esquina roja
 *         blue_opening_odds:
 *           type: number
 *           description: Cuota de apertura para el luchador de esquina azul
 *         red_closing_odds:
 *           type: number
 *           description: Cuota de cierre para el luchador de esquina roja
 *         blue_closing_odds:
 *           type: number
 *           description: Cuota de cierre para el luchador de esquina azul
 *         provider:
 *           type: string
 *           description: Proveedor de la casa de apuestas
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
 *     CreateOddsInput:
 *       type: object
 *       required:
 *         - bout_id
 *         - red_opening_odds
 *         - blue_opening_odds
 *         - provider
 *       properties:
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *         red_opening_odds:
 *           type: number
 *           description: Cuota de apertura para el luchador de esquina roja
 *         blue_opening_odds:
 *           type: number
 *           description: Cuota de apertura para el luchador de esquina azul
 *         red_closing_odds:
 *           type: number
 *           description: Cuota de cierre para el luchador de esquina roja
 *         blue_closing_odds:
 *           type: number
 *           description: Cuota de cierre para el luchador de esquina azul
 *         provider:
 *           type: string
 *           description: Proveedor de la casa de apuestas
 *     UpdateOddsInput:
 *       type: object
 *       properties:
 *         red_opening_odds:
 *           type: number
 *           description: Cuota de apertura para el luchador de esquina roja
 *         blue_opening_odds:
 *           type: number
 *           description: Cuota de apertura para el luchador de esquina azul
 *         red_closing_odds:
 *           type: number
 *           description: Cuota de cierre para el luchador de esquina roja
 *         blue_closing_odds:
 *           type: number
 *           description: Cuota de cierre para el luchador de esquina azul
 *         provider:
 *           type: string
 *           description: Proveedor de la casa de apuestas
 */

import { Router } from 'express';
import { OddsController } from './odds.controller.js';
import { OddsService } from './odds.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

const router: Router = Router();
const controller = new OddsController(new OddsService(prisma));

/**
 * @openapi
 * /odds:
 *   post:
 *     tags: [Apuestas]
 *     summary: Crear una nueva casa de apuestas
 *     description: Registra las cuotas de una casa de apuestas para una pelea
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOddsInput'
 *     responses:
 *       '201':
 *         description: Casa de apuestas creada exitosamente
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
 *                   $ref: '#/components/schemas/Odds'
 */
router.post('/', controller.create.bind(controller));

/**
 * @openapi
 * /odds/bout/{boutId}:
 *   get:
 *     tags: [Apuestas]
 *     summary: Obtener todas las casas de apuestas de una pelea
 *     description: Retorna todas las casas de apuestas registradas para una pelea específica
 *     parameters:
 *       - in: path
 *         name: boutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pelea
 *     responses:
 *       '200':
 *         description: Lista de casas de apuestas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Odds'
 */
router.get('/bout/:boutId', controller.findAll.bind(controller));

/**
 * @openapi
 * /odds/provider/{provider}:
 *   get:
 *     tags: [Apuestas]
 *     summary: Obtener casas de apuestas por proveedor
 *     description: Retorna todas las casas de apuestas de un proveedor específico
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del proveedor
 *     responses:
 *       '200':
 *         description: Lista de casas de apuestas del proveedor obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Odds'
 */
router.get('/provider/:provider', controller.findAllByProvider.bind(controller));

/**
 * @openapi
 * /odds/{oddsId}:
 *   get:
 *     tags: [Apuestas]
 *     summary: Obtener una casa de apuestas por ID
 *     parameters:
 *       - in: path
 *         name: oddsId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la casa de apuestas
 *     responses:
 *       '200':
 *         description: Casa de apuestas obtenida exitosamente
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
 *                   $ref: '#/components/schemas/Odds'
 */
router.get('/:oddsId', controller.findOne.bind(controller));

/**
 * @openapi
 * /odds/{oddsId}:
 *   patch:
 *     tags: [Apuestas]
 *     summary: Actualizar una casa de apuestas
 *     description: Actualiza los datos de una casa de apuestas existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: oddsId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la casa de apuestas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOddsInput'
 *     responses:
 *       '200':
 *         description: Casa de apuestas actualizada exitosamente
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
 *                   $ref: '#/components/schemas/Odds'
 */
router.patch('/:oddsId', controller.update.bind(controller));

/**
 * @openapi
 * /odds/soft/{oddsId}:
 *   patch:
 *     tags: [Apuestas]
 *     summary: Eliminar una casa de apuestas (soft delete)
 *     description: Marca una casa de apuestas como eliminada sin borrarla de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: oddsId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la casa de apuestas
 *     responses:
 *       '200':
 *         description: Casa de apuestas eliminada exitosamente
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
 *                   $ref: '#/components/schemas/Odds'
 */
router.patch('/soft/:oddsId', controller.delete.bind(controller));

export const oddsRouter = router;
