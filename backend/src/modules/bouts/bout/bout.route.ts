import { Router } from "express";
import { BoutController } from "./bout.controller.js";
import { BoutService } from "./bout.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";

// Rutas para de las peleas
const router: Router = Router();
const controller = new BoutController(new BoutService(prisma));

// Ruta para crear una pelea
router.post('/', controller.create.bind(controller));
// Ruta para obtener todas las peleas
router.get('/', controller.findAll.bind(controller));
// Ruta para obtener todas las peleas de un evento en común
router.get('/event/:eventId', controller.findAllByEvent.bind(controller));
// Ruta para obtener todas las peleas de una división de peso
router.get('/division/:divisionId', controller.findAllByDivision.bind(controller));
// Ruta para obtener una pelea
router.get('/:BoutId', controller.findById.bind(controller));
// Ruta para actualizar una pelea
router.patch('/:BoutId', controller.update.bind(controller));
// Ruta para cambiar el estado de una pelea
router.patch('/:BoutId/status', controller.changeStatus.bind(controller));
// Ruta para eliminar una pelea
router.patch('/soft/:BoutId', controller.delete.bind(controller));

export const boutRoutes = router;