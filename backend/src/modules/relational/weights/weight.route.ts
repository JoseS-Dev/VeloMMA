import { Router } from 'express';
import { WeightController } from './weight.controller.js';
import { WeightService } from './weight.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

// Ruta para los pesos oficiales
const router: Router = Router();
const controller = new WeightController(new WeightService(prisma));

// Ruta para crear un nuevo peso oficial
router.post('/', controller.create.bind(controller));
// Ruta para obtener todos los pesos oficiales de un luchador
router.get('/:fighterId', controller.findAll.bind(controller));
// Ruta para obtener un peso oficial de un luchador por su id
router.get('/:weightId', controller.findById.bind(controller));
// Ruta para actualizar un peso oficial de un luchador
router.patch('/:weightId', controller.update.bind(controller));
// Ruta para eliminar un peso oficial de un luchador
router.delete('/:weightId', controller.delete.bind(controller));

export const weightRoutes = router;