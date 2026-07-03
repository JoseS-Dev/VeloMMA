import {Router} from 'express';
import { TitleController } from './title.controller.js';
import { TitleService } from './title.services.js';
import { prisma } from '../../../utils/prisma/prisma.js';

// Rutas relacionadas con los titulos de un luchador en una división
const router: Router = Router();
const controller = new TitleController(new TitleService(prisma));

// Ruta para crea un nuevo titulo de un luchador en una división
router.post('/', controller.create.bind(controller));
// Ruta para obtener todos los titulos de un luchador
router.get('/fighter/:fighterId', controller.findAllByFighter.bind(controller));
// Ruta para obtener todos los titulos de una división
router.get('/division/:divisionId', controller.findAllByDivision.bind(controller));
// Ruta para obtener todos los titulos de una división y tipo de titulo
router.get('/division/:divisionId/title-type/:titleType', controller.findAllByDivisionAndTitleType.bind(controller));
// Ruta para obtener un titulo por su id
router.get('/:titleId', controller.findById.bind(controller));
// Ruta para actualizar un titulo por su id
router.patch('/:titleId', controller.update.bind(controller));
// Ruta para eliminar un titulo por su id
router.patch('/soft/:titleId', controller.delete.bind(controller));

export const titleRouter = router;