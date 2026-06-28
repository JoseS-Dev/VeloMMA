import {Router} from 'express';
import { TeamController } from './team.controller.js';
import { TeamService } from './team.services.js';
import { prisma } from '../../utils/prisma/prisma.js';

const router: Router = Router();
const controller = new TeamController(new TeamService(prisma));

// Ruta para crear un nuevo equipo
router.post('/', controller.create.bind(controller));
// Ruta para obtener todos los equipos
router.get('/', controller.findAll.bind(controller));
// Ruta para obtener un equipo por su id
router.get('/:teamId', controller.findById.bind(controller));
// Ruta para actualizar los datos de un equipo
router.patch('/:teamId', controller.update.bind(controller));
// Ruta para cambiar el estado de un equipo
router.patch('/:teamId/status', controller.changeStatus.bind(controller));
// Ruta para eliminar un equipo
router.delete('/:teamId', controller.delete.bind(controller));

export const teamRoutes = router;
