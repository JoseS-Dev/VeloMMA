import { Router } from 'express';
import { StableController } from './stable.controller.js';
import { StableService } from './stable.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

// Ruta para los equipos
const router: Router = Router();
const controller = new StableController(new StableService(prisma));

// Ruta para crear un nuevo equipo
router.post('/', controller.create.bind(controller));
// Ruta para obtener todos los equipos de un luchador
router.get('/fighter/:fighterId', controller.findAll.bind(controller));
// Ruta para obtener un equipo de un luchador por su id
router.get('/:stableId', controller.findById.bind(controller));
// Ruta para actualizar un equipo de un luchador
router.patch('/:stableId', controller.update.bind(controller));
// Ruta para eliminar un equipo de un luchador
router.delete('/:stableId', controller.delete.bind(controller));

export const stableRoutes = router;