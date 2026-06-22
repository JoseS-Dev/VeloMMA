import {Router} from 'express';
import { FighterController } from './fighter.controller.js';
import { FighterService } from './fighter.services.js';
import { prisma } from '../../utils/prisma/prisma.js';

// Ruta para los luchadores
const router: Router = Router();
const controller = new FighterController(new FighterService(prisma));

// Ruta para crear un luchador
router.post('/', controller.create.bind(controller));
// Ruta para obtener todos los luchadores
router.get('/', controller.findAll.bind(controller));
// Ruta para obtener un luchador por su id
router.get('/:id', controller.findById.bind(controller));
// Ruta para obtener un luchador por su slug
router.get('/:slug', controller.findBySlug.bind(controller));
// Ruta para actualizar un luchador
router.patch('/:id', controller.update.bind(controller));
// Ruta para cambiar el estado de un luchador
router.patch('/:id/status', controller.changeStatus.bind(controller));
// Ruta para eliminar un luchador
router.delete('/:id', controller.delete.bind(controller));

export const fighterRoutes = router;