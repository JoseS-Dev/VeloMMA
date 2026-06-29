import {Router} from "express";
import {MetricController} from "./metric.controller.js";
import { MetricService } from "./metric.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";

// Rutas para las metricas de las luchas
const router: Router = Router();
const controller = new MetricController(new MetricService(prisma));

// Ruta para crear una métrica
router.post('/', controller.create.bind(controller));
// Ruta para obtener todas las métricas de una pelea
router.get('/bout/:BoutId', controller.findAll.bind(controller));
// Ruta para obtener las métricas de un luchador en un round en especifico de una pelea
router.get('/bout/:BoutId/fighter/:fighterId/round/:round', controller.findAllByFighter.bind(controller));
// Ruta para obtener una métrica por su ID
router.get('/:MetricId', controller.findById.bind(controller));
// Ruta para actualizar una métrica por su ID
router.patch('/:MetricId', controller.update.bind(controller));
// Ruta para eliminar una métrica por su ID
router.patch('/soft/:MetricId', controller.delete.bind(controller));

export const metricRoutes = router;
