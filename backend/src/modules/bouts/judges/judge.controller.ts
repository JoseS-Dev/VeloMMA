import type { Request, Response } from 'express';
import { JudgeService } from './judge.services.js';
import { validateJudgeData, validateJudgeUpdateData } from './judge.schema.js';
import { SendResponse } from '../../../common/decorator/decorator.js';

// Controlador que interactua con los jueces de una pelea
export class JudgeController {
    constructor(private judgeService: JudgeService) {}

    // Controlador para crear un juez a una pelea
    @SendResponse('Juez creado correctamente', 201)
    async create(req: Request, res: Response){
        const validation = validateJudgeData(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.judgeService.create(validation.data);
        return result;
    }

    // Controlador para obtener todos los jueces de una pelea
    @SendResponse('Juez obtenido correctamente', 200)
    async findAll(req: Request, res: Response){
        const { boutId } = req.params;
        const { page, limit } = req.query;
        // Se valida el parámetro page y limit
        if(page && !Number.isInteger(Number(page))) return res.status(400).json({message: 'El parámetro page debe ser un número entero'});
        if(limit && !Number.isInteger(Number(limit))) return res.status(400).json({message: 'El parámetro limit debe ser un número entero'});
        const result = await this.judgeService.findAll(Number(boutId), Number(page) || 1, Number(limit) || 10);
        return {
            data: result.judges,
            meta: {
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        }
    }

    // Controlador para obtener el resultado de un juez por su id
    @SendResponse('Juez obtenido correctamente', 200)
    async findById(req: Request, res: Response){
        const { id } = req.params;
        const result = await this.judgeService.findById(Number(id));
        return result;
    }

    // Controlador para actualizar un juez de una pelea por su Id
    @SendResponse('Juez actualizado correctamente', 200)
    async update(req: Request, res: Response){
        const { id } = req.params;
        const validation = validateJudgeUpdateData(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.judgeService.update(Number(id), validation.data);
        return result;
    }

    // Controlador para eliminar un juez de una pelea por su Id
    @SendResponse('Juez eliminado correctamente', 200)
    async delete(req: Request, res: Response){
        const { id } = req.params;
        const result = await this.judgeService.delete(Number(id));
        return result;
    }
}