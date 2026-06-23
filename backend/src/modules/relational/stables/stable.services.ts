import type { StableDTO, UpdateStableDTO } from '../../../types/relational/stables/stable.types.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import { BadRequestException, NotFoundException } from '../../../common/errors/error.js';

// Servicio para obtener todos los equipos de los luchadores
export class StableService {
    constructor(private prisma: PrismaClient) {}

    // Crear un nuevo equipo de un luchador
    async create(data: StableDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista el luchador y el equipo
        const [existingFighter, existingTeam] = await Promise.all([
            this.prisma.fighters.findFirst({
                where: {id: data.fighter_id}
            }),
            this.prisma.teams.findFirst({
                where: {id: data.team_id}
            })
        ]);
        if(!existingFighter) throw new NotFoundException('No se encontró el luchador');
        if(!existingTeam) throw new NotFoundException('No se encontró el equipo');
        // Si existe, se crea el equipo
        const stable = await this.prisma.fighterTeams.create({
            data: data
        });
        if(!stable) throw new BadRequestException('No se pudo crear el equipo');
        return stable;
    }

    // Servicio para obtener todos los equipos de los luchadores
    async findAll(
        FighterId: number,
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros
        const total = await this.prisma.fighterTeams.count({
            where: {fighter_id: FighterId}
        });
        // Se obtienen los equipos
        const stables = await this.prisma.fighterTeams.findMany({
            where: {fighter_id: FighterId},
            skip: skip,
            take: limit,
            orderBy: {joined_date: 'asc'}
        });
        return {
            stables, 
            total: total
        };
    }

    async findById(stableId: number){
        const stable = await this.prisma.fighterTeams.findUnique({
            where: {id: stableId}
        });
        if(!stable) throw new BadRequestException('No se encontró el equipo');
        return stable;
    }

    // Servicio para actualizar los equipos de los luchadores
    async update(stableId: number, data: UpdateStableDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que el equipo existe
        const existingStable = await this.findById(stableId);
        if(!existingStable) throw new BadRequestException('No se encontró el equipo');
        // Se verifica que no exista un equipo con el mismo nombre
        if(data.team_id && data.team_id !== existingStable.team_id){
            const existingTeamName = await this.prisma.teams.findFirst({
                where: {id: data.team_id}
            });
            if(existingTeamName) throw new BadRequestException('Ya existe un equipo con ese id');
            // Si no existe, se actualiza el equipo
            const stable = await this.prisma.fighterTeams.update({
                where: {id: stableId},
                data: data
            });
            if(!stable) throw new BadRequestException('No se pudo actualizar el equipo');
            return stable;
        }
        const stable = await this.prisma.fighterTeams.update({
            where: {id: stableId},
            data: data
        });
        if(!stable) throw new BadRequestException('No se pudo actualizar el equipo');
        return stable;
    }

    // Servicio para eliminar un equipo de un luchador
    async delete(stableId: number){
        // Se verifica que el equipo existe
        const existingStable = await this.findById(stableId);
        if(!existingStable) throw new BadRequestException('No se encontró el equipo');
        // Se elimina el equipo
        const stable = await this.prisma.fighterTeams.delete({
            where: {id: stableId}
        });
        if(!stable) throw new BadRequestException('No se pudo eliminar el equipo');
        return stable;
    }
}