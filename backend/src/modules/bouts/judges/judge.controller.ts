import type { Request, Response } from 'express';
import { JudgeService } from './judge.services.js';
import { validateJudgeData, validateJudgeUpdateData } from './judge.schema.js';
import { SendResponse, PaginationFor, buildPaginationMeta } from '../../../common/decorator/decorator.js';
import { BadRequestException } from '../../../common/errors/error.js';

// Controlador que interactua con los jueces de una pelea
export class JudgeController {
    constructor(private judgeService: JudgeService) {}

    // Controlador para crear un juez a una pelea
    @SendResponse('Juez creado correctamente', 201)
    async create(req: Request, res: Response){
        const validation = validateJudgeData(req.body);
        if(!validation.success) throw new BadRequestException('Error de validación');
        const result = await this.judgeService.create(validation.data);
        return result;
    }

    // Controlador para obtener todos los jueces de una pelea
    @PaginationFor('cursor')
    @SendResponse('Juez obtenido correctamente', 200)
    async findAll(req: Request, res: Response){
        const { boutId } = req.params;
        const { cursor, limit } = req.pagination!;
        const { judges, total } = await this.judgeService.findAll(Number(boutId), cursor, limit);
        return {
            data: judges,
            meta: buildPaginationMeta(req.pagination!, total, judges.length)
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
        if(!validation.success) throw new BadRequestException('Error de validación');
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