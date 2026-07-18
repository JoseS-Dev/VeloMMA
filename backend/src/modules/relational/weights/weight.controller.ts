import type { Request, Response } from 'express';
import { WeightService } from './weight.services.js';
import { SendResponse, PaginationFor, buildPaginationMeta } from '../../../common/decorator/decorator.js';
import { validateWeight, validateUpdateWeight } from './weight.schema.js';
import { BadRequestException } from '../../../common/errors/error.js';

// Controlador para los pesos oficiales de un luchador
export class WeightController {
    constructor(private weightService: WeightService) {}

    // Controlador para crear un nuevo peso oficial de un luchador
    @SendResponse('Peso oficial creado correctamente', 201)
    async create(req: Request, res: Response){
        const validation = validateWeight(req.body);
        if(!validation.success) throw new BadRequestException('Error de validación');
        const weight = await this.weightService.create(validation.data);
        return weight;
    }

    // Controlador para obtener todos los pesos oficiales de un luchador
    @PaginationFor('cursor')
    @SendResponse('Pesos oficiales obtenidos correctamente', 200)
    async findAll(req: Request, res: Response){
        const {fighterId} = req.params;
        const { cursor, limit } = req.pagination!;
        const { weights, total } = await this.weightService.findAll(Number(fighterId), cursor, limit);
        return { 
            data: weights,
            meta: buildPaginationMeta(req.pagination!, total, weights.length)
        };
    }

    // Controlador para obtener un peso oficial de un luchador por su id
    @SendResponse('Peso oficial obtenido correctamente', 200)
    async findById(req: Request, res: Response){
        const {weightId} = req.params;
        const weight = await this.weightService.findById(Number(weightId));
        return weight;
    }

    // Controlador para actualizar un peso oficial de un luchador
    @SendResponse('Peso oficial actualizado correctamente', 200)
    async update(req: Request, res: Response){
        const {weightId} = req.params;
        const validation = validateUpdateWeight(req.body);
        if(!validation.success) throw new BadRequestException('Error de validación');
        const weight = await this.weightService.update(Number(weightId), validation.data);
        return weight;
    }

    // Controlador para eliminar un peso oficial de un luchador
    @SendResponse('Peso oficial eliminado correctamente', 200)
    async delete(req: Request, res: Response){
        const {weightId} = req.params;
        const weight = await this.weightService.delete(Number(weightId));
        return weight;
    }
}