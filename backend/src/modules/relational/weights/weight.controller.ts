import type { Request, Response } from 'express';
import { WeightService } from './weight.services.js';
import { SendResponse } from '../../../common/decorator/decorator.js';
import { validateWeight, validateUpdateWeight } from './weight.schema.js';

// Controlador para los pesos oficiales de un luchador
export class WeightController {
    constructor(private weightService: WeightService) {}

    // Controlador para crear un nuevo peso oficial de un luchador
    @SendResponse('Peso oficial creado correctamente', 201)
    async create(req: Request, res: Response){
        const validation = validateWeight(req.body);
        if(!validation.success) return res.status(400).json(validation.error);
        const weight = await this.weightService.create(validation.data);
        return weight;
    }

    // Controlador para obtener todos los pesos oficiales de un luchador
    @SendResponse('Pesos oficiales obtenidos correctamente', 200)
    async findAll(req: Request, res: Response){
        const {fighterId} = req.params;
        const { page, limit } = req.query;
        // Se valida el parámetro page y limit
        if(page && !Number.isInteger(Number(page))) return res.status(400).json({message: 'El parámetro page debe ser un número entero'});
        if(limit && !Number.isInteger(Number(limit))) return res.status(400).json({message: 'El parámetro limit debe ser un número entero'});
        const { weights, total } = await this.weightService.findAll(Number(fighterId), Number(page) || 1, Number(limit) || 10);
        return { 
            data: weights,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10,
            } 
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
        if(!validation.success) return res.status(400).json(validation.error);
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