import type { CreateCampDTO, UpdateCampDTO } from '../../../types/index.js';
import type { PrismaClient } from '../../../../generated/prisma/index.js';
import { BadRequestException, NotFoundException, ConflictException } from '../../../common/errors/error.js';

// Servicio que interactua con la tabla de campamentos donde entreno un luchador para una pelea
export class CampService {
    constructor(private readonly prisma: PrismaClient) {}
    
    // Servicio para crear un campamento donde entreno un luchador para una pelea
    async create(data: CreateCampDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la pelea, equipo y luchador en cuestión
        const [existingBout, existingTeam, existingFighter, existingCamp] = await Promise.all([
            this.prisma.bouts.findUnique({
                where: { id: data.bout_id }
            }),
            this.prisma.teams.findUnique({
                where: { id: data.team_id }
            }),
            this.prisma.fighters.findUnique({
                where: { id: data.fighter_id }
            }),
            this.prisma.trainingCamps.findFirst({
                where: {
                    bout_id: data.bout_id,
                    team_id: data.team_id,
                    fighter_id: data.fighter_id,
                }
            })
        ]);
        if(!existingBout) throw new NotFoundException('No existe la pelea en cuestión');
        if(!existingTeam) throw new NotFoundException('No existe el equipo en cuestión');
        if(!existingFighter) throw new NotFoundException('No existe el luchador en cuestión');
        if(existingCamp) throw new ConflictException('El campamento ya existe');
        // Si todo esta ien, se crea el campamento donde entreno un luchador para una pelea
        const camp = await this.prisma.trainingCamps.create({
            data: data
        });
        if(!camp) throw new BadRequestException('No se pudo crear el campamento donde entreno un luchador para una pelea');
        return camp;
    }

    // Servicio para obtener todos los campamentos donde ha estado un luchador
    async findAllByFighter(
        fighterId: number,
        page: number = 1,
        limit: number = 10
    ){
        if(!fighterId) throw new BadRequestException('El ID del luchador es obligatorio');
        // Se verifica que exista el luchador en cuestión
        const existingFighter = await this.prisma.fighters.findUnique({
            where: { id: fighterId, deleted_at: null }
        });
        if(!existingFighter) throw new NotFoundException('No existe el luchador en cuestión');
        // Se obtienen todos los campamentos donde ha estado el luchador
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros para el luchador
        const total = await this.prisma.trainingCamps.count({
            where: { fighter_id: fighterId, deleted_at: null }
        });
        const camps = await this.prisma.trainingCamps.findMany({
            where: { fighter_id: fighterId, deleted_at: null },
            skip: skip,
            take: limit,
            orderBy: { created_at: 'desc' }
        });
        return {
            total,
            camps
        }
    }

    // Servicio para obtener todos los campamentos de un equipo
    async findAllByTeam(
        teamId: number,
        page: number = 1,
        limit: number = 10
    ){
        if(!teamId) throw new BadRequestException('El ID del equipo es obligatorio');
        // Se verifica que exista el equipo en cuestión
        const existingTeam = await this.prisma.teams.findUnique({
            where: { id: teamId, deleted_at: null }
        });
        if(!existingTeam) throw new NotFoundException('No existe el equipo en cuestión');
        // Se obtienen todos los campamentos del equipo
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros para el equipo
        const total = await this.prisma.trainingCamps.count({
            where: { team_id: teamId, deleted_at: null }
        });
        const camps = await this.prisma.trainingCamps.findMany({
            where: { team_id: teamId, deleted_at: null },
            skip: skip,
            take: limit,
            orderBy: { created_at: 'desc' }
        });
        return {
            total,
            camps
        }
    }

    // Servicio para obtener un campamento por su ID
    async findById(campId: number){
        if(!campId) throw new BadRequestException('El ID del campamento es obligatorio');
        // Se verifica que exista el campamento en cuestión
        const existingCamp = await this.prisma.trainingCamps.findUnique({
            where: { id: campId, deleted_at: null }
        });
        if(!existingCamp) throw new NotFoundException('No existe el campamento en cuestión');
        return existingCamp;
    }

    // Servicio para actualizar un campamento donde entreno un luchador para una pelea
    async update(campId: number, data: UpdateCampDTO){
        if(!campId) throw new BadRequestException('El ID del campamento es obligatorio');
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista el campamento en cuestión
        const existingCamp = await this.findById(campId);
        if(!existingCamp) throw new NotFoundException('No existe el campamento en cuestión');
        // Se actualiza el campamento donde entreno un luchador para una pelea
        const updatedCamp = await this.prisma.trainingCamps.update({
            where: { id: campId },
            data: data
        });
        if(!updatedCamp) throw new BadRequestException('No se pudo actualizar el campamento donde entreno un luchador para una pelea');
        return updatedCamp;
    }

    // Servicio para eliminar un campamento donde entreno un luchador para una pelea (soft delete)
    async delete(campId: number){
        if(!campId) throw new BadRequestException('El ID del campamento es obligatorio');
        // Se verifica que exista el campamento en cuestión
        const existingCamp = await this.findById(campId);
        if(!existingCamp) throw new NotFoundException('No existe el campamento en cuestión');
        // Se elimina el campamento donde entreno un luchador para una pelea (soft delete)
        const deletedCamp = await this.prisma.trainingCamps.update({
            where: { id: campId },
            data: { deleted_at: new Date() }
        });
        if(!deletedCamp) throw new BadRequestException('No se pudo eliminar el campamento donde entreno un luchador para una pelea');
        return deletedCamp;
    }
}