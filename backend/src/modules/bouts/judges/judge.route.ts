import {Router} from 'express';
import { JudgeController } from './judge.controller.js';
import { JudgeService } from './judge.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

// Rutas para los jueces de una pelea
const router: Router = Router();
const controller = new JudgeController(new JudgeService(prisma));

// Ruta para crear un juez a una pelea
router.post('/', controller.create.bind(controller));
// Ruta para obtener todos los jueces de una pelea
router.get('/bout/:boutId', controller.findAll.bind(controller));
// Ruta para obtener un juez por su id
router.get('/:id', controller.findById.bind(controller));
// Ruta para actualizar un juez por su id
router.patch('/:id', controller.update.bind(controller));
// Ruta para eliminar un juez por su id
router.delete('/:id', controller.delete.bind(controller));

export const judgeRoutes = router;
