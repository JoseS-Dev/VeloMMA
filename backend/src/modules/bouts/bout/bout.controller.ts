import type { Request, Response } from "express";
import { BoutService } from "./bout.services.js";
import { validateBoutDTO, validateBoutUpdateDTO } from "./bout.schema.js";
import { SendResponse } from "../../../common/decorator/decorator.js";
import { BoutStatus } from "../../../../generated/prisma/index.js";
// Controlador que interactua con la tabla de peleas
export class BoutController {
    constructor(private readonly boutService: BoutService) {}

    // Controlador para crear una pelea
    @SendResponse('Pelea creada correctamente', 201)
    async create(req: Request, res: Response){
        const validation = validateBoutDTO(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.boutService.create(validation.data);
        return result
    }

    // Controlador para obtener todas las peleas
    @SendResponse('Pelea obtenidas exitosamente', 200)
    async findAll(req: Request, res: Response){
        const {page, limit} = req.query;
        // Se valida los parametros de la consulta
        if(page && Number.isNaN(Number(page))) return res.status(400).json({message: 'Page no es un número'});
        if(limit && Number.isNaN(Number(limit))) return res.status(400).json({message: 'Limit no es un número'});
        const result = await this.boutService.findAll(Number(page) || 1, Number(limit) || 10);
        return {
            data: result.bouts,
            meta: {
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        }
    }

    // Controlador para obtener todas las peleas de un evento en común
    @SendResponse('Peleas obtenidas exitosamente', 200)
    async findAllByEvent(req: Request, res: Response){
        const {eventId} = req.params;
        const {page, limit} = req.query;

        // Se validan los parametros de la consulta
        if(page && Number.isNaN(Number(page))) return res.status(400).json({message: 'Page no es un número'});
        if(limit && Number.isNaN(Number(limit))) return res.status(400).json({message: 'Limit no es un número'});
        const result = await this.boutService.findAllByEvent(Number(eventId), Number(page) || 1, Number(limit) || 10);
        return {
            data: result.bouts,
            meta: {
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        }
    }

    // Controlador para obtener todas las peleas de una división de peso
    @SendResponse('Peleas obtenidas exitosamente', 200)
    async findAllByDivision(req: Request, res: Response){
        const {divisionId} = req.params;
        const {page, limit} = req.query;

        // Se validan los parametros de la consulta
        if(page && Number.isNaN(Number(page))) return res.status(400).json({message: 'Page no es un número'});
        if(limit && Number.isNaN(Number(limit))) return res.status(400).json({message: 'Limit no es un número'});
        const result = await this.boutService.findAllByDivision(Number(divisionId), Number(page) || 1, Number(limit) || 10);
        return {
            data: result.bouts,
            meta: {
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        }
    }
    
    // Controlador para obtener una pelea
    @SendResponse('Pelea obtenida exitosamente', 200)
    async findById(req: Request, res: Response){
        const {BoutId} = req.params;
        const result = await this.boutService.findById(Number(BoutId));
        return result
    }

    // Controlador para actualizar una pelea
    @SendResponse('Pelea actualizada exitosamente', 200)
    async update(req: Request, res: Response){
        const {BoutId} = req.params;
        const validation = validateBoutUpdateDTO(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.boutService.update(Number(BoutId), validation.data);
        return result
    }

    // Controlador para cambiar el estado de una pelea
    @SendResponse('Estado de la pelea cambiado exitosamente', 200)
    async changeStatus(req: Request, res: Response){
        const {BoutId} = req.params;
        const {status} = req.body;
        const result = await this.boutService.changeStatus(Number(BoutId), status as BoutStatus);
        return result
    }

    // Controlador para eliminar una pelea
    @SendResponse('Pelea eliminada exitosamente', 200)
    async delete(req: Request, res: Response){
        const {BoutId} = req.params;
        const result = await this.boutService.delete(Number(BoutId));
        return result
    }


}