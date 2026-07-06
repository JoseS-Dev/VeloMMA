import type { Response, Request } from 'express';
import { InjuryService } from './injuries.services.js';
import { validateInjury, validateUpdateInjury } from './injuries.schema.js';
import { SendResponse } from '../../../common/decorator/decorator.js';
import { InjurySeverity } from '../../../../generated/prisma/index.js';

// Controlador para las lesiones o inactividades de un luchador
export class InjuryController {
    constructor(private injuryService: InjuryService) {}

    // Controlador para crear una nueva lesión o inactividad de un luchador
    @SendResponse('Lesión o inactividad creada correctamente', 201)
    async create(req: Request, res: Response) {
        const validation = validateInjury(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const injury = await this.injuryService.create(validation.data);
        return injury;
    }

    // Controlador para obtener todas las lesiones o inactividades de un luchador
    @SendResponse('Lesiones o inactividades obtenidas correctamente', 200)
    async findAll(req: Request, res: Response) {
        const {fighterId} = req.params;
        const { page, limit } = req.query;
        // Se valida el parámetro page y limit
        if(page && !Number.isInteger(Number(page))) return res.status(400).json({message: 'El parámetro page debe ser un número entero'});
        if(limit && !Number.isInteger(Number(limit))) return res.status(400).json({message: 'El parámetro limit debe ser un número entero'});
        const { injuries, total } = await this.injuryService.findAll(Number(fighterId), Number(page) || 1, Number(limit) || 10);
        return { 
            data: injuries,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10,
            } 
        };
    }

    // Controlador para obtener una lesión o inactividad de un luchador por su id
    @SendResponse('Lesión o inactividad obtenida correctamente', 200)
    async findById(req: Request, res: Response) {
        const {injuryId} = req.params;
        const injury = await this.injuryService.findById(Number(injuryId));
        return injury;
    }

    // Controlador para obtener una lesión dependiendo del grado de severidad
    @SendResponse('Lesiones o inactividades obtenidas correctamente', 200)
    async findBySeverity(req: Request, res: Response) {
        const {fighterId} = req.params;
        const {severity} = req.query;
        const injuries = await this.injuryService.findBySeverity(Number(fighterId), severity as InjurySeverity);
        return injuries;
    }

    // Controlador para actualizar las lesiones o inactividades de un luchador
    @SendResponse('Lesión o inactividad actualizada correctamente', 200)
    async update(req: Request, res: Response) {
        const {injuryId} = req.params;
        const validation = validateUpdateInjury(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const injury = await this.injuryService.update(Number(injuryId), validation.data);
        return injury;
    }

    // Controlador para cambiar el estado de una lesión o inactividad
    @SendResponse('Lesión o inactividad actualizada correctamente', 200)
    async changeStatus(req: Request, res: Response) {
        const {injuryId} = req.params;
        const {isActive} = req.body;
        if(isActive && !Boolean(isActive)) return res.status(400).json({message: 'El estado es obligatorio'});
        const injury = await this.injuryService.changeStatus(Number(injuryId), isActive);
        return injury;
    }

    // Controlador para eliminar una lesión o inactividad
    @SendResponse('Lesión o inactividad eliminada correctamente', 200)
    async delete(req: Request, res: Response) {
        const {injuryId} = req.params;
        const injury = await this.injuryService.delete(Number(injuryId));
        return injury;
    }
}