import { Router } from "express";
import { RankingController } from "./rank.controller.js";
import { RankingService } from "./rank.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";

// Rutas para las clasificaciones de los luchadores
const router: Router = Router();
const controller = new RankingController(new RankingService(prisma));

// Ruta para crear una clasificación de un luchador
router.post('/', controller.create.bind(controller));
// Ruta para obtener todas las clasificaciones
router.get('/', controller.findAll.bind(controller));
// Ruta para obtener todas las clasificaciones de una división
router.get('/division/:DivisionId', controller.findAllByDivision.bind(controller));
// Ruta para obtener una clasificación por su ID
router.get('/:RankingId', controller.findById.bind(controller));
// Ruta para actualizar una clasificación por su ID
router.patch('/:RankingId', controller.update.bind(controller));
// Ruta para eliminar una clasificación por su ID
router.delete('/:RankingId', controller.delete.bind(controller));

export const rankingRoutes = router;