import type { WeighInsSchemaDTO, WeighInsUpdateSchemaDTO } from "./weighIns.schema.js";
import type { ExtendedPrismaClient } from "../../../utils/prisma/prisma.js";
import { BadRequestException, NotFoundException } from "../../../common/errors/error.js";

// Modelo que interactua con la tabla weighIns de la base de datos
export class WeighInsService {
    constructor(private readonly prisma: ExtendedPrismaClient) {}

    // Servicio para agregar un pesaje oficial de un luchador para una pelea
    async create(data: WeighInsSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la pelea y el luchador antes de crear el pesaje
        const [existingBout, existingFighter] = await Promise.all([
            this.prisma.bouts.findUnique({
                where: {id: data.bout_id}
            }),
            this.prisma.fighters.findUnique({
                where: {id: data.fighter_id}
            })
        ]);
        if(!existingBout) throw new NotFoundException('No existe dicha pelea');
        if(!existingFighter) throw new NotFoundException('No existe dicho luchador');
        // Si existe, se crea el pesaje
        const newWeighIn = await this.prisma.boutWeighIns.create({
            data: data
        });
        if(!newWeighIn) throw new BadRequestException('No se pudo crear el pesaje');
        return newWeighIn;
    }

    // Servicio para obtener todos los pesajes oficiales
    async findAll(
        page: number = 1,
        limit: number = 10
    ){
        // Se obtiene todos los pesajes
        const skip = (page - 1) * limit;
        // Se cuenta el numero el total de pesajes
        const total = await this.prisma.boutWeighIns.count();
        // Se Obtiene los pesajes
        const weighIns = await this.prisma.boutWeighIns.findMany({
            where: {deleted_at: null},
            skip: skip,
            take: limit
        });
        return {
            weighIns,
            total: total
        }
    }

    // Servicio para obtener los pesajes oficiales de una pelea
    async findByBoutId(boutId: number){
        if(!boutId) throw new BadRequestException('El id de la pelea es obligatorio');
        // Se verifica que exista la pelea en cuestión
        const existingBout = await this.prisma.bouts.findUnique({
            where: {id: boutId, deleted_at: null}
        });
        if(!existingBout) throw new NotFoundException('No existe dicha pelea');
        // Si existe, se obtiene todos los pesajes
        const weighIns = await this.prisma.boutWeighIns.findMany({
            where: {bout_id: boutId, deleted_at: null},
            orderBy: {created_at: 'asc'}
        });
        return weighIns;
    }

    // Servicio para obtener el pesaje oficial de un luchador por su id
    async findById(id: number){
        if(!id) throw new BadRequestException('El id del pesaje es obligatorio');
        const weighIn = await this.prisma.boutWeighIns.findUnique({
            where: {id: id, deleted_at: null}
        });
        if(!weighIn) throw new NotFoundException('No existe dicho pesaje');
        return weighIn;
    }

    // Servicio para actualizar un pesaje oficial de una pelea
    async update(id: number, data: WeighInsUpdateSchemaDTO){
        if(!id) throw new BadRequestException('El id del pesaje es obligatorio');
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista el pesaje en cuestión
        const existingWeighIn = await this.findById(id);
        if(!existingWeighIn) throw new NotFoundException('No existe dicho pesaje');
        // Si existe, se actualiza el pesaje
        const updatedWeighIn = await this.prisma.boutWeighIns.update({
            where: {id: id},
            data: data
        });
        if(!updatedWeighIn) throw new BadRequestException('No se pudo actualizar el pesaje');
        return updatedWeighIn;
    }

    // Servicio para eliminar un pesaje oficial de una pelea
    async delete(id: number){
        if(!id) throw new BadRequestException('El id del pesaje es obligatorio');
        // Se verifica que exista el pesaje en cuestión
        const existingWeighIn = await this.findById(id);
        if(!existingWeighIn) throw new NotFoundException('No existe dicho pesaje');
        // Si existe, se elimina el pesaje
        const deletedWeighIn = await this.prisma.boutWeighIns.update({
            where: {id: id},
            data: {deleted_at: new Date()}
        });
        if(!deletedWeighIn) throw new BadRequestException('No se pudo eliminar el pesaje');
        return deletedWeighIn;
    }
}