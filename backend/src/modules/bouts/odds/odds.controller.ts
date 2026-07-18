import type { Request, Response } from 'express';
import { OddsService } from './odds.services.js';
import { validateCreateBoutOddsDTO, validateUpdateBoutOddsDTO } from './odds.schema.js';
import { SendResponse, PaginationFor, buildPaginationMeta } from '../../../common/decorator/decorator.js';

// Controlador que maneja las rutas relacionadas con las casas de apuestas para una pelea
export class OddsController {
    constructor(private readonly oddsService: OddsService) {}

    // Controlador para crear una casa de apuesta para una pelea
    @SendResponse('Casa de apuesta creada exitosamente', 201)
    async create(req: Request, res: Response) {
        const validation = validateCreateBoutOddsDTO(req.body);
        if(!validation.success) return res.status(400).json({ message: 'Error de validación', errors: validation.error });
        const result = await this.oddsService.create(validation.data);
        return result;
    }

    // Controlador para obtener todas las casas de apuestas para una pelea
    @PaginationFor('cursor')
    @SendResponse('Casas de apuestas obtenidas exitosamente', 200)
    async findAll(req: Request, res: Response){
        const { boutId } = req.params;
        const { cursor, limit } = req.pagination!;
        const { Odds, total } = await this.oddsService.findAll(Number(boutId), cursor, limit);
        return {
            data: Odds,
            meta: buildPaginationMeta(req.pagination!, total, Odds.length)
        };
    }

    // Controlador para obtener todas las casas de apuestas de un proveedor en común
    @PaginationFor('cursor')
    @SendResponse('Casas de apuestas obtenidas exitosamente', 200)
    async findAllByProvider(req: Request, res: Response){
        const { provider } = req.params;
        const { cursor, limit } = req.pagination!;
        const { Odds, total } = await this.oddsService.findAllByProvider(String(provider), cursor, limit);
        return {
            data: Odds,
            meta: buildPaginationMeta(req.pagination!, total, Odds.length)
        };
    }

    // Controlador para obtener una casa de apuesta por su ID
    @SendResponse('Casa de apuesta obtenida exitosamente', 200)
    async findOne(req: Request, res: Response){
        const { oddsId } = req.params;
        const result = await this.oddsService.findById(Number(oddsId));
        return result;
    }

    // Controlador para actualizar una casa de apuesta por su ID
    @SendResponse('Casa de apuesta actualizada exitosamente', 200)
    async update(req: Request, res: Response){
        const { oddsId } = req.params;
        const validation = validateUpdateBoutOddsDTO(req.body);
        if(!validation.success) return res.status(400).json({ message: 'Error de validación', errors: validation.error });
        const result = await this.oddsService.update(Number(oddsId), validation.data);
        return result;
    }

    // Controlador para eliminar una casa de apuesta por su ID
    @SendResponse('Casa de apuesta eliminada exitosamente', 200)
    async delete(req: Request, res: Response){
        const { oddsId } = req.params;
        const result = await this.oddsService.delete(Number(oddsId));
        return result;
    }
}