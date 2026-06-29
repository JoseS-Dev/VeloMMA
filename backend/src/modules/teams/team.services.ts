import type { TeamDTO, UpdateTeamDTO } from '../../types/teams/team.types.js';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { BadRequestException, ConflictException, NotFoundException } from '../../common/errors/error.js';

// Servicio para obtener todos los datos de los equipos
export class TeamService {
    constructor(private prisma: PrismaClient) {}

    // Crear un nuevo equipo
    async create(data: TeamDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que no exista un equipo con el mismo nombre
        const existingTeam = await this.prisma.teams.findFirst({
            where: {name_team: data.name_team}
        });
        if(existingTeam) throw new ConflictException('Ya existe un equipo con ese nombre');
        // Si no existe, se crea el equipo
        const team = await this.prisma.teams.create({
            data: data
        });
        if(!team) throw new BadRequestException('No se pudo crear el equipo');
        return team;
    }

    // Servicio para obtener todos los datos de los equipos
    async findAll(
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros
        const total = await this.prisma.teams.count();
        // Se obtienen los datos de los equipos
        const teams = await this.prisma.teams.findMany({
            skip: skip,
            take: limit,
            orderBy: {created_at: 'asc'}
        });
        return {
            teams, 
            total: total
        };
    }

    // Servicio para obtener todos los datos de los equipos activos
    async findAllActive(
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros
        const total = await this.prisma.teams.count();
        // Se obtienen los datos de los equipos activos
        const teams = await this.prisma.teams.findMany({
            skip: skip,
            take: limit,
            where: {is_active: true},
            orderBy: {created_at: 'asc'}
        });
        return {
            teams, 
            total: total
        };
    }

    // Servicio para obtener los datos de un equipo por su id
    async findById(teamId: number){
        const team = await this.prisma.teams.findUnique({
            where: {id: teamId}
        });
        if(!team) throw new NotFoundException('No se encontró el equipo');
        return team;
    }

    // Servicio para actualizar los datos de un equipo
    async update(teamId: number, data: UpdateTeamDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que el equipo existe
        const existingTeam = await this.findById(teamId);
        if(!existingTeam) throw new NotFoundException('No se encontró el equipo');
        // Se verifica que no exista un equipo con el mismo nombre
        if(data.name_team && data.name_team !== existingTeam.name_team){
            const existingTeamName = await this.prisma.teams.findFirst({
                where: {name_team: data.name_team}
            });
            if(existingTeamName) throw new ConflictException('Ya existe un equipo con ese nombre');
            // Si no existe, se actualiza el equipo
            const team = await this.prisma.teams.update({
                where: {id: teamId},
                data: data
            });
            if(!team) throw new BadRequestException('No se pudo actualizar el equipo');
            return team;
        }
        const team = await this.prisma.teams.update({
            where: {id: teamId},
            data: data
        });
        if(!team) throw new BadRequestException('No se pudo actualizar el equipo');
        return team;
    }

    // Servicio para cambiar el estado de un equipo
    async changeStatus(teamId: number, isActive: boolean){
        if(!teamId) throw new BadRequestException('El id es obligatorio');
        if(typeof isActive !== 'boolean') throw new BadRequestException('El estado es obligatorio');
        // Se verifica que el equipo existe
        const existingTeam = await this.findById(teamId);
        if(!existingTeam) throw new NotFoundException('No se encontró el equipo');
        // Se actualiza el estado del equipo
        const team = await this.prisma.teams.update({
            where: {id: teamId},
            data: {is_active: isActive}
        });
        if(!team) throw new BadRequestException('No se pudo actualizar el equipo');
        return team;
    }

    // Servicio para eliminar un equipo
    async delete(teamId: number){
        // Se verifica que el equipo existe
        const existingTeam = await this.findById(teamId);
        if(!existingTeam) throw new NotFoundException('No se encontró el equipo');
        // Se elimina el equipo
        const team = await this.prisma.teams.delete({
            where: {id: teamId}
        });
        if(!team) throw new BadRequestException('No se pudo eliminar el equipo');
        return team;
    }
}