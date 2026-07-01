import {Router} from 'express';
import { FighterController } from './fighter.controller.js';
import { FighterService } from './fighter.services.js';
import { prisma } from '../../utils/prisma/prisma.js';
import { settings } from '../../../config/settings.js';
import { clearCacheMiddleware } from '../../middlewares/cache/clear-cache.middleware.js';

const router: Router = Router();
const controller = new FighterController(new FighterService(prisma));

/**
 * @openapi
 * /fighters:
 *   post:
 *     tags: [Luchadores]
 *     summary: Crear un nuevo luchador
 *     description: Crea un nuevo luchador en el sistema
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFighterInput'
 *     responses:
 *       '201':
 *         description: Luchador creado exitosamente
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
 *                   $ref: '#/components/schemas/Fighter'
 */
router.post('/', clearCacheMiddleware(`${settings.basePath}/fighters`) ,controller.create.bind(controller));

/**
 * @openapi
 * /fighters:
 *   get:
 *     tags: [Luchadores]
 *     summary: Obtener todos los luchadores
 *     description: Retorna una lista de todos los luchadores registrados
 *     responses:
 *       '200':
 *         description: Lista de luchadores obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Fighter'
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @openapi
 * /fighters/active:
 *   get:
 *     tags: [Luchadores]
 *     summary: Obtener todos los luchadores activos
 *     description: Retorna una lista de luchadores con is_active = true
 *     responses:
 *       '200':
 *         description: Lista de luchadores activos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Fighter'
 */
router.get('/active', controller.findAllActive.bind(controller));

/**
 * @openapi
 * /fighters/{fighterId}:
 *   get:
 *     tags: [Luchadores]
 *     summary: Obtener un luchador por ID
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     responses:
 *       '200':
 *         description: Luchador obtenido exitosamente
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
 *                   $ref: '#/components/schemas/Fighter'
 */
router.get('/:fighterId', controller.findById.bind(controller));

/**
 * @openapi
 * /fighters/slug/{slug}:
 *   get:
 *     tags: [Luchadores]
 *     summary: Obtener un luchador por slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug único del luchador
 *     responses:
 *       '200':
 *         description: Luchador obtenido exitosamente
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
 *                   $ref: '#/components/schemas/Fighter'
 */
router.get('/slug/:slug', controller.findBySlug.bind(controller));

/**
 * @openapi
 * /fighters/{fighterId}:
 *   patch:
 *     tags: [Luchadores]
 *     summary: Actualizar un luchador
 *     description: Actualiza los datos de un luchador existente
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFighterInput'
 *     responses:
 *       '200':
 *         description: Luchador actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Fighter'
 */
router.patch('/:fighterId', clearCacheMiddleware(`${settings.basePath}/fighters/:fighterId`) ,controller.update.bind(controller));

/**
 * @openapi
 * /fighters/{fighterId}/status:
 *   patch:
 *     tags: [Luchadores]
 *     summary: Cambiar el estado de un luchador
 *     description: Activa o desactiva un luchador
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeStatusInput'
 *     responses:
 *       '200':
 *         description: Estado del luchador actualizado exitosamente
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
 *                   $ref: '#/components/schemas/Fighter'
 */
router.patch('/:fighterId/status', clearCacheMiddleware(`${settings.basePath}/fighters/:fighterId/status`) ,controller.changeStatus.bind(controller));

/**
 * @openapi
 * /fighters/soft/{fighterId}:
 *   patch:
 *     tags: [Luchadores]
 *     summary: Eliminar un luchador (soft delete)
 *     description: Marca un luchador como eliminado sin borrarlo de la base de datos
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     responses:
 *       '200':
 *         description: Luchador eliminado exitosamente
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
 *                   $ref: '#/components/schemas/Fighter'
 */
router.patch('/soft/:fighterId', clearCacheMiddleware(`${settings.basePath}/fighters/soft/:fighterId`) ,controller.delete.bind(controller));

export const fighterRoutes = router;