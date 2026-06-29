import type { Request, Response } from "express";
import { RankingService } from "./rank.services.js";
import { validateRankingData, validateRankingUpdateData } from "./rank.schema.js";
import { SendResponse } from "../../../common/decorator/decorator.js";

// Controlador que interactua con la tabla de clasificaciones de los luchadores
export class RankingController {
    constructor(private readonly rankingService: RankingService) {}

    // Controlador para agregar una clasificación de un luchador
    @SendResponse('Clasificación agregada exitosamente', 201)
    async create(req: Request, res: Response){
        const validation = validateRankingData(req.body);
        if(!validation.success) return res.status(400).json(validation.error);
        const result = await this.rankingService.create(validation.data);
        return result
    }

    // Controlador para obtener todas las clasificaciones
    @SendResponse('Clasificaciones obtenidas exitosamente', 200)
    async findAll(req: Request, res: Response){
        const {page, limit} = req.query;
        // Se valida los parametros
        if(page && Number.isNaN(Number(page))) return res.status(400).json({message: 'El page debe ser un número'});
        if(limit && Number.isNaN(Number(limit))) return res.status(400).json({message: 'El limit debe ser un número'});
        const result = await this.rankingService.findAll(Number(page) || 1, Number(limit) || 10);
        return {
            data: result.rankings,
            meta: {
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        }
    }

    // Controlador para obtener todas las clasificaciones de una división
    @SendResponse('Clasificaciones obtenidas exitosamente', 200)
    async findAllByDivision(req: Request, res: Response){
        const {DivisionId} = req.params;
        const {page, limit} = req.query;
        // Se valida los parametros
        if(Number.isNaN(Number(DivisionId))) return res.status(400).json({message: 'El id de la división es obligatorio'});
        if(page && Number.isNaN(Number(page))) return res.status(400).json({message: 'El page debe ser un número'});
        if(limit && Number.isNaN(Number(limit))) return res.status(400).json({message: 'El limit debe ser un número'});
        const result = await this.rankingService.findAllByDivision(Number(DivisionId), Number(page) || 1, Number(limit) || 10);
        return {
            data: result.rankings,
            meta: {
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        }
    }

    // Controlador para obtener una clasificación por su ID
    @SendResponse('Clasificación obtenida exitosamente', 200)
    async findById(req: Request, res: Response){
        const {RankingId} = req.params;
        // Se valida los parametros
        if(Number.isNaN(Number(RankingId))) return res.status(400).json({message: 'El id de la clasificación es obligatorio'});
        const result = await this.rankingService.findById(Number(RankingId));
        return result
    }

    // Controlador para actualizar una clasificación por su ID
    @SendResponse('Clasificación actualizada exitosamente', 200)
    async update(req: Request, res: Response){
        const {RankingId} = req.params;
        const validation = validateRankingUpdateData(req.body);
        if(!validation.success) return res.status(400).json(validation.error);
        const result = await this.rankingService.update(Number(RankingId), validation.data);
        return result
    }

    // Controlador para eliminar una clasificación por su ID
    @SendResponse('Clasificación eliminada exitosamente', 200)
    async delete(req: Request, res: Response){
        const {RankingId} = req.params;
        // Se valida los parametros
        if(Number.isNaN(Number(RankingId))) return res.status(400).json({message: 'El id de la clasificación es obligatorio'});
        const result = await this.rankingService.delete(Number(RankingId));
        return result
    }
}