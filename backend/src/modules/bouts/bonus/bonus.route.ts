import {Router} from "express";
import {BonusController} from "./bonus.controller.js";
import { BonusService } from "./bonus.services.js";
import { prisma } from "../../../utils/prisma/prisma.js";

// Rutas para los bonos de las peleas
const router: Router = Router();
const controller = new BonusController(new BonusService(prisma));

// Ruta para crear un bono de una pelea
router.post('/', controller.create.bind(controller));
// Ruta para obtener todos los bonos recibidos
router.get('/', controller.findAll.bind(controller));
// Ruta para obtener todos los bonos recibidos por un luchador
router.get('/fighter/:fighterId', controller.findAllByFighter.bind(controller));
// Ruta para obtener un bono por su ID
router.get('/:bonusId', controller.findById.bind(controller));
// Ruta para actualizar un bono por su ID
router.patch('/:bonusId', controller.update.bind(controller));
// Ruta para eliminar un bono por su ID
router.delete('/:bonusId', controller.delete.bind(controller));

export const bonusRoutes = router;