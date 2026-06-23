import type { Response, Request } from 'express';
import { DivisionService } from './division.services.js';
import { validateDivision, validateUpdateDivision } from './division.schema.js';
import { SendResponse } from '../../common/decorator/decorator.js';

// Controlador para las divisiones
export class DivisionController {
    constructor(private divisionService: DivisionService) {}

    // Controlador para crear una nueva division
    @SendResponse('Division creada correctamente', 201)
    async create(req: Request, res: Response) {
        const validation = validateDivision(req.body);
        if(!validation.success) return res.status(400).json(validation.error);
        const division = await this.divisionService.create(validation.data);
        return division;
    }

    // Controlador para obtener todas las divisiones
    @SendResponse('Divisiones obtenidas correctamente', 200)
    async findAll(req: Request, res: Response) {
        const { page, limit } = req.query;
        // Se valida el parámetro page y limit
        if(page && !Number.isInteger(Number(page))) return res.status(400).json({message: 'El parámetro page debe ser un número entero'});
        if(limit && !Number.isInteger(Number(limit))) return res.status(400).json({message: 'El parámetro limit debe ser un número entero'});
        const { divisions, total } = await this.divisionService.findAll(Number(page) || 1, Number(limit) || 10);
        return { 
            data: divisions,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10,
            } 
        };
    }

    // Controlador para obtener una division por su id
    @SendResponse('Division obtenida correctamente', 200)
    async findById(req: Request, res: Response) {
        const {divisionId} = req.params;
        const division = await this.divisionService.findById(Number(divisionId));
        return division;
    }

    // Controlador para actualizar las divisiones
    @SendResponse('Division actualizada correctamente', 200)
    async update(req: Request, res: Response) {
        const {divisionId} = req.params;
        const validation = validateUpdateDivision(req.body);
        if(!validation.success) return res.status(400).json(validation.error);
        const division = await this.divisionService.update(Number(divisionId), validation.data);
        return division;
    }

    // Controlador para cambiar el estado de una division
    @SendResponse('Division actualizada correctamente', 200)
    async changeStatus(req: Request, res: Response) {
        const {divisionId} = req.params;
        const {isActive} = req.body;
        const division = await this.divisionService.changeStatus(Number(divisionId), Boolean(isActive));
        return division;
    }

    // Controlador para eliminar una division
    @SendResponse('Division eliminada correctamente', 200)
    async delete(req: Request, res: Response) {
        const {divisionId} = req.params;
        const division = await this.divisionService.delete(Number(divisionId));
        return division;
    }
}