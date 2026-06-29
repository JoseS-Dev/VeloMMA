import {Router} from 'express';
import { InjuryController } from './injuries.controller.js';
import { InjuryService } from './injuries.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

const router: Router = Router();
const controller = new InjuryController(new InjuryService(prisma));

// Ruta para crear una nueva lesión o inactividad de un luchador
router.post('/', controller.create.bind(controller));
// Ruta para obtener todas las lesiones o inactividades de un luchador
router.get('/fighter/:fighterId', controller.findAll.bind(controller));
// Ruta para obtener una lesión o inactividad de un luchador por su id
router.get('/:injuryId', controller.findById.bind(controller));
// Ruta para obtener una lesión dependiendo del grado de severidad
router.get('/:fighterId/severity', controller.findBySeverity.bind(controller));
// Ruta para actualizar las lesiones o inactividades de un luchador
router.patch('/:injuryId', controller.update.bind(controller));
// Ruta para cambiar el estado de una lesión o inactividad
router.patch('/:injuryId/status', controller.changeStatus.bind(controller));
// Ruta para eliminar una lesión o inactividad
router.patch('/soft/:injuryId', controller.delete.bind(controller));

export const injuryRoutes = router;