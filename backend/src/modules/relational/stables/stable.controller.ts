import type { Request, Response } from 'express';
import { StableService } from './stable.services.js';
import { SendResponse } from '../../../common/decorator/decorator.js';
import { validateStable, validateUpdateStable } from './stable.schema.js';

// Controlador para los equipos
export class StableController {
    constructor(private stableService: StableService) {}

    // Controlador para crear un nuevo equipo
    @SendResponse('Relación equipo con luchador creada exitosamente', 201)
    async create(req: Request, res: Response){
        const validation = validateStable(req.body);
        if(!validation.success) return res.status(400).json(validation.error);
        const stable = await this.stableService.create(validation.data);
        return stable;
    }

    // Controlador para obtener todos los equipos de un luchador
    @SendResponse('Relación equipo con luchador obtenida exitosamente', 200)
    async findAll(req: Request, res: Response){
        const {fighterId} = req.params;
        const { page, limit } = req.query;
        // Se valida el parámetro page y limit
        if(page && !Number.isInteger(Number(page))) return res.status(400).json({message: 'El parámetro page debe ser un número entero'});
        if(limit && !Number.isInteger(Number(limit))) return res.status(400).json({message: 'El parámetro limit debe ser un número entero'});
        const { stables, total } = await this.stableService.findAll(Number(fighterId), Number(page) || 1, Number(limit) || 10);
        return { 
            data: stables,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10,
            } 
        };
    }

    // Controlador para obtener un equipo de un luchador por su id
    @SendResponse('Relación equipo con luchador obtenida exitosamente', 200)
    async findById(req: Request, res: Response){
        const {stableId} = req.params;
        const stable = await this.stableService.findById(Number(stableId));
        return stable;
    }

    // Controlador para actualizar un equipo de un luchador
    @SendResponse('Relación equipo con luchador actualizada exitosamente', 200)
    async update(req: Request, res: Response){
        const {stableId} = req.params;
        const validation = validateUpdateStable(req.body);
        if(!validation.success) return res.status(400).json(validation.error);
        const stable = await this.stableService.update(Number(stableId), validation.data);
        return stable;
    }

    // Controlador para eliminar un equipo de un luchador
    @SendResponse('Relación equipo con luchador eliminada exitosamente', 200)
    async delete(req: Request, res: Response){
        const {stableId} = req.params;
        const stable = await this.stableService.delete(Number(stableId));
        return stable;
    }

}