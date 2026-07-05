/**
 * @openapi
 * components:
 *   schemas:
 *     Camp:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del campamento
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *         team_id:
 *           type: integer
 *           description: ID del equipo
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
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
 *     CreateCampInput:
 *       type: object
 *       required:
 *         - bout_id
 *         - team_id
 *         - fighter_id
 *       properties:
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *         team_id:
 *           type: integer
 *           description: ID del equipo
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *     UpdateCampInput:
 *       type: object
 *       properties:
 *         bout_id:
 *           type: integer
 *           description: ID de la pelea
 *         team_id:
 *           type: integer
 *           description: ID del equipo
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 */

import {Router} from 'express';
import { CampController } from './camp.controller.js';
import { CampService } from './camp.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

const router: Router = Router();
const controller = new CampController(new CampService(prisma));

/**
 * @openapi
 * /camps:
 *   post:
 *     tags: [Campamentos]
 *     summary: Crear un nuevo campamento
 *     description: Registra un campamento donde entrena un luchador para una pelea
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCampInput'
 *     responses:
 *       '201':
 *         description: Campamento creado exitosamente
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
 *                   $ref: '#/components/schemas/Camp'
 */
router.post('/', controller.create.bind(controller));

/**
 * @openapi
 * /camps/fighter/{fighterId}:
 *   get:
 *     tags: [Campamentos]
 *     summary: Obtener todos los campamentos de un luchador
 *     description: Retorna todos los campamentos donde ha estado un luchador
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     responses:
 *       '200':
 *         description: Lista de campamentos del luchador obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Camp'
 */
router.get('/fighter/:fighterId', controller.findAllByFighter.bind(controller));

/**
 * @openapi
 * /camps/team/{teamId}:
 *   get:
 *     tags: [Campamentos]
 *     summary: Obtener todos los campamentos de un equipo
 *     description: Retorna todos los campamentos donde ha estado un equipo
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo
 *     responses:
 *       '200':
 *         description: Lista de campamentos del equipo obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Camp'
 */
router.get('/team/:teamId', controller.findAllByTeam.bind(controller));

/**
 * @openapi
 * /camps/{campId}:
 *   get:
 *     tags: [Campamentos]
 *     summary: Obtener un campamento por ID
 *     parameters:
 *       - in: path
 *         name: campId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del campamento
 *     responses:
 *       '200':
 *         description: Campamento obtenido exitosamente
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
 *                   $ref: '#/components/schemas/Camp'
 */
router.get('/:campId', controller.findOne.bind(controller));

/**
 * @openapi
 * /camps/{campId}:
 *   patch:
 *     tags: [Campamentos]
 *     summary: Actualizar un campamento
 *     description: Actualiza los datos de un campamento existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: campId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del campamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCampInput'
 *     responses:
 *       '200':
 *         description: Campamento actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Camp'
 */
router.patch('/:campId', controller.update.bind(controller));

/**
 * @openapi
 * /camps/soft/{campId}:
 *   patch:
 *     tags: [Campamentos]
 *     summary: Eliminar un campamento (soft delete)
 *     description: Marca un campamento como eliminado sin borrarlo de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: campId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del campamento
 *     responses:
 *       '200':
 *         description: Campamento eliminado exitosamente
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
 *                   $ref: '#/components/schemas/Camp'
 */
router.patch('/soft/:campId', controller.delete.bind(controller));

export const campRouter = router;
