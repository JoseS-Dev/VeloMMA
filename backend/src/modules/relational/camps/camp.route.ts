import {Router} from 'express';
import { CampController } from './camp.controller.js';
import { CampService } from './camp.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

// Rutas relacionadas con los campamentos donde entreno un luchador para una pelea
const router: Router = Router();
const controller = new CampController(new CampService(prisma));

// Rutas para crear un campamento donde entreno un luchador para una pelea
router.post('/', controller.create.bind(controller));
// Rutas para obtener todos los campamentos donde ha estado un luchador
router.get('/fighter/:fighterId', controller.findAllByFighter.bind(controller));
// Rutas para obtener todos los campamentos donde ha estado un equipo
router.get('/team/:teamId', controller.findAllByTeam.bind(controller));
// Rutas para obtener un campamento donde entreno un luchador para una pelea por su ID
router.get('/:campId', controller.findOne.bind(controller));
// Ruta para actualizar un campamento donde entreno un luchador para una pelea por su ID
router.patch('/:campId', controller.update.bind(controller));
// Ruta para eliminar un campamento donde entreno un luchador para una pelea por su ID
router.patch('/soft/:campId', controller.delete.bind(controller));

export const campRouter = router;