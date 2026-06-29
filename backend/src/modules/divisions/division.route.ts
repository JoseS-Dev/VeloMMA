import {Router} from 'express';
import { DivisionController } from './division.controller.js';
import { DivisionService } from './division.services.js';
import { prisma } from '../../utils/prisma/prisma.js';

const router: Router = Router();
const controller = new DivisionController(new DivisionService(prisma));

// Ruta para crear una nueva division
router.post('/', controller.create.bind(controller));
// Ruta para obtener todas las divisiones
router.get('/', controller.findAll.bind(controller));
// Ruta para obtener todas las divisiones activas
router.get('/active', controller.findAllActive.bind(controller));
// Ruta para obtener una division por su id
router.get('/:divisionId', controller.findById.bind(controller));
// Ruta para actualizar las divisiones
router.patch('/:divisionId', controller.update.bind(controller));
// Ruta para cambiar el estado de una division
router.patch('/:divisionId/status', controller.changeStatus.bind(controller));
// Ruta para eliminar una division
router.delete('/:divisionId', controller.delete.bind(controller));

export const divisionRoutes = router;