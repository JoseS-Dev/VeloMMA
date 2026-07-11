/**
 * @openapi
 * components:
 *   schemas:
 *     Bout:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la pelea
 *           example: 1
 *         event_id:
 *           type: integer
 *           description: ID del evento
 *           example: 1
 *         division_id:
 *           type: integer
 *           description: ID de la división de peso
 *           example: 1
 *         red_corner_id:
 *           type: integer
 *           description: ID del luchador en esquina roja
 *           example: 1
 *         blue_corner_id:
 *           type: integer
 *           description: ID del luchador en esquina azul
 *           example: 2
 *         result:
 *           type: string
 *           enum: [Win_Red, Win_Blue, Draw, No_Contest]
 *           nullable: true
 *           description: Resultado de la pelea
 *           example: Win_Red
 *         method:
 *           type: string
 *           enum: [KO, TKO, Submission, Unanimous_Decision, Split_Decision, Majority_Decision, Doctor_Stoppage, Disqualification]
 *           nullable: true
 *           description: Método de victoria
 *           example: Submission
 *         rounded_ended:
 *           type: integer
 *           nullable: true
 *           description: Ronda en la que terminó la pelea
 *           example: 2
 *         time_ended:
 *           type: string
 *           nullable: true
 *           description: Tiempo en el que terminó la pelea
 *           example: 3:15
 *         referee:
 *           type: string
 *           nullable: true
 *           description: Árbitro de la pelea
 *           example: Herb Dean
 *         is_title_fight:
 *           type: boolean
 *           description: Indica si es una pelea de título
 *           example: false
 *         status_bout:
 *           type: string
 *           enum: [Programada, Cancelada, En_Proceso, Finalizada]
 *           description: Estado de la pelea
 *           example: Programada
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateBoutInput:
 *       type: object
 *       required:
 *         - event_id
 *         - division_id
 *         - red_corner_id
 *         - blue_corner_id
 *       properties:
 *         event_id:
 *           type: integer
 *           example: 1
 *         division_id:
 *           type: integer
 *           example: 1
 *         red_corner_id:
 *           type: integer
 *           example: 1
 *         blue_corner_id:
 *           type: integer
 *           example: 2
 *         result:
 *           type: string
 *           enum: [Win_Red, Win_Blue, Draw, No_Contest]
 *           example: Win_Red
 *         method:
 *           type: string
 *           enum: [KO, TKO, Submission, Unanimous_Decision, Split_Decision, Majority_Decision, Doctor_Stoppage, Disqualification]
 *           example: Submission
 *         rounded_ended:
 *           type: integer
 *           example: 2
 *         time_ended:
 *           type: string
 *           example: 3:15
 *         referee:
 *           type: string
 *           example: Herb Dean
 *         is_title_fight:
 *           type: boolean
 *           example: false
 *         status_bout:
 *           type: string
 *           enum: [Programada, Cancelada, En_Proceso, Finalizada]
 *           example: Programada
 *     UpdateBoutInput:
 *       type: object
 *       properties:
 *         result:
 *           type: string
 *           enum: [Win_Red, Win_Blue, Draw, No_Contest]
 *           example: Win_Red
 *         method:
 *           type: string
 *           enum: [KO, TKO, Submission, Unanimous_Decision, Split_Decision, Majority_Decision, Doctor_Stoppage, Disqualification]
 *           example: Submission
 *         rounded_ended:
 *           type: integer
 *           example: 2
 *         time_ended:
 *           type: string
 *           example: 3:15
 *         referee:
 *           type: string
 *           example: Herb Dean
 *         is_title_fight:
 *           type: boolean
 *           example: false
 *         status_bout:
 *           type: string
 *           enum: [Programada, Cancelada, En_Proceso, Finalizada]
 *           example: Programada
 *     ChangeBoutStatusInput:
 *       type: object
 *       required:
 *         - status_bout
 *       properties:
 *         status_bout:
 *           type: string
 *           enum: [Programada, Cancelada, En_Proceso, Finalizada]
 *           description: >
 *             Estado de la pelea. Transiciones válidas:
 *               - Programada → Cancelada, En_Proceso, Finalizada
 *               - Cancelada → Programada
 *               - En_Proceso → Finalizada, Cancelada
 *               - Finalizada → (ninguna, es terminal)
 *           example: En_Proceso
 */

import { Router } from "express";
import { BoutController } from "./bout.controller.js";
import { BoutService } from "./bout.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";
import { settings } from '../../../../config/settings.js';
import { clearCacheMiddleware } from '../../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new BoutController(new BoutService(prisma));

/**
 * @openapi
 * /bouts:
 *   post:
 *     tags: [Peleas]
 *     summary: Crear una nueva pelea
 *     description: Crea una nueva pelea en el sistema
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBoutInput'
 *     responses:
 *       '201':
 *         description: Pelea creada exitosamente
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
 *                   $ref: '#/components/schemas/Bout'
 */
router.post('/',clearCacheMiddleware(`${settings.basePath}/bouts`), controller.create.bind(controller));

/**
 * @openapi
 * /bouts:
 *   get:
 *     tags: [Peleas]
 *     summary: Obtener todas las peleas
 *     description: Retorna una lista de todas las peleas registradas
 *     responses:
 *       '200':
 *         description: Lista de peleas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Bout'
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @openapi
 * /bouts/event/{eventId}:
 *   get:
 *     tags: [Peleas]
 *     summary: Obtener peleas por evento
 *     description: Retorna todas las peleas de un evento específico
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       '200':
 *         description: Peleas del evento obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Bout'
 */
router.get('/event/:eventId', controller.findAllByEvent.bind(controller));

/**
 * @openapi
 * /bouts/division/{divisionId}:
 *   get:
 *     tags: [Peleas]
 *     summary: Obtener peleas por división de peso
 *     description: Retorna todas las peleas de una división de peso específica
 *     parameters:
 *       - in: path
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la división
 *     responses:
 *       '200':
 *         description: Peleas de la división obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Bout'
 */
router.get('/division/:divisionId', controller.findAllByDivision.bind(controller));

/**
 * @openapi
 * /bouts/{BoutId}:
 *   get:
 *     tags: [Peleas]
 *     summary: Obtener una pelea por ID
 *     parameters:
 *       - in: path
 *         name: BoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pelea
 *     responses:
 *       '200':
 *         description: Pelea obtenida exitosamente
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
 *                   $ref: '#/components/schemas/Bout'
 */
router.get('/:BoutId', controller.findById.bind(controller));

/**
 * @openapi
 * /bouts/{BoutId}:
 *   patch:
 *     tags: [Peleas]
 *     summary: Actualizar una pelea
 *     description: Actualiza los datos de una pelea existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: BoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pelea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBoutInput'
 *     responses:
 *       '200':
 *         description: Pelea actualizada exitosamente
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
 *                   $ref: '#/components/schemas/Bout'
 */
router.patch('/:BoutId', clearCacheMiddleware(`${settings.basePath}/bouts/:BoutId`), controller.update.bind(controller));

/**
 * @openapi
 * /bouts/{BoutId}/status:
 *   patch:
 *     tags: [Peleas]
 *     summary: Cambiar el estado de una pelea
 *     description: Cambia el estado de una pelea (Programada, Cancelada, En_Proceso, Finalizada)
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: BoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pelea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeBoutStatusInput'
 *     responses:
 *       '200':
 *         description: Estado de la pelea actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Bout'
 */
router.patch('/:BoutId/status',clearCacheMiddleware(`${settings.basePath}/bouts/:BoutId/status`), controller.changeStatus.bind(controller));

/**
 * @openapi
 * /bouts/soft/{BoutId}:
 *   patch:
 *     tags: [Peleas]
 *     summary: Eliminar una pelea (soft delete)
 *     description: Marca una pelea como eliminada sin borrarla de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: BoutId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la pelea
 *     responses:
 *       '200':
 *         description: Pelea eliminada exitosamente
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
 *                   $ref: '#/components/schemas/Bout'
 */
router.patch('/soft/:BoutId',clearCacheMiddleware(`${settings.basePath}/bouts/soft/:BoutId`), controller.delete.bind(controller));

export const boutRoutes = router;