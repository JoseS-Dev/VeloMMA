import type { RankingSchemaDTO, RankingUpdateSchemaDTO } from './rank.schema.js';
import type { ExtendedPrismaClient } from '../../../utils/prisma/prisma.js';
import { BadRequestException, NotFoundException, ConflictException } from "../../../common/errors/error.js";

// Modelo que interactua con la tabla de clasificaciones de los luchadores
export class RankingService {
    constructor(private prisma: ExtendedPrismaClient) {}

    // Servicio para agregar una clasificación de un luchador
    async create(data: RankingSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la división, el luchador en cuestión y que no exista una relación
        const [existingDivision, existingFighter, existingRanking] = await Promise.all([
            this.prisma.divisions.findUnique({ where: { id: data.division_id } }),
            this.prisma.fighters.findUnique({ where: { id: data.fighter_id } }),
            this.prisma.fighterRankings.findFirst({
                where: {
                    fighter_id: data.fighter_id,
                    division_id: data.division_id
                }
            })
        ]);
        if(!existingDivision) throw new NotFoundException('No existe la división');
        if(!existingFighter) throw new NotFoundException('No existe el luchador');
        if(existingRanking) throw new ConflictException('El luchador ya pertenece a dicha clasificación');
        // Se agrega la clasificación
        const newRanking = await this.prisma.fighterRankings.create({
            data: data
        });
        if(!newRanking) throw new BadRequestException('No se pudo agregar la clasificación');
        return newRanking;
    }

    // Servicio para obtener todas las clasificaciones
    async findAll(
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de clasificaciones
        const total = await this.prisma.fighterRankings.count();
        // Se obtienen las clasificaciones
        const rankings = await this.prisma.fighterRankings.findMany({
            where: {deleted_at: null},
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
        return {
            rankings,
            total: total
        }
    }

    // Servicio para obtener todas las clasificaciones de una división
    async findAllByDivision(
        divisionId: number,
        page: number = 1,
        limit: number = 10,
    ){
        if(!divisionId) throw new BadRequestException('El id de la división es obligatorio');
        // Se verifica que exista la división
        const existingDivision = await this.prisma.divisions.findUnique({
            where: { id: divisionId }
        });
        if(!existingDivision) throw new NotFoundException('No existe la división');
        const skip = (page - 1) * limit;
        // Se cuenta el total de clasificaciones
        const total = await this.prisma.fighterRankings.count({
            where: { division_id: divisionId }
        });
        // Se obtienen las clasificaciones
        const rankings = await this.prisma.fighterRankings.findMany({
            where: { division_id: divisionId, deleted_at: null },
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
        return {
            rankings,
            total: total
        }
    }

    // Servicio para obtener una clasificación por su ID
    async findById(rankingId: number){
        if(!rankingId) throw new BadRequestException('El id de la clasificación es obligatorio');
        // Se verifica que exista la clasificación
        const existingRanking = await this.prisma.fighterRankings.findUnique({
            where: { id: rankingId, deleted_at: null }
        });
        if(!existingRanking) throw new NotFoundException('No existe la clasificación');
        return existingRanking;
    }

    // Servicio para actualizar una clasificación por su ID
    async update(rankingId: number, data: RankingUpdateSchemaDTO){
        if(!rankingId) throw new BadRequestException('El id de la clasificación es obligatorio');
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la clasificación
        const existingRanking = await this.findById(rankingId);
        if(!existingRanking) throw new NotFoundException('No existe la clasificación');
        // Se actualiza la clasificación
        const updatedRanking = await this.prisma.fighterRankings.update({
            where: { id: rankingId },
            data: data
        });
        if(!updatedRanking) throw new BadRequestException('No se pudo actualizar la clasificación');
        return updatedRanking;
    }

    // Servicio para eliminar una clasificación por su ID
    async delete(rankingId: number){
        if(!rankingId) throw new BadRequestException('El id de la clasificación es obligatorio');
        // Se verifica que exista la clasificación
        const existingRanking = await this.findById(rankingId);
        if(!existingRanking) throw new NotFoundException('No existe la clasificación');
        // Se elimina la clasificación
        const deletedRanking = await this.prisma.fighterRankings.update({
            where: { id: rankingId },
            data: {deleted_at: new Date()}
        });
        if(!deletedRanking) throw new BadRequestException('No se pudo eliminar la clasificación');
        return deletedRanking;
    }
}