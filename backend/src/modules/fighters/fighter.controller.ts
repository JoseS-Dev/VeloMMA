import type { Request, Response } from 'express';
import { FighterService } from './fighter.services.js';
import { validateFighter, validateFighterUpdate } from './fighter.schema.js';
import { SendResponse } from '../../common/decorator/decorator.js';

// Clase para el controlador de los luchadores
export class FighterController {
    constructor(private fighterService: FighterService) {}

    // Controlador para crear un luchador
    @SendResponse('Luchador creado correctamente', 201)
    async create(req: Request, res: Response) {
        const validation = validateFighter(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const fighter = await this.fighterService.create(validation.data);
        return fighter;
    }

    // Controlador para obtener todos los luchadores
    @SendResponse('Luchadores obtenidos correctamente', 200)
    async findAll(req: Request, res: Response) {
        const { page, limit } = req.query;
        // Se valida el parámetro page y limit
        if(page && !Number.isInteger(Number(page))) return res.status(400).json({message: 'El parámetro page debe ser un número entero'});
        if(limit && !Number.isInteger(Number(limit))) return res.status(400).json({message: 'El parámetro limit debe ser un número entero'});
        const { fighters, total } = await this.fighterService.findAll(Number(page) || 1, Number(limit) || 10);
        return { 
            data: fighters,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10,
            } 
        };
    }

    // Controlador para obtener todos los luchadores activos
    @SendResponse('Luchadores obtenidos correctamente', 200)
    async findAllActive(req: Request, res: Response) {
        const { page, limit } = req.query;
        // Se valida el parámetro page y limit
        if(page && !Number.isInteger(Number(page))) return res.status(400).json({message: 'El parámetro page debe ser un número entero'});
        if(limit && !Number.isInteger(Number(limit))) return res.status(400).json({message: 'El parámetro limit debe ser un número entero'});
        const { fighters, total } = await this.fighterService.findAllActive(Number(page) || 1, Number(limit) || 10);
        return { 
            data: fighters,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10,
            } 
        };
    }

    // Controlador para obtener un luchador por su slug
    @SendResponse('Luchador obtenido correctamente', 200)
    async findBySlug(req: Request, res: Response) {
        const {slug} = req.params;
        const fighter = await this.fighterService.findBySlug(String(slug));
        return fighter;
    }

    // Controlador para obtener un luchador por su id
    @SendResponse('Luchador obtenido correctamente', 200)
    async findById(req: Request, res: Response) {
        const {fighterId} = req.params;
        const fighter = await this.fighterService.findById(Number(fighterId));
        return fighter;
    }

    // Controlador para actualizar un luchador
    @SendResponse('Luchador actualizado correctamente', 200)
    async update(req: Request, res: Response) {
        const {fighterId} = req.params;
        const validation = validateFighterUpdate(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const fighter = await this.fighterService.update(Number(fighterId), validation.data);
        return fighter;
    }

    // Controlador para cambiar el estado de un luchador
    @SendResponse('Luchador actualizado correctamente', 200)
    async changeStatus(req: Request, res: Response) {
        const {fighterId} = req.params;
        const {status} = req.body;
        if(status && !Boolean(status)) return res.status(400).json({message: 'El estado es obligatorio'});
        const fighter = await this.fighterService.changeStatus(Number(fighterId), status);
        return fighter;
    }

    // Controlador para eliminar un luchador
    @SendResponse('Luchador eliminado correctamente', 200)
    async delete(req: Request, res: Response) {
        const {fighterId} = req.params;
        const fighter = await this.fighterService.delete(Number(fighterId));
        return fighter;
    }
}