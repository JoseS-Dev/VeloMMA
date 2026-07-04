import type { Request, Response } from 'express';
import { CampService } from './camp.services.js';
import { validateCreateCampDTO, validateUpdateCampDTO } from './camp.schema.js';
import { SendResponse } from '../../../common/decorator/decorator.js';

// Controlador que maneja las rutas relacionadas con los campamentos donde entreno un luchador para una pelea
export class CampController {
    constructor(private readonly campService: CampService) {}

    // Controlador para crear un campamento donde entreno un luchador para una pelea
    @SendResponse('Campamento creado exitosamente', 201)
    async create(req: Request, res: Response) {
        const validation = validateCreateCampDTO(req.body);
        if(!validation.success) return res.status(400).json({ message: 'Error de validación', errors: validation.error });
        const result = await this.campService.create(validation.data);
        return result;
    }

    // Controlador para obtener todos los campamentos donde ha estado un luchador
    @SendResponse('Campamentos obtenidos exitosamente', 200)
    async findAllByFighter(req: Request, res: Response){
        const { fighterId } = req.params;
        const { page, limit } = req.query;
        // se valida los parametros de paginación
        if(page && isNaN(Number(page))) return res.status(400).json({ message: 'El parámetro de paginación "page" es inválido' });
        if(limit && isNaN(Number(limit))) return res.status(400).json({ message: 'El parámetro de paginación "limit" es inválido' });
        const result = await this.campService.findAllByFighter(Number(fighterId), Number(page) || 1, Number(limit) || 10);
        return {
            data: result.camps,
            meta: {
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        };
    }

    // Controlador para obtener todos los campamentos donde ha estado un equipo
    @SendResponse('Campamentos obtenidos exitosamente', 200)
    async findAllByTeam(req: Request, res: Response){
        const { teamId } = req.params;
        const { page, limit } = req.query;
        // se valida los parametros de paginación
        if(page && isNaN(Number(page))) return res.status(400).json({ message: 'El parámetro de paginación "page" es inválido' });
        if(limit && isNaN(Number(limit))) return res.status(400).json({ message: 'El parámetro de paginación "limit" es inválido' });
        const result = await this.campService.findAllByTeam(Number(teamId), Number(page) || 1, Number(limit) || 10);
        return {
            data: result.camps,
            meta: {
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        };
    }

    // Controlador para obtener un campamento donde entreno un luchador para una pelea por su ID
    @SendResponse('Campamento obtenido exitosamente', 200)
    async findOne(req: Request, res: Response){
        const { campId } = req.params;
        const result = await this.campService.findById(Number(campId));
        return result;
    }

    // Controlador para actualizar un campamento donde entreno un luchador para una pelea
    @SendResponse('Campamento actualizado exitosamente', 200)
    async update(req: Request, res: Response){
        const { campId } = req.params;
        const validation = validateUpdateCampDTO(req.body);
        if(!validation.success) return res.status(400).json({ message: 'Error de validación', errors: validation.error });
        const result = await this.campService.update(Number(campId), validation.data);
        return result;
    }

    // Controlador para eliminar un campamento donde entreno un luchador para una pelea por su ID (soft delete)
    @SendResponse('Campamento eliminado exitosamente', 200)
    async delete(req: Request, res: Response){
        const { campId } = req.params;
        const result = await this.campService.delete(Number(campId));
        return result;
    }
}