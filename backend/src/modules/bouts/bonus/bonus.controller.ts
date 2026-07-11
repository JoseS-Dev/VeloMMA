import type { Request, Response } from "express";
import { BonusService } from "./bonus.services.js";
import { validateBonusData, validateBonusUpdateData } from "./bonus.schema.js";
import { SendResponse } from "../../../common/decorator/decorator.js";

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
    @SendResponse('Bonos obtenidos exitosamente', 200)
    async findAll(req: Request, res: Response){
        const {page, limit} = req.query;
        // Se valida los parametros
        if(page && Number.isNaN(Number(page))) return res.status(400).json({message: 'El page debe ser un número'});
        if(limit && Number.isNaN(Number(limit))) return res.status(400).json({message: 'El limit debe ser un número'});
        const cursor = page ? Number(page) : undefined;
        const { bonuses, total } = await this.bonusService.findAll(cursor, Number(limit) || 10);
        return {
            data: bonuses,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        }
    }

    // Controlador para obtener todos los bonos recibidos por un luchador
    @SendResponse('Bonos obtenidos exitosamente', 200)
    async findAllByFighter(req: Request, res: Response){
        const {fighterId, page, limit} = req.params;
        // Se valida los parametros
        if(Number.isNaN(Number(fighterId))) return res.status(400).json({message: 'El id del luchador es obligatorio'});
        if(page && Number.isNaN(Number(page))) return res.status(400).json({message: 'El page debe ser un número'});
        if(limit && Number.isNaN(Number(limit))) return res.status(400).json({message: 'El limit debe ser un número'});
        const cursor = page ? Number(page) : undefined;
        const { bonuses, total } = await this.bonusService.findAllByFighter(Number(fighterId), cursor, Number(limit) || 10);
        return {
            data: bonuses,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
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