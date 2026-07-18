import type { Request, Response } from "express";
import { WeighInsService } from "./weighIns.services.js";
import { validateWeighInsData, validateWeighInsUpdateData } from "./weighIns.schema.js";
import { SendResponse, PaginationFor, buildPaginationMeta } from "../../../common/decorator/decorator.js";

// Controlador que maneja las rutas de los pesajes oficiales de los luchadores para la pelea
export class WeighInsController {
    constructor(private weighInsService: WeighInsService) {}

    // Controlador para crear un pesaje oficial de un luchador para una pelea
    @SendResponse('Pesaje oficial creado correctamente', 201)
    async create(req: Request, res: Response){
        const validation = validateWeighInsData(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.weighInsService.create(validation.data);
        return result;
    }

    // Controlador para obtener todos los pesajes oficiales
    @PaginationFor('cursor')
    @SendResponse('Pesaje oficial obtenido correctamente', 200)
    async findAll(req: Request, res: Response){
        const { cursor, limit } = req.pagination!;
        const { weighIns, total } = await this.weighInsService.findAll(cursor, limit);
        return {
            data: weighIns,
            meta: buildPaginationMeta(req.pagination!, total, weighIns.length)
        }
    }

    // Controlador para obtener todos los pesajes oficiales de una pelea
    @SendResponse('Pesaje oficial obtenido correctamente', 200)
    async findByBoutId(req: Request, res: Response){
        const { boutId } = req.params;
        const result = await this.weighInsService.findByBoutId(Number(boutId));
        return result;
    }

    // Controlador para obtener el pesaje oficial de un luchador por su id
    @SendResponse('Pesaje oficial obtenido correctamente', 200)
    async findById(req: Request, res: Response){
        const { id } = req.params;
        const result = await this.weighInsService.findById(Number(id));
        return result;
    }

    // Controlador para actualizar un pesaje oficial de una pelea
    @SendResponse('Pesaje oficial actualizado correctamente', 200)
    async update(req: Request, res: Response){
        const { id } = req.params;
        const validation = validateWeighInsUpdateData(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.weighInsService.update(Number(id), validation.data);
        return result;
    }

    // Controlador para eliminar un pesaje oficial de una pelea
    @SendResponse('Pesaje oficial eliminado correctamente', 200)
    async delete(req: Request, res: Response){
        const { id } = req.params;
        const result = await this.weighInsService.delete(Number(id));
        return result;
    }
}