/**
 * @openapi
 * components:
 *   schemas:
 *     Judge:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del juez
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *         judge_name:
 *           type: string
 *           description: Nombre del juez
 *         red_score:
 *           type: integer
 *           description: Puntaje del luchador en esquina roja
 *         blue_score:
 *           type: integer
 *           description: Puntaje del luchador en esquina azul
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateJudgeInput:
 *       type: object
 *       required:
 *         - bout_id
 *         - judge_name
 *         - red_score
 *         - blue_score
 *       properties:
 *         bout_id:
 *           type: integer
 *         judge_name:
 *           type: string
 *         red_score:
 *           type: integer
 *         blue_score:
 *           type: integer
 *     UpdateJudgeInput:
 *       type: object
 *       properties:
 *         judge_name:
 *           type: string
 *         red_score:
 *           type: integer
 *         blue_score:
 *           type: integer
 */

import {Router} from 'express';
import { JudgeController } from './judge.controller.js';
import { JudgeService } from './judge.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';
import { settings } from '../../../../config/settings.js';
import { clearCacheMiddleware } from '../../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new JudgeController(new JudgeService(prisma));

/**
 * @openapi
 * /judges:
 *   post:
 *     tags: [Jueces]
 *     summary: Asignar un juez a una pelea
 *     description: Registra la puntuación de un juez para una pelea
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJudgeInput'
 *     responses:
 *       '201':
 *         description: Juez asignado exitosamente
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
 *                   $ref: '#/components/schemas/Judge'
 */
router.post('/',clearCacheMiddleware(`${settings.basePath}/judges`), controller.create.bind(controller));

/**
 * @openapi
 * /judges/bout/{boutId}:
 *   get:
 *     tags: [Jueces]
 *     summary: Obtener todos los jueces de una pelea
 *     parameters:
 *       - in: path
 *         name: boutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pelea
 *     responses:
 *       '200':
 *         description: Lista de jueces de la pelea obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Judge'
 */
router.get('/bout/:boutId', controller.findAll.bind(controller));

/**
 * @openapi
 * /judges/{id}:
 *   get:
 *     tags: [Jueces]
 *     summary: Obtener un juez por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juez
 *     responses:
 *       '200':
 *         description: Juez obtenido exitosamente
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
 *                   $ref: '#/components/schemas/Judge'
 */
router.get('/:id', controller.findById.bind(controller));

/**
 * @openapi
 * /judges/{id}:
 *   patch:
 *     tags: [Jueces]
 *     summary: Actualizar un juez
 *     description: Actualiza los datos de puntuación de un juez
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juez
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateJudgeInput'
 *     responses:
 *       '200':
 *         description: Juez actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Judge'
 */
router.patch('/:id', clearCacheMiddleware(`${settings.basePath}/judges/:id`), controller.update.bind(controller));

/**
 * @openapi
 * /judges/{id}:
 *   delete:
 *     tags: [Jueces]
 *     summary: Eliminar un juez
 *     description: Elimina un registro de juez de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del juez
 *     responses:
 *       '200':
 *         description: Juez eliminado exitosamente
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
 *                   $ref: '#/components/schemas/Judge'
 */
router.delete('/soft/:id', clearCacheMiddleware(`${settings.basePath}/judges/soft/:id`), controller.delete.bind(controller));

export const judgeRoutes = router;