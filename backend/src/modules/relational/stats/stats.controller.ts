import type {Request, Response} from 'express';
import { StatsService } from './stats.services.js';
import { SendResponse } from '../../../common/decorator/decorator.js';
import { BadRequestException } from '../../../common/errors/error.js';

// Controlador que maneja las rutas relacionadas con las estadísticas de un luchador
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    // Controlador para crear o actualizar las estadísticas de un luchador
    @SendResponse('Metricas actualizadas existosamente', 200)
    async updateFighterCareerStats(req: Request, res: Response){
        const { fighterId } = req.params;
        if(!fighterId || isNaN(Number(fighterId))) throw new BadRequestException('El parámetro "fighterId" es inválido');
        const result = await this.statsService.updateFighterCareerStats(Number(fighterId));
        return result;
    }

    // Controlador para obtener las estadísticas de un luchador
    @SendResponse('Metricas obtenidas existosamente', 200)
    async getFighterCareerStats(req: Request, res: Response){
        const { fighterId } = req.params;
        if(!fighterId || isNaN(Number(fighterId))) throw new BadRequestException('El parámetro "fighterId" es inválido');
        const result = await this.statsService.findByFighterId(Number(fighterId));
        return result;
    }
}