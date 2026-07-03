import { Router } from 'express';
import { OddsController } from './odds.controller.js';
import { OddsService } from './odds.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

// Rutas relacionadas con las casas de las apuestas
const router: Router = Router();
const controller = new OddsController(new OddsService(prisma));

// Rutas para crear una casa de apuesta para una pelea
router.post('/', controller.create.bind(controller));
// Rutas para obtener todas las casas de apuestas para una pelea
router.get('/bout/:boutId', controller.findAll.bind(controller));
// Rutas para obtener todas las casas de apuestas de un proveedor en común
router.get('/provider/:provider', controller.findAllByProvider.bind(controller));
// Rutas para obtener una casa de apuesta por su ID
router.get('/:oddsId', controller.findOne.bind(controller));
// Ruta para actualizar una casa de apuesta por su ID
router.patch('/:oddsId', controller.update.bind(controller));
// Ruta para eliminar una casa de apuesta por su ID
router.patch('/soft/:oddsId', controller.delete.bind(controller));

export const oddsRouter = router;