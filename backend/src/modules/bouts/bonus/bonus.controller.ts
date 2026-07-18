import type { Request, Response } from "express";
import { BonusService } from "./bonus.services.js";
import { validateBonusData, validateBonusUpdateData } from "./bonus.schema.js";
import { SendResponse, PaginationFor, buildPaginationMeta } from "../../../common/decorator/decorator.js";

// Controlador que interactua con la tabla de bonos de una pelea
export class BonusController {
    constructor(private readonly bonusService: BonusService) {}

    // Controlador para agregar un bono a una pelea
    @SendResponse('Bono agregado exitosamente', 201)
    async create(req: Request, res: Response){
        const validation = validateBonusData(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.bonusService.create(validation.data);
        return result
    }

    // Controlador para obtener todos los bonos recibidos
    @PaginationFor('cursor')
    @SendResponse('Bonos obtenidos exitosamente', 200)
    async findAll(req: Request, res: Response){
        const { cursor, limit } = req.pagination!;
        const { bonuses, total } = await this.bonusService.findAll(cursor, limit);
        return {
            data: bonuses,
            meta: buildPaginationMeta(req.pagination!, total, bonuses.length)
        }
    }

    // Controlador para obtener todos los bonos recibidos por un luchador
    @PaginationFor('cursor')
    @SendResponse('Bonos obtenidos exitosamente', 200)
    async findAllByFighter(req: Request, res: Response){
        const {fighterId} = req.params;
        const { cursor, limit } = req.pagination!;
        const { bonuses, total } = await this.bonusService.findAllByFighter(Number(fighterId), cursor, limit);
        return {
            data: bonuses,
            meta: buildPaginationMeta(req.pagination!, total, bonuses.length)
        }
    }

    // Controlador para obtener un bono por su ID
    @SendResponse('Bono obtenido exitosamente', 200)
    async findById(req: Request, res: Response){
        const {bonusId} = req.params;
        // Se valida los parametros
        if(Number.isNaN(Number(bonusId))) return res.status(400).json({message: 'El id del bono es obligatorio'});
        const result = await this.bonusService.findById(Number(bonusId));
        return result
    }

    // Controlador para actualizar un bono por su ID
    @SendResponse('Bono actualizado exitosamente', 200)
    async update(req: Request, res: Response){
        const {bonusId} = req.params;
        const validation = validateBonusUpdateData(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.bonusService.update(Number(bonusId), validation.data);
        return result
    }

    // Controlador para eliminar un bono por su ID
    @SendResponse('Bono eliminado exitosamente', 200)
    async delete(req: Request, res: Response){
        const {bonusId} = req.params;
        // Se valida los parametros
        if(Number.isNaN(Number(bonusId))) return res.status(400).json({message: 'El id del bono es obligatorio'});
        const result = await this.bonusService.delete(Number(bonusId));
        return result
    }
}