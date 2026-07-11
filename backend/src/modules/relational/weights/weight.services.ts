import type { WeightSchemaDTO, UpdateWeightSchemaDTO } from './weight.schema.js';
import type { ExtendedPrismaClient } from '../../../utils/prisma/prisma.js';
import { BadRequestException, NotFoundException, ConflictException } from '../../../common/errors/error.js';

// Servicio para obtener todos los pesos de los luchadores
export class WeightService {
    constructor(private prisma: ExtendedPrismaClient) {}

    // Crear un nuevo peso para un luchador
    async create(data: WeightSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista el luchador, la división y que no exista una relación
        const [existingFighter, existingDivision, existingWeight] = await Promise.all([
            this.prisma.fighters.findFirst({
                where: {id: data.fighter_id}
            }),
            this.prisma.divisions.findFirst({
                where: {id: data.division_id}
            }),
            this.prisma.fighterDivision.findFirst({
                where: {
                    fighter_id: data.fighter_id,
                    division_id: data.division_id
                }
            })
        ]);
        if(!existingFighter) throw new NotFoundException('No se encontró el luchador');
        if(!existingDivision) throw new NotFoundException('No se encontró la división');
        if(existingWeight) throw new ConflictException('El luchador ya pertence a dicho peso');
        // Si existe, se crea el peso
        const weight = await this.prisma.fighterDivision.create({
            data: data
        });
        if(!weight) throw new BadRequestException('No se pudo crear el peso');
        return weight;
    }

    // Servicio para obtener todos los pesos de los luchadores
    async findAll(
        FighterId: number,
        page: number = 1,
        limit: number = 10,
    ) {
        if(!FighterId) throw new BadRequestException('El ID del luchador es obligatorio')
        // Se verifica que exista el luchador en cuestión
        const existingFighter = await this.prisma.fighters.findUnique({
            where: {id: FighterId}
        });
        if(!existingFighter) throw new NotFoundException('El luchador no existen')
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros
        const total = await this.prisma.fighterDivision.count({
            where: {fighter_id: FighterId}
        });
        // Se obtienen los pesos
        const weights = await this.prisma.fighterDivision.findMany({
            where: {fighter_id: FighterId, deleted_at: null},
            skip: skip,
            take: limit,
            orderBy: {created_at: 'asc'}
        });
        return {
            weights, 
            total: total
        };
    }

    // Servicio para obtener un peso de un luchador por su id
    async findById(weightId: number){
        const weight = await this.prisma.fighterDivision.findUnique({
            where: {id: weightId, deleted_at: null}
        });
        if(!weight) throw new NotFoundException('No se encontró el peso');
        return weight;
    }

    // Servicio para actualizar los pesos de los luchadores
    async update(weightId: number, data: UpdateWeightSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que el peso existe
        const existingWeight = await this.findById(weightId);
        if(!existingWeight) throw new NotFoundException('No se encontró el peso');
        // Si existe, se actualiza el peso
        const weight = await this.prisma.fighterDivision.update({
            where: {id: weightId},
            data: data
        });
        if(!weight) throw new BadRequestException('No se pudo actualizar el peso');
        return weight;
    }

    // Servicio para eliminar un peso de un luchador
    async delete(weightId: number){
        // Se verifica que el peso existe
        const existingWeight = await this.findById(weightId);
        if(!existingWeight) throw new NotFoundException('No se encontró el peso');
        // Se elimina el peso
        const weight = await this.prisma.fighterDivision.update({
            where: {id: weightId},
            data: {deleted_at: new Date()}
        });
        if(!weight) throw new BadRequestException('No se pudo eliminar el peso');
        return weight;
    }
}