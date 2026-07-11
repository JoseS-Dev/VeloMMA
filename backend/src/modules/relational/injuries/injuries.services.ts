import type { InjurySchemaDTO, UpdateInjurySchemaDTO } from './injuries.schema.js';
import { InjurySeverity } from '../../../../generated/prisma/index.js';
import type { ExtendedPrismaClient } from '../../../utils/prisma/prisma.js';
import { BadRequestException, NotFoundException } from '../../../common/errors/error.js';
import { buildQueryOptions } from '../../../utils/functions/function.js';

// Servicio para obtener todas las lesiones o inactividades de un luchador
export class InjuryService {
    constructor(private prisma: ExtendedPrismaClient) {}

    // Crear una nueva lesión o inactividad de un luchador
    async create(data: InjurySchemaDTO){
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
        cursor?: number,
        limit: number = 10,
    ){
        if(!FighterId) throw new BadRequestException('El id del luchador es obligatorio');
        // Se verifica que exista el luchador
        const existingFighter = await this.prisma.fighters.findFirst({
            where: {id: FighterId}
        });
        if(!existingFighter) throw new NotFoundException('No se encontró el luchador');
        // Se calcula el offset para la paginación
        const queryOptions = buildQueryOptions({ cursor, limit, where: { fighter_id: FighterId } });
        // Se cuenta el total de registros
        const total = await this.prisma.fighterInjuries.count({
            where: {fighter_id: FighterId}
        });
        // Se obtienen las lesiones o inactividades
        const injuries = await this.prisma.fighterInjuries.findMany(queryOptions);
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
        if(!injury) throw new NotFoundException('No se encontró la lesión o inactividad');
        return injury;
    }

    // Servicio para obtener una lesión dependiendo del grado de severidad
    async findBySeverity(fighterId: number, severity: InjurySeverity){
        if(!severity) throw new BadRequestException('Debe especificar la severidad de la lesión');
        if(!fighterId) throw new BadRequestException('El id del luchador es obligatorio');
        // Se verifica que exista el luchador
        const existingFighter = await this.prisma.fighters.findFirst({
            where: {id: fighterId}
        });
        if(!existingFighter) throw new NotFoundException('No se encontró el luchador');
        // Se obtienen las lesiones o inactividades
        const injuries = await this.prisma.fighterInjuries.findMany({
            where: {fighter_id: fighterId, severity_injury: severity, deleted_at: null}
        });
        return injuries;
    }

    // Servicio para actualizar las lesiones o inactividades de un luchador
    async update(injuryId: number, data: UpdateInjurySchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que la lesión o inactividad existe
        const existingInjury = await this.findById(injuryId);
        if(!existingInjury) throw new NotFoundException('No se encontró la lesión o inactividad');
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
        if(!injuryId) throw new BadRequestException('El id es obligatorio');
        if(typeof isActive !== 'boolean') throw new BadRequestException('El estado es obligatorio');
        // Se verifica que la lesión o inactividad existe
        const existingInjury = await this.findById(injuryId);
        if(!existingInjury) throw new NotFoundException('No se encontró la lesión o inactividad');
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
        if(!existingInjury) throw new NotFoundException('No se encontró la lesión o inactividad');
        // Se elimina la lesión o inactividad
        const injury = await this.prisma.fighterInjuries.update({
            where: {id: injuryId},
            data: {deleted_at: new Date()}
        });
        if(!injury) throw new BadRequestException('No se pudo eliminar la lesión o inactividad');
        return injury;
    }
}