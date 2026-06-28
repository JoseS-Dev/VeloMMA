import type { JudgesDTO, JudgesUpdateDTO } from '../../../types/bouts/judges/judges.types.js';
import type { PrismaClient } from '../../../../generated/prisma/index.js';
import { BadRequestException, NotFoundException } from '../../../common/errors/error.js';

// Modelo que interactua con la tabla judges de la base de datos
export class JudgeService {
    constructor(private readonly prisma: PrismaClient) {}

    // Servicio para crear un juez a una pelea
    async create(data: JudgesDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la pelea en cuestión
        const existingBout = await this.prisma.bouts.findUnique({
            where: {id: data.bout_id}
        });
        if(!existingBout) throw new NotFoundException('No existe dicha pelea');
        // Si existe la pelea, se asigna el respectivo juez
        const newJudge = await this.prisma.boutJudges.create({
            data: data
        });
        if(!newJudge) throw new BadRequestException('No se pudo crear el juez');
        return newJudge;
    }

    // Servicio para obtener todos los jueces de una pelea
    async findAll(
        boutId: number,
        page: number = 1,
        limit: number = 10
    ){
        if(!boutId) throw new BadRequestException('El id de la pelea es obligatorio');
        // Se verifica que exista la pelea en cuestión
        const existingBout = await this.prisma.bouts.findUnique({
            where: {id: boutId}
        });
        if(!existingBout) throw new NotFoundException('No existe dicha pelea');
        // Si existe, se obtiene todos los jueces
        const skip = (page - 1) * limit;
        // Se cuenta el numero el total de jueces de esa pelea
        const total = await this.prisma.boutJudges.count({
            where: {bout_id: boutId}
        });
        // Se Obtiene los jueces
        const judges = await this.prisma.boutJudges.findMany({
            skip: skip,
            take: limit,
            where: {bout_id: boutId}
        });
        return {
            judges,
            total: total
        }
    }

    // Servicio para obtener el resultado de  un juez por su id
    async findById(id: number){
        if(!id) throw new BadRequestException('El id del juez es obligatorio');
        const judge = await this.prisma.boutJudges.findUnique({
            where: {id: id}
        });
        if(!judge) throw new NotFoundException('No existe dicho juez');
        return judge;
    }

    // Servicio para actualizar un juez de una pelea por su Id
    async update(id: number, data: JudgesUpdateDTO){
        if(!id) throw new BadRequestException('El id del juez es obligatorio');
        // Se verifcia que exista el resultado del juez
        const existingJudge = await this.findById(id);
        if(!existingJudge) throw new NotFoundException('No existe dicho juez');
        // Se actualiza el juez
        const updatedJudge = await this.prisma.boutJudges.update({
            where: {id: id},
            data: data
        });
        if(!updatedJudge) throw new BadRequestException('No se pudo actualizar el juez');
        return updatedJudge;
    }

    // Servicio para eliminar un juez de una pelea por su Id
    async delete(id: number){
        if(!id) throw new BadRequestException('El id del juez es obligatorio');
        // Se verifcia que exista el resultado del juez
        const existingJudge = await this.findById(id);
        if(!existingJudge) throw new NotFoundException('No existe dicho juez');
        // Se elimina el juez
        const deletedJudge = await this.prisma.boutJudges.delete({
            where: {id: id}
        });
        if(!deletedJudge) throw new BadRequestException('No se pudo eliminar el juez');
        return deletedJudge;
    }
}