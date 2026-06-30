/**
 * @openapi
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del equipo
 *         name_team:
 *           type: string
 *           description: Nombre del equipo
 *         description_team:
 *           type: string
 *           nullable: true
 *           description: Descripción del equipo
 *         date_founded:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Fecha de fundación
 *         location:
 *           type: string
 *           description: Ubicación del equipo
 *         is_active:
 *           type: boolean
 *           description: Indica si el equipo está activo
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateTeamInput:
 *       type: object
 *       required:
 *         - name_team
 *         - location
 *       properties:
 *         name_team:
 *           type: string
 *         description_team:
 *           type: string
 *         date_founded:
 *           type: string
 *           format: date
 *         location:
 *           type: string
 *     UpdateTeamInput:
 *       type: object
 *       properties:
 *         name_team:
 *           type: string
 *         description_team:
 *           type: string
 *         date_founded:
 *           type: string
 *           format: date
 *         location:
 *           type: string
 *         is_active:
 *           type: boolean
 *     ChangeStatusInput:
 *       type: object
 *       required:
 *         - is_active
 *       properties:
 *         is_active:
 *           type: boolean
 *           description: Nuevo estado del registro
 */

import {Router} from 'express';
import { TeamController } from './team.controller.js';
import { TeamService } from './team.services.js';
import { prisma } from '../../utils/prisma/prisma.js';

const router: Router = Router();
const controller = new TeamController(new TeamService(prisma));

/**
 * @openapi
 * /teams:
 *   post:
 *     tags: [Equipos]
 *     summary: Crear un nuevo equipo
 *     description: Crea un nuevo equipo en el sistema
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeamInput'
 *     responses:
 *       '201':
 *         description: Equipo creado exitosamente
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
 *                   $ref: '#/components/schemas/Team'
 */
router.post('/', controller.create.bind(controller));

/**
 * @openapi
 * /teams:
 *   get:
 *     tags: [Equipos]
 *     summary: Obtener todos los equipos
 *     description: Retorna una lista de todos los equipos registrados
 *     responses:
 *       '200':
 *         description: Lista de equipos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Team'
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @openapi
 * /teams/active:
 *   get:
 *     tags: [Equipos]
 *     summary: Obtener todos los equipos activos
 *     description: Retorna una lista de equipos con is_active = true
 *     responses:
 *       '200':
 *         description: Lista de equipos activos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Team'
 */
router.get('/active', controller.findAllActive.bind(controller));

/**
 * @openapi
 * /teams/{teamId}:
 *   get:
 *     tags: [Equipos]
 *     summary: Obtener un equipo por ID
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo
 *     responses:
 *       '200':
 *         description: Equipo obtenido exitosamente
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
 *                   $ref: '#/components/schemas/Team'
 */
router.get('/:teamId', controller.findById.bind(controller));

/**
 * @openapi
 * /teams/{teamId}:
 *   patch:
 *     tags: [Equipos]
 *     summary: Actualizar un equipo
 *     description: Actualiza los datos de un equipo existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTeamInput'
 *     responses:
 *       '200':
 *         description: Equipo actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Team'
 */
router.patch('/:teamId', controller.update.bind(controller));

/**
 * @openapi
 * /teams/{teamId}/status:
 *   patch:
 *     tags: [Equipos]
 *     summary: Cambiar el estado de un equipo
 *     description: Activa o desactiva un equipo
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeStatusInput'
 *     responses:
 *       '200':
 *         description: Estado del equipo actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Team'
 */
router.patch('/:teamId/status', controller.changeStatus.bind(controller));

/**
 * @openapi
 * /teams/soft/{teamId}:
 *   patch:
 *     tags: [Equipos]
 *     summary: Eliminar un equipo (soft delete)
 *     description: Marca un equipo como eliminado sin borrarlo de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo
 *     responses:
 *       '200':
 *         description: Equipo eliminado exitosamente
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
 *                   $ref: '#/components/schemas/Team'
 */
router.patch('/soft/:teamId', controller.delete.bind(controller));

export const teamRoutes = router;