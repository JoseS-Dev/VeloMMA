/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del evento
 *         name_event:
 *           type: string
 *           description: Nombre del evento
 *         date_event:
 *           type: string
 *           format: date-time
 *           description: Fecha del evento
 *         location_event:
 *           type: string
 *           description: Ubicación del evento
 *         venue_event:
 *           type: string
 *           nullable: true
 *           description: Recinto del evento
 *         octagon_size:
 *           type: number
 *           nullable: true
 *           description: Tamaño del octágono en pies
 *         is_active:
 *           type: boolean
 *           description: Indica si el evento está activo
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateEventInput:
 *       type: object
 *       required:
 *         - name_event
 *         - date_event
 *         - location_event
 *       properties:
 *         name_event:
 *           type: string
 *         date_event:
 *           type: string
 *           format: date-time
 *         location_event:
 *           type: string
 *         venue_event:
 *           type: string
 *         octagon_size:
 *           type: number
 *     UpdateEventInput:
 *       type: object
 *       properties:
 *         name_event:
 *           type: string
 *         date_event:
 *           type: string
 *           format: date-time
 *         location_event:
 *           type: string
 *         venue_event:
 *           type: string
 *         octagon_size:
 *           type: number
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
import { EventController } from './event.controller.js';
import { EventService } from './event.services.js';
import { prisma } from '../../utils/prisma/prisma.js';

const router: Router = Router();
const controller = new EventController(new EventService(prisma));

/**
 * @openapi
 * /events:
 *   post:
 *     tags: [Eventos]
 *     summary: Crear un nuevo evento
 *     description: Crea un nuevo evento en el sistema
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventInput'
 *     responses:
 *       '201':
 *         description: Evento creado exitosamente
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
 *                   $ref: '#/components/schemas/Event'
 */
router.post('/', controller.create.bind(controller));

/**
 * @openapi
 * /events:
 *   get:
 *     tags: [Eventos]
 *     summary: Obtener todos los eventos
 *     description: Retorna una lista de todos los eventos registrados
 *     responses:
 *       '200':
 *         description: Lista de eventos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Event'
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @openapi
 * /events/active:
 *   get:
 *     tags: [Eventos]
 *     summary: Obtener todos los eventos activos
 *     description: Retorna una lista de eventos con is_active = true
 *     responses:
 *       '200':
 *         description: Lista de eventos activos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Event'
 */
router.get('/active', controller.findAllActive.bind(controller));

/**
 * @openapi
 * /events/location/{location}:
 *   get:
 *     tags: [Eventos]
 *     summary: Obtener eventos por ubicación
 *     description: Retorna una lista de eventos filtrados por ubicación
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: Ubicación del evento
 *     responses:
 *       '200':
 *         description: Lista de eventos por ubicación obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Event'
 */
router.get('/location/:location', controller.findByLocation.bind(controller));

/**
 * @openapi
 * /events/{eventId}:
 *   get:
 *     tags: [Eventos]
 *     summary: Obtener un evento por ID
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       '200':
 *         description: Evento obtenido exitosamente
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
 *                   $ref: '#/components/schemas/Event'
 */
router.get('/:eventId', controller.findById.bind(controller));

/**
 * @openapi
 * /events/{eventId}:
 *   patch:
 *     tags: [Eventos]
 *     summary: Actualizar un evento
 *     description: Actualiza los datos de un evento existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventInput'
 *     responses:
 *       '200':
 *         description: Evento actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Event'
 */
router.patch('/:eventId', controller.update.bind(controller));

/**
 * @openapi
 * /events/{eventId}/status:
 *   patch:
 *     tags: [Eventos]
 *     summary: Cambiar el estado de un evento
 *     description: Activa o desactiva un evento
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeStatusInput'
 *     responses:
 *       '200':
 *         description: Estado del evento actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Event'
 */
router.patch('/:eventId/status', controller.changeStatus.bind(controller));

/**
 * @openapi
 * /events/soft/{eventId}:
 *   patch:
 *     tags: [Eventos]
 *     summary: Eliminar un evento (soft delete)
 *     description: Marca un evento como eliminado sin borrarlo de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       '200':
 *         description: Evento eliminado exitosamente
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
 *                   $ref: '#/components/schemas/Event'
 */
router.patch('/soft/:eventId', controller.delete.bind(controller));

export const eventRoutes = router;