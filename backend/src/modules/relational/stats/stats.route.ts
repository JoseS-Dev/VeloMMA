import {Router} from "express";
import { StatsController } from "./stats.controller.js";
import { StatsService } from "./stats.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";

// Rutas relacionadas con las estadísticas de un luchador
const router: Router = Router();
const controller = new StatsController(new StatsService(prisma));

// Rutas para actualizar las estadísticas de un luchador
router.patch('/:fighterId', controller.updateFighterCareerStats.bind(controller));
// Rutas para obtener las estadísticas de un luchador
router.get('/:fighterId', controller.getFighterCareerStats.bind(controller));

export const statsRouter = router;