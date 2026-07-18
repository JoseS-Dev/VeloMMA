import type {Request, Response} from "express";
import { TitleService } from "./title.services.js";
import { TitleType } from "../../../../generated/prisma/index.js";
import { validateTitleDTO, validateUpdateTitleDTO } from "./title.schema.js";
import { SendResponse, PaginationFor, buildPaginationMeta } from "../../../common/decorator/decorator.js";

// Controlador para manejar las rutas relacionadas con los titulos de un luchador en una división
export class TitleController {
    constructor(private readonly titleService: TitleService) {}

    // Controlador para crear un nuevo titulo de un luchador en una división
    @SendResponse('Titulo creado correctamente', 201)
    async create(req: Request, res: Response){
        const validation = validateTitleDTO(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.titleService.create(validation.data);
        return result;
    }

    // Controlador para obtener todos los titulos de un luchador
    @PaginationFor('cursor')
    @SendResponse('Titulos obtenidos correctamente', 200)
    async findAllByFighter(req: Request, res: Response){
        const { fighterId } = req.params;
        const { cursor, limit } = req.pagination!;
        const {titles, total} = await this.titleService.findAllByFighter(Number(fighterId), cursor, limit);
        return {
            data: titles,
            meta: buildPaginationMeta(req.pagination!, total, titles.length)
        }
    }

    // Controlador para obtener todos los titulos de una división
    @PaginationFor('cursor')
    @SendResponse('Titulos obtenidos correctamente', 200)
    async findAllByDivision(req: Request, res: Response){
        const { divisionId } = req.params;
        const { cursor, limit } = req.pagination!;
        const {titles, total} = await this.titleService.findAllByDivision(Number(divisionId), cursor, limit);
        return {
            data: titles,
            meta: buildPaginationMeta(req.pagination!, total, titles.length)
        }
    }

    // Controlador para obtener todos los titulos de una división y tipo de titulo
    @PaginationFor('cursor')
    @SendResponse('Titulos obtenidos correctamente', 200)
    async findAllByDivisionAndTitleType(req: Request, res: Response){
        const { divisionId, titleType } = req.params;
        const { cursor, limit } = req.pagination!;
        if(!Object.values(TitleType).includes(titleType as TitleType)) return res.status(400).json({message: 'El parametro titleType es inválido'});
        const {titles, total} = await this.titleService.findAllByDivisionAndTitleType(Number(divisionId), titleType as TitleType, cursor, limit);
        return {
            data: titles,
            meta: buildPaginationMeta(req.pagination!, total, titles.length)
        }
    }

    // Controlador para obtener un titulo por su id
    @SendResponse('Titulo obtenido correctamente', 200)
    async findById(req: Request, res: Response){
        const { titleId } = req.params;
        const result = await this.titleService.findById(Number(titleId));
        return result;
    }

    // Controlador para actualizar un titulo por su id
    @SendResponse('Titulo actualizado correctamente', 200)
    async update(req: Request, res: Response){
        const { titleId } = req.params;
        const validation = validateUpdateTitleDTO(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.titleService.update(Number(titleId), validation.data);
        return result;
    }

    // Controlador para eliminar un titulo por su id
    @SendResponse('Titulo eliminado correctamente', 200)
    async delete(req: Request, res: Response){
        const { titleId } = req.params;
        const result = await this.titleService.delete(Number(titleId));
        return result;
    }
}