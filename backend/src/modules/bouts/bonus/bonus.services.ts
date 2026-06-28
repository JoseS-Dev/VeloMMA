import type { BonusDTO, BonusUpdateDTO } from "../../../types/index.js";
import type { PrismaClient } from "../../../../generated/prisma/index.js";
import { BadRequestException, NotFoundException } from "../../../common/errors/error.js";

// Modelo que interactua con la tabla de bonos de una pelea
export class BonusService {
    constructor(private prisma: PrismaClient) {}

    // Servicio para agregar un bono a una pelea
    async create(data: BonusDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la pelea y el luchador con sus bonos
        const [existingBout, existingFighter] = await Promise.all([
            this.prisma.bouts.findUnique({ where: { id: data.bout_id } }),
            this.prisma.fighters.findUnique({ where: { id: data.fighter_id } })
        ]);
        if(!existingBout) throw new NotFoundException('No existe la pelea');
        if(!existingFighter) throw new NotFoundException('No existe el luchador');
        // Se agrega el bono
        const newBonus = await this.prisma.boutBonuses.create({
            data: data
        });
        if(!newBonus) throw new BadRequestException('No se pudo agregar el bono');
        return newBonus;
    }

    // Servicio para obtener todos los bonos recibidos
    async findAll(
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de bonos
        const total = await this.prisma.boutBonuses.count();
        // Se obtienen los bonos
        const bonuses = await this.prisma.boutBonuses.findMany({
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
        return {
            bonuses,
            total: total
        }
    }

    // Servicio para obtener todos los bonos recibidos por un luchador
    async findAllByFighter(
        fighterId: number,
        page: number = 1,
        limit: number = 10,
    ){
        if(!fighterId) throw new BadRequestException('El id del luchador es obligatorio');
        // Se verifica que exista el luchador
        const existingFighter = await this.prisma.fighters.findUnique({
            where: { id: fighterId }
        });
        if(!existingFighter) throw new NotFoundException('No existe el luchador');
        const skip = (page - 1) * limit;
        // Se cuenta el total de bonos
        const total = await this.prisma.boutBonuses.count({
            where: { fighter_id: fighterId }
        });
        // Se obtienen los bonos
        const bonuses = await this.prisma.boutBonuses.findMany({
            where: { fighter_id: fighterId },
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
        return {
            bonuses,
            total: total
        }
    }

    // Servicio para obtener un bono por su ID
    async findById(bonusId: number){
        if(!bonusId) throw new BadRequestException('El id del bono es obligatorio');
        // Se verifica que exista el bono
        const existingBonus = await this.prisma.boutBonuses.findUnique({
            where: { id: bonusId }
        });
        if(!existingBonus) throw new NotFoundException('No existe el bono');
        return existingBonus;
    }

    // Servicio para actualizar un bono por su ID
    async update(bonusId: number, data: BonusUpdateDTO){
        if(!bonusId) throw new BadRequestException('El id del bono es obligatorio');
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista el bono
        const existingBonus = await this.findById(bonusId);
        if(!existingBonus) throw new NotFoundException('No existe el bono');
        // Se actualiza el bono
        const updatedBonus = await this.prisma.boutBonuses.update({
            where: { id: bonusId },
            data: data
        });
        if(!updatedBonus) throw new BadRequestException('No se pudo actualizar el bono');
        return updatedBonus;
    }

    // Servicio para eliminar un bono por su ID
    async delete(bonusId: number){
        if(!bonusId) throw new BadRequestException('El id del bono es obligatorio');
        // Se verifica que exista el bono
        const existingBonus = await this.findById(bonusId);
        if(!existingBonus) throw new NotFoundException('No existe el bono');
        // Se elimina el bono
        const deletedBonus = await this.prisma.boutBonuses.delete({
            where: { id: bonusId }
        });
        if(!deletedBonus) throw new BadRequestException('No se pudo eliminar el bono');
        return deletedBonus;
    }


}