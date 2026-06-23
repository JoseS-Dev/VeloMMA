import {Router} from 'express';
import { EventController } from './event.controller.js';
import { EventService } from './event.services.js';
import { prisma } from '../../utils/prisma/prisma.js';

const router: Router = Router();
const controller = new EventController(new EventService(prisma));

// Ruta para crear un nuevo evento
router.post('/', controller.create.bind(controller));
// Ruta para obtener todos los eventos
router.get('/', controller.findAll.bind(controller));
// Ruta para obtener un evento por su id
router.get('/:eventId', controller.findById.bind(controller));
// Ruta para obtener los eventos de una locación en especifico
router.get('/location/:location', controller.findByLocation.bind(controller));
// Ruta para actualizar los datos de un evento
router.patch('/:eventId', controller.update.bind(controller));
// Ruta para cambiar el estado de un evento
router.patch('/:eventId/status', controller.changeStatus.bind(controller));
// Ruta para eliminar un evento
router.delete('/:eventId', controller.delete.bind(controller));

export const eventRoutes = router;