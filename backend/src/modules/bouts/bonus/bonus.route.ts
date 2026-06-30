/**
 * @openapi
 * components:
 *   schemas:
 *     Bonus:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del bono
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *         bonus_type:
 *           type: string
 *           enum: [Fight_of_the_night, Performance_of_the_night, Submission_of_the_night, Knockout_of_the_night]
 *           description: Tipo de bono
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateBonusInput:
 *       type: object
 *       required:
 *         - bout_id
 *         - fighter_id
 *         - bonus_type
 *       properties:
 *         bout_id:
 *           type: integer
 *         fighter_id:
 *           type: integer
 *         bonus_type:
 *           type: string
 *           enum: [Fight_of_the_night, Performance_of_the_night, Submission_of_the_night, Knockout_of_the_night]
 *     UpdateBonusInput:
 *       type: object
 *       properties:
 *         bonus_type:
 *           type: string
 *           enum: [Fight_of_the_night, Performance_of_the_night, Submission_of_the_night, Knockout_of_the_night]
 */

import {Router} from "express";
import {BonusController} from "./bonus.controller.js";
import { BonusService } from "./bonus.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";

const router: Router = Router();
const controller = new BonusController(new BonusService(prisma));

/**
 * @openapi
 * /bonuses:
 *   post:
 *     tags: [Bonos]
 *     summary: Crear un nuevo bono
 *     description: Otorga un bono a un luchador por una pelea
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBonusInput'
 *     responses:
 *       '201':
 *         description: Bono creado exitosamente
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
 *                   $ref: '#/components/schemas/Bonus'
 */
router.post('/', controller.create.bind(controller));

/**
 * @openapi
 * /bonuses:
 *   get:
 *     tags: [Bonos]
 *     summary: Obtener todos los bonos
 *     description: Retorna una lista de todos los bonos otorgados
 *     responses:
 *       '200':
 *         description: Lista de bonos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Bonus'
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @openapi
 * /bonuses/fighter/{fighterId}:
 *   get:
 *     tags: [Bonos]
 *     summary: Obtener bonos por luchador
 *     description: Retorna todos los bonos recibidos por un luchador
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     responses:
 *       '200':
 *         description: Bonos del luchador obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Bonus'
 */
router.get('/fighter/:fighterId', controller.findAllByFighter.bind(controller));

/**
 * @openapi
 * /bonuses/{bonusId}:
 *   get:
 *     tags: [Bonos]
 *     summary: Obtener un bono por ID
 *     parameters:
 *       - in: path
 *         name: bonusId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bono
 *     responses:
 *       '200':
 *         description: Bono obtenido exitosamente
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
 *                   $ref: '#/components/schemas/Bonus'
 */
router.get('/:bonusId', controller.findById.bind(controller));

/**
 * @openapi
 * /bonuses/{bonusId}:
 *   patch:
 *     tags: [Bonos]
 *     summary: Actualizar un bono
 *     description: Actualiza el tipo de bono de un registro existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: bonusId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bono
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBonusInput'
 *     responses:
 *       '200':
 *         description: Bono actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Bonus'
 */
router.patch('/:bonusId', controller.update.bind(controller));

/**
 * @openapi
 * /bonuses/soft/{bonusId}:
 *   patch:
 *     tags: [Bonos]
 *     summary: Eliminar un bono (soft delete)
 *     description: Marca un bono como eliminado sin borrarlo de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: bonusId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bono
 *     responses:
 *       '200':
 *         description: Bono eliminado exitosamente
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
 *                   $ref: '#/components/schemas/Bonus'
 */
router.patch('/soft/:bonusId', controller.delete.bind(controller));

export const bonusRoutes = router;