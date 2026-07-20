/**
 * @openapi
 * components:
 *   schemas:
 *     FighterStats:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de las estadísticas
 *           example: 1
 *         fighter_id:
 *           type: integer
 *           description: ID del luchador
 *           example: 1
 *         sig_strikes_accuracy:
 *           type: number
 *           description: Precisión de golpes significativos (porcentaje)
 *           example: 54.2
 *         sig_strikes_absorbed_pm:
 *           type: number
 *           description: Golpes significativos absorbidos por minuto
 *           example: 2.85
 *         takedown_accuracy:
 *           type: number
 *           description: Precisión de derribos (porcentaje)
 *           example: 42.1
 *         takedown_defense:
 *           type: number
 *           description: Defensa de derribos (porcentaje)
 *           example: 78.3
 *         average_fight_time:
 *           type: number
 *           description: Tiempo promedio de pelea (en minutos)
 *           example: 14.5
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
 *     UpdateFighterStatsInput:
 *       type: object
 *       properties:
 *         sig_strikes_accuracy:
 *           type: number
 *           description: Precisión de golpes significativos (porcentaje)
 *           example: 54.2
 *         sig_strikes_absorbed_pm:
 *           type: number
 *           description: Golpes significativos absorbidos por minuto
 *           example: 2.85
 *         takedown_accuracy:
 *           type: number
 *           description: Precisión de derribos (porcentaje)
 *           example: 42.1
 *         takedown_defense:
 *           type: number
 *           description: Defensa de derribos (porcentaje)
 *           example: 78.3
 *         average_fight_time:
 *           type: number
 *           description: Tiempo promedio de pelea (en minutos)
 *           example: 14.5
 */

import {Router} from "express";
import { StatsController } from "./stats.controller.js";
import { StatsService } from "./stats.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";
import { settings } from "../../../../config/settings.js";
import { clearCacheMiddleware } from "../../../middlewares/cache/clear-cache.middleware.js";

const router: Router = Router();
const controller = new StatsController(new StatsService(prisma));

/**
 * @openapi
 * /stats/{fighterId}:
 *   patch:
 *     tags: [Estadísticas]
 *     summary: Actualizar las estadísticas de un luchador
 *     description: Actualiza las estadísticas de carrera de un luchador después de un evento
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
 *             $ref: '#/components/schemas/UpdateFighterStatsInput'
 *     responses:
 *       '200':
 *         description: Estadísticas actualizadas exitosamente
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
 *                   $ref: '#/components/schemas/FighterStats'
 */
router.patch('/:fighterId', clearCacheMiddleware(`${settings.basePath}/stats`), controller.updateFighterCareerStats.bind(controller));

/**
 * @openapi
 * /stats/{fighterId}:
 *   get:
 *     tags: [Estadísticas]
 *     summary: Obtener las estadísticas de un luchador
 *     description: Retorna las estadísticas de carrera de un luchador
 *     parameters:
 *       - in: path
 *         name: fighterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del luchador
 *     responses:
 *       '200':
 *         description: Estadísticas del luchador obtenidas exitosamente
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
 *                   $ref: '#/components/schemas/FighterStats'
 */
router.get('/:fighterId', controller.getFighterCareerStats.bind(controller));

export const statsRouter = router;
