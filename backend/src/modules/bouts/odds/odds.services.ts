import type { CreateBoutOddsSchemaDTO, UpdateBoutOddsSchemaDTO } from './odds.schema.js';
import type { PrismaClient } from "../../../../generated/prisma/index.js";
import { BadRequestException, NotFoundException } from "../../../common/errors/error.js";

// Servicio que interactua con la tabla de casas de apuestas para una pelea
export class OddsService {
    constructor(private readonly prisma: PrismaClient) {}

    // Servicio para crear una casa de apuesta para una pelea
    async create(data: CreateBoutOddsSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la pelea en cuestión
        const existingBout = await this.prisma.bouts.findUnique({
            where: { id: data.bout_id }
        });
        if(!existingBout) throw new NotFoundException('No existe la pelea en cuestión');
        // Se crea la casa de apuesta para la pelea
        const Odds = await this.prisma.boutOdds.create({
            data: data
        });
        if(!Odds) throw new BadRequestException('No se pudo crear la casa de apuesta para la pelea');
        return Odds;
    }

    // Servicio para obtener todas las casas de apuestas para una pelea
    async findAll(
        boutId: number,
        page: number = 1,
        limit: number = 10
    ){
        if(!boutId) throw new BadRequestException('El ID de la pelea es obligatorio');
        // Se verifica que exista la pelea en cuestión
        const existingBout = await this.prisma.bouts.findUnique({
            where: { id: boutId, deleted_at: null }
        });
        if(!existingBout) throw new NotFoundException('No existe la pelea en cuestión');
        // Se obtienen todas las casas de apuestas para dicha pelea
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros para la pelea
        const total = await this.prisma.boutOdds.count({
            where: { bout_id: boutId, deleted_at: null }
        });
        const Odds = await this.prisma.boutOdds.findMany({
            where: { bout_id: boutId, deleted_at: null },
            skip: skip,
            take: limit,
            orderBy: { created_at: 'desc' }
        });
        return {
            total,
            Odds
        }
    }

    // Servicio para obtener todas las casas de apuestas de un proveedor en común
    async findAllByProvider(
        provider: string,
        page: number = 1,
        limit: number = 10
    ){
        if(!provider) throw new BadRequestException('El proveedor es obligatorio');
        // Se obtienen todas las casas de apuestas para dicho proveedor
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros para el proveedor
        const total = await this.prisma.boutOdds.count({
            where: { provider: provider, deleted_at: null }
        });
        const Odds = await this.prisma.boutOdds.findMany({
            where: { provider: provider, deleted_at: null },
            skip: skip,
            take: limit,
            orderBy: { created_at: 'desc' }
        });
        return {
            total,
            Odds
        }
    }

    // Servicio para obtener una casa de apuesta en específico
    async findById(oddsId: number){
        if(!oddsId) throw new BadRequestException('El ID de la casa de apuesta es obligatorio');
        // Se verifica que exista la casa de apuesta en cuestión
        const existingOdds = await this.prisma.boutOdds.findUnique({
            where: { id: oddsId, deleted_at: null }
        });
        if(!existingOdds) throw new NotFoundException('No existe la casa de apuesta en cuestión');
        return existingOdds;
    }

    // Servicio para actualizar una casa de apuesta en común
    async update(oddsId: number, data: UpdateBoutOddsSchemaDTO){
        if(!oddsId) throw new BadRequestException('El ID de la casa de apuesta es obligatorio');
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la casa de apuesta en cuestión
        const existingOdds = await this.findById(oddsId);
        if(!existingOdds) throw new NotFoundException('No existe la casa de apuesta en cuestión');
        // Se actualiza la casa de apuesta en cuestión
        const updatedOdds = await this.prisma.boutOdds.update({
            where: { id: oddsId },
            data: data
        });
        if(!updatedOdds) throw new BadRequestException('No se pudo actualizar la casa de apuesta en cuestión');
        return updatedOdds;
    }

    // Servicio para eliminar una casa de apuesta por su ID (soft delete)
    async delete(oddsId: number){
        if(!oddsId) throw new BadRequestException('El ID de la casa de apuesta es obligatorio');
        // Se verifica que exista la casa de apuesta en cuestión
        const existingOdds = await this.findById(oddsId);
        if(!existingOdds) throw new NotFoundException('No existe la casa de apuesta en cuestión');
        // Se elimina la casa de apuesta en cuestión (soft delete)
        const deletedOdds = await this.prisma.boutOdds.update({
            where: { id: oddsId },
            data: { deleted_at: new Date() }
        });
        if(!deletedOdds) throw new BadRequestException('No se pudo eliminar la casa de apuesta en cuestión');
        return deletedOdds;
    }
}