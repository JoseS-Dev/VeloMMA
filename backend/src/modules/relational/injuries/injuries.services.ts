import type { InjuryDTO, UpdateInjuryDTO } from '../../../types/relational/injuries/injuries.types.js';
import { InjurySeverity } from '../../../../generated/prisma/index.js';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import { BadRequestException, NotFoundException } from '../../../common/errors/error.js';

// Servicio para obtener todas las lesiones o inactividades de un luchador
export class InjuryService {
    constructor(private prisma: PrismaClient) {}

    // Crear una nueva lesión o inactividad de un luchador
    async create(data: InjuryDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista el luchador
        const existingFighter = await this.prisma.fighters.findFirst({
            where: {id: data.fighter_id}
        });
        if(!existingFighter) throw new NotFoundException('No se encontró el luchador');
        // Si existe, se crea la lesión o inactividad
        const injury = await this.prisma.fighterInjuries.create({
            data: data
        });
        if(!injury) throw new BadRequestException('No se pudo crear la lesión o inactividad');
        return injury;
    }

    // Servicio para obtener todas las lesiones o inactividades de un luchador
    async findAll(
        FighterId: number,
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros
        const total = await this.prisma.fighterInjuries.count({
            where: {fighter_id: FighterId}
        });
        // Se obtienen las lesiones o inactividades
        const injuries = await this.prisma.fighterInjuries.findMany({
            where: {fighter_id: FighterId},
            skip: skip,
            take: limit,
            orderBy: {injury_date: 'asc'}
        });
        return {
            injuries, 
            total: total
        };
    }

    // Servicio para obtener una lesión o inactividad de un luchador por su id
    async findById(injuryId: number){
        const injury = await this.prisma.fighterInjuries.findUnique({
            where: {id: injuryId}
        });
        if(!injury) throw new BadRequestException('No se encontró la lesión o inactividad');
        return injury;
    }

    // Servicio para obtener una lesión dependiendo del grado de severidad
    async findBySeverity(fighterId: number, severity: InjurySeverity){
        if(!severity) throw new BadRequestException('Debe especificar la severidad de la lesión');
        // Se obtienen las lesiones o inactividades
        const injuries = await this.prisma.fighterInjuries.findMany({
            where: {fighter_id: fighterId, severity_injury: severity}
        });
        if(!injuries) throw new BadRequestException('No se encontraron las lesiones o inactividades');
        return injuries;
    }

    // Servicio para actualizar las lesiones o inactividades de un luchador
    async update(injuryId: number, data: UpdateInjuryDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que la lesión o inactividad existe
        const existingInjury = await this.findById(injuryId);
        if(!existingInjury) throw new BadRequestException('No se encontró la lesión o inactividad');
        // Si existe, se actualiza la lesión o inactividad
        const injury = await this.prisma.fighterInjuries.update({
            where: {id: injuryId},
            data: data
        });
        if(!injury) throw new BadRequestException('No se pudo actualizar la lesión o inactividad');
        return injury;
    }

    // Servicio para cambiar el estado de una lesión o inactividad
    async changeStatus(injuryId: number, isActive: boolean){
        // Se verifica que la lesión o inactividad existe
        const existingInjury = await this.findById(injuryId);
        if(!existingInjury) throw new BadRequestException('No se encontró la lesión o inactividad');
        // Se actualiza el estado de la lesión o inactividad
        const injury = await this.prisma.fighterInjuries.update({
            where: {id: injuryId},
            data: {is_active: isActive}
        });
        if(!injury) throw new BadRequestException('No se pudo actualizar la lesión o inactividad');
        return injury;
    }

    // Servicio para eliminar una lesión o inactividad
    async delete(injuryId: number){
        // Se verifica que la lesión o inactividad existe
        const existingInjury = await this.findById(injuryId);
        if(!existingInjury) throw new BadRequestException('No se encontró la lesión o inactividad');
        // Se elimina la lesión o inactividad
        const injury = await this.prisma.fighterInjuries.delete({
            where: {id: injuryId}
        });
        if(!injury) throw new BadRequestException('No se pudo eliminar la lesión o inactividad');
        return injury;
    }
}