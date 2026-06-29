import type { Response, Request } from 'express';
import { TeamService } from './team.services.js';
import { validateTeam, validateUpdateTeam } from './team.schema.js';
import { SendResponse } from '../../common/decorator/decorator.js';
import { BadRequestException } from '../../common/errors/error.js';

// Controlador para los equipos
export class TeamController {
    constructor(private teamService: TeamService) {}

    // Controlador para crear un nuevo equipo
    @SendResponse('Equipo creado correctamente', 200)
    async create(req: Request, res: Response){
        const validation = validateTeam(req.body);
        if(!validation.success) return res.status(400).json(validation.error);
        const team = await this.teamService.create(validation.data);
        return team;
    }

    // Controlador para obtener todos los equipos
    @SendResponse('Equipos obtenidos correctamente', 200)
    async findAll(req: Request, res: Response){
        const { page, limit } = req.query;
        // Se valida el parámetro page y limit
        if(page && !Number.isInteger(Number(page))) return res.status(400).json({message: 'El parámetro page debe ser un número entero'});
        if(limit && !Number.isInteger(Number(limit))) return res.status(400).json({message: 'El parámetro limit debe ser un número entero'});
        const { teams, total } = await this.teamService.findAll(Number(page) || 1, Number(limit) || 10);
        return { 
            data: teams,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10,
            } 
        };
    }

    // Controlador para obtener todos los equipos activos
    @SendResponse('Equipos obtenidos correctamente', 200)
    async findAllActive(req: Request, res: Response){
        const { page, limit } = req.query;
        // Se valida el parámetro page y limit
        if(page && !Number.isInteger(Number(page))) return res.status(400).json({message: 'El parámetro page debe ser un número entero'});
        if(limit && !Number.isInteger(Number(limit))) return res.status(400).json({message: 'El parámetro limit debe ser un número entero'});
        const { teams, total } = await this.teamService.findAllActive(Number(page) || 1, Number(limit) || 10);
        return { 
            data: teams,
            meta: {
                total: total,
                page: Number(page) || 1,
                limit: Number(limit) || 10,
            } 
        };
    }

    // Controlador para obtener un equipo por su id
    @SendResponse('Equipo obtenido correctamente', 200)
    async findById(req: Request, res: Response){
        const {teamId} = req.params;
        const team = await this.teamService.findById(Number(teamId));
        return team;
    }

    // Controlador para actualizar los datos de un equipo
    @SendResponse('Equipo actualizado correctamente', 200)
    async update(req: Request, res: Response){
        const {teamId} = req.params;
        const validation = validateUpdateTeam(req.body);
        if(!validation.success) return res.status(400).json(validation.error);
        const team = await this.teamService.update(Number(teamId), validation.data);
        return team;
    }

    // Controlador para cambiar el estado de un equipo
    @SendResponse('Equipo actualizado correctamente', 200)
    async changeStatus(req: Request, res: Response){
        const {teamId} = req.params;
        const {isActive} = req.body;
        const team = await this.teamService.changeStatus(Number(teamId), Boolean(isActive));
        return team;
    }

    // Controlador para eliminar un equipo
    @SendResponse('Equipo eliminado correctamente', 200)
    async delete(req: Request, res: Response){
        const {teamId} = req.params;
        const team = await this.teamService.delete(Number(teamId));
        return team;
    }
}