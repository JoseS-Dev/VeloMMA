import type { BoutSchemaDTO, BoutUpdateSchemaDTO } from "./bout.schema.js";
import type { ExtendedPrismaClient } from "../../../utils/prisma/prisma.js";
import { BadRequestException, NotFoundException } from "../../../common/errors/error.js";
import { BoutStatus } from "../../../../generated/prisma/index.js";
import { BoutStatusRecord } from "../../../utils/functions/function.js";
// Modelo que interactua con la tabla bouts de la base de datos
export class BoutService {
    constructor(private readonly prisma: ExtendedPrismaClient) {}

    // Servicio para crear una pelea
    async create(data: BoutSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la división, el evento y los dos luchadores en cuestión
        const [existingDivision, existingEvent, existingRedFighter, existingBlueFighter] = await Promise.all([
            this.prisma.divisions.findUnique({ where: { id: data.division_id } }),
            this.prisma.events.findUnique({ where: { id: data.event_id } }),
            this.prisma.fighters.findUnique({ where: { id: data.red_corner_id } }),
            this.prisma.fighters.findUnique({ where: { id: data.blue_corner_id } })
        ]);
        if(!existingDivision) throw new NotFoundException('No existe la división');
        if(!existingEvent) throw new NotFoundException('No existe el evento');
        if(!existingRedFighter) throw new NotFoundException('No existe el luchador rojo');
        if(!existingBlueFighter) throw new NotFoundException('No existe el luchador azul');
        // Si todo esta bien, se crea la pelea
        const newBout = await this.prisma.bouts.create({
            data: data
        });
        if(!newBout) throw new BadRequestException('No se pudo crear la pelea');
        return newBout;
    }

    // Servicio para obtener todas las peleas
    async findAll(
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de peleas
        const total = await this.prisma.bouts.count();
        // Se obtienen las peleas
        const bouts = await this.prisma.bouts.findMany({
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
        return {
            bouts,
            total: total
        }
    }

    // Servicio para obtener todas las peleas de un evento
    async findAllByEvent(
        eventId: number,
        page: number = 1,
        limit: number = 10,
    ){
        if(!eventId) throw new BadRequestException('El id del evento es obligatorio');
        // Se verifica que exista el evento
        const existingEvent = await this.prisma.events.findUnique({
            where: { id: eventId }
        });
        if(!existingEvent) throw new NotFoundException('No existe el evento');
        const skip = (page - 1) * limit;
        // Se cuenta el total de peleas
        const total = await this.prisma.bouts.count({
            where: { event_id: eventId }
        });
        // Se obtienen las peleas
        const bouts = await this.prisma.bouts.findMany({
            where: { event_id: eventId },
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
        return {
            bouts,
            total: total
        }
    }

    // Servicio para obtener todas las peleas de una división de peso
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
        // Se cuenta el total de peleas
        const total = await this.prisma.bouts.count({
            where: { division_id: divisionId }
        });
        // Se obtienen las peleas
        const bouts = await this.prisma.bouts.findMany({
            where: { division_id: divisionId },
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
        return {
            bouts,
            total: total
        }
    }

    // Servicio para obtener una pelea por su ID
    async findById(BoutId: number){
        if(!BoutId) throw new BadRequestException('El id de la pelea es obligatorio');
        // Se verifica que exista la pelea
        const existingBout = await this.prisma.bouts.findUnique({
            where: { id: BoutId }
        });
        if(!existingBout) throw new NotFoundException('No existe la pelea');
        return existingBout;
    }
    

    // Servicio para actualizar una pelea por su ID
    async update(BoutId: number, data: BoutUpdateSchemaDTO){
        if(!BoutId) throw new BadRequestException('El id de la pelea es obligatorio');
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la pelea
        const existingBout = await this.findById(BoutId);
        if(!existingBout) throw new NotFoundException('No existe la pelea');
        // Se actualiza la pelea
        const updatedBout = await this.prisma.bouts.update({
            where: { id: BoutId },
            data: data
        });
        if(!updatedBout) throw new BadRequestException('No se pudo actualizar la pelea');
        return updatedBout;
    }

    // Servicio para cambiar el estado de una pelea por su ID
    async changeStatus(BoutId: number, status: BoutStatus){
        if(!BoutId) throw new BadRequestException('El id de la pelea es obligatorio');
        if(!status) throw new BadRequestException('El estado de la pelea es obligatorio');
        // Se verifica que exista la pelea
        const existingBout = await this.findById(BoutId);
        if(!existingBout) throw new NotFoundException('No existe la pelea');
        const currentStatus = existingBout.status_bout;
        // Valido si el estado es el mismo
        if(currentStatus === status) return existingBout;
        // Valido la transición de estado
        const allowedTransitions = BoutStatusRecord[currentStatus];
        if(!allowedTransitions?.includes(status)) throw new BadRequestException('Estado no permitido');
        // Se actualiza el estado de la pelea
        const updatedBout = await this.prisma.bouts.update({
            where: { id: BoutId },
            data: { status_bout: status }
        });
        if(!updatedBout) throw new BadRequestException('No se pudo actualizar el estado de la pelea');
        return updatedBout;
    }

    // Servicio para eliminar una pelea por su ID
    async delete(BoutId: number){
        if(!BoutId) throw new BadRequestException('El id de la pelea es obligatorio');
        // Se verifica que exista la pelea
        const existingBout = await this.findById(BoutId);
        if(!existingBout) throw new NotFoundException('No existe la pelea');
        // Se elimina la pelea
        const deletedBout = await this.prisma.bouts.update({
            where: { id: BoutId },
            data: {deleted_at: new Date()}
        });
        if(!deletedBout) throw new BadRequestException('No se pudo eliminar la pelea');
        return deletedBout;
    }
}