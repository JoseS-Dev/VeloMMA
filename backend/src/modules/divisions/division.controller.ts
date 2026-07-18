import type { Response, Request } from 'express';
import { DivisionService } from './division.services.js';
import { validateDivision, validateUpdateDivision } from './division.schema.js';
import { SendResponse, PaginationFor, buildPaginationMeta } from '../../common/decorator/decorator.js';
import { BadRequestException } from '../../common/errors/error.js';

// Controlador para las divisiones
export class DivisionController {
    constructor(private divisionService: DivisionService) {}

    // Controlador para crear una nueva division
    @SendResponse('Division creada correctamente', 201)
    async create(req: Request, res: Response) {
        const validation = validateDivision(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const division = await this.divisionService.create(validation.data);
        return division;
    }

    // Controlador para obtener todas las divisiones
    @PaginationFor('cursor')
    @SendResponse('Divisiones obtenidas correctamente', 200)
    async findAll(req: Request, res: Response) {
        const { cursor, limit } = req.pagination!;
        const { divisions, nextCursor, total } = await this.divisionService.findAll(cursor, limit);
        return { 
            data: divisions,
            meta: buildPaginationMeta(req.pagination!, total, divisions.length, nextCursor)
        };
    }

    // Controlador para obtener todas las divisiones activas
    @PaginationFor('cursor')
    @SendResponse('Divisiones obtenidas correctamente', 200)
    async findAllActive(req: Request, res: Response) {
        const { cursor, limit } = req.pagination!;
        const { divisions, total } = await this.divisionService.findAllActive(cursor, limit);
        return { 
            data: divisions,
            meta: buildPaginationMeta(req.pagination!, total, divisions.length)
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
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const division = await this.divisionService.update(Number(divisionId), validation.data);
        return division;
    }

    // Controlador para cambiar el estado de una division
    @SendResponse('Division actualizada correctamente', 200)
    async changeStatus(req: Request, res: Response) {
        const {divisionId} = req.params;
        const {isActive} = req.body;
        if(typeof isActive !== 'boolean') throw new BadRequestException('El estado no es un booleano');
        const division = await this.divisionService.changeStatus(Number(divisionId), isActive);
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