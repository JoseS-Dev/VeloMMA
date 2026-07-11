import type { DivisionSchemaDTO, UpdateDivisionSchemaDTO } from './division.schema.js';
import type { ExtendedPrismaClient } from '../../utils/prisma/prisma.js';
import { 
    BadRequestException,
    ConflictException 
} from '../../common/errors/error.js';

// Servicio para obtener todas las divisiones
export class DivisionService {
    constructor(private prisma: ExtendedPrismaClient) {}

    // Crear una nueva division
    async create(data: DivisionSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que no exista una division con el mismo nombre
        const existingDivision = await this.prisma.divisions.findFirst({
            where: {name_division: data.name_division}
        });
        if(existingDivision) throw new ConflictException('Ya existe una division con ese nombre');
        // Si no existe, se crea la division
        const division = await this.prisma.divisions.create({
            data: data
        });
        if(!division) throw new BadRequestException('No se pudo crear la division');
        return division;
    }

    // Servicio para obtener todas las divisiones
    async findAll(
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros
        const total = await this.prisma.divisions.count();
        // Se obtienen las divisiones
        const divisions = await this.prisma.divisions.findMany({
            skip: skip,
            take: limit,
            orderBy: {name_division: 'asc'}
        });
        return {
            divisions, 
            total: total
        };
    }

    async findAllActive(
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros
        const total = await this.prisma.divisions.count();
        // Se obtienen las divisiones
        const divisions = await this.prisma.divisions.findMany({
            skip: skip,
            take: limit,
            where: {is_active: true, deleted_at: null},
            orderBy: {name_division: 'asc'}
        });
        return {
            divisions, 
            total: total
        };
    }

    // Servicio para obtener una division por su id
    async findById(divisionId: number){
        const division = await this.prisma.divisions.findUnique({
            where: {id: divisionId, deleted_at: null}
        });
        if(!division) throw new BadRequestException('No se encontró la division');
        return division;
    }

    // Servicio para actualizar las divisiones
    async update(divisionId: number, data: UpdateDivisionSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que la division existe
        const existingDivision = await this.findById(divisionId);
        if(!existingDivision) throw new BadRequestException('No se encontró la division');
        // Se verifica que no exista una division con el mismo nombre
        if(data.name_division && data.name_division !== existingDivision.name_division){
            const existingDivisionName = await this.prisma.divisions.findFirst({
                where: {name_division: data.name_division}
            });
            if(existingDivisionName) throw new ConflictException('Ya existe una division con ese nombre');
            // Si no existe, se actualiza la division
            const division = await this.prisma.divisions.update({
                where: {id: divisionId},
                data: data
            });
            if(!division) throw new BadRequestException('No se pudo actualizar la division');
            return division;
        }
        const division = await this.prisma.divisions.update({
            where: {id: divisionId},
            data: data
        });
        if(!division) throw new BadRequestException('No se pudo actualizar la division');
        return division;
    }

    // Servicio para cambiar el estado de una division
    async changeStatus(divisionId: number, isActive: boolean){
        if(!divisionId) throw new BadRequestException('El id es obligatorio')
        if(typeof isActive !== 'boolean') throw new BadRequestException('El estado no es un booleano')
        // Se verifica que la division existe
        const existingDivision = await this.findById(divisionId);
        if(!existingDivision) throw new BadRequestException('No se encontró la division');
        // Se actualiza el estado de la division
        const division = await this.prisma.divisions.update({
            where: {id: divisionId},
            data: {is_active: isActive}
        });
        if(!division) throw new BadRequestException('No se pudo actualizar la division');
        return division;
    }

    // Servicio para eliminar una division
    async delete(divisionId: number){
        // Se verifica que la division existe
        const existingDivision = await this.findById(divisionId);
        if(!existingDivision) throw new BadRequestException('No se encontró la division');
        // Se elimina la division
        const division = await this.prisma.divisions.update({
            where: {id: divisionId},
            data: {deleted_at: new Date()}
        });
        if(!division) throw new BadRequestException('No se pudo eliminar la division');
        return division;
    }
}