import {Router} from 'express';
import { WeighInsController } from './weighIns.controller.js';
import { WeighInsService } from './weighIns.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

const router: Router = Router();
const controller = new WeighInsController(new WeighInsService(prisma));

// Ruta para crear un pesaje oficial de un luchador para una pelea
router.post('/', controller.create.bind(controller));
// Ruta para obtener todos los pesajes oficiales
router.get('/', controller.findAll.bind(controller));
// Ruta para obtener todos los pesajes oficiales de una pelea
router.get('/bout/:boutId', controller.findByBoutId.bind(controller));
// Ruta para obtener el pesaje oficial de un luchador por su id
router.get('/:id', controller.findById.bind(controller));
// Ruta para actualizar un pesaje oficial de una pelea
router.patch('/:id', controller.update.bind(controller));
// Ruta para eliminar un pesaje oficial de una pelea
router.delete('/:id', controller.delete.bind(controller));

export const weighInsRoutes = router;
