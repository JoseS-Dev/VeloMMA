import type { EventSchemaDTO, UpdateEventSchemaDTO } from './event.schema.js';
import type { ExtendedPrismaClient } from '../../utils/prisma/prisma.js';
import { BadRequestException, ConflictException } from '../../common/errors/error.js';
// Servicio para obtener todos los eventos
export class EventService {
    constructor(private prisma: ExtendedPrismaClient) {}

    // Crear un nuevo evento
    async create(data: EventSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que no exista un evento con el mismo nombre
        const existingEvent = await this.prisma.events.findFirst({
            where: {name_event: data.name_event}
        });
        if(existingEvent) throw new ConflictException('Ya existe un evento con ese nombre');
        // Si no existe, se crea el evento
        const event = await this.prisma.events.create({
            data: data
        });
        if(!event) throw new BadRequestException('No se pudo crear el evento');
        return event;
    }

    // Servicio para obtener todos los eventos
    async findAll(
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros
        const total = await this.prisma.events.count();
        // Se obtienen los eventos
        const events = await this.prisma.events.findMany({
            skip: skip,
            take: limit,
            orderBy: {created_at: 'asc'}
        });
        return {
            events, 
            total: total
        };
    }

    // Servicio para obtener todos los eventos activos
    async findAllActive(
        page: number = 1,
        limit: number = 10,
    ){
        const skip = (page - 1) * limit;
        // Se cuenta el total de registros
        const total = await this.prisma.events.count();
        // Se obtienen los eventos activos
        const events = await this.prisma.events.findMany({
            skip: skip,
            take: limit,
            where: {is_active: true, deleted_at: null},
            orderBy: {name_event: 'asc'}
        });
        return {
            events, 
            total: total
        };
    }

    // Servicio para obtener los datos de un evento por su id
    async findById(eventId: number){
        const event = await this.prisma.events.findUnique({
            where: {id: eventId, deleted_at: null}
        });
        if(!event) throw new BadRequestException('No se encontró el evento');
        return event;
    }

    // Servicio para obtener tdos los eventos de una locación en especifico
    async findByLocation(location: string){
        const events = await this.prisma.events.findMany({
            where: {location_event: location, deleted_at: null}
        });
        if(!events) throw new BadRequestException('No se encontraron eventos en esa locación');
        return events;
    }

    // Servicio para actualizar los datos de un evento
    async update(eventId: number, data: UpdateEventSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que el evento existe
        const existingEvent = await this.findById(eventId);
        if(!existingEvent) throw new BadRequestException('No se encontró el evento');
        // Se verifica que no exista un evento con el mismo nombre
        if(data.name_event && data.name_event !== existingEvent.name_event){
            const existingEventName = await this.prisma.events.findFirst({
                where: {name_event: data.name_event}
            });
            if(existingEventName) throw new ConflictException('Ya existe un evento con ese nombre');
            // Si no existe, se actualiza el evento
            const event = await this.prisma.events.update({
                where: {id: eventId},
                data: data
            });
            if(!event) throw new BadRequestException('No se pudo actualizar el evento');
            return event;
        }
        const event = await this.prisma.events.update({
            where: {id: eventId},
            data: data
        });
        if(!event) throw new BadRequestException('No se pudo actualizar el evento');
        return event;
    }

    // Servicio para cambiar el estado de un evento
    async changeStatus(eventId: number, isActive: boolean){
        // Se verifica que el evento existe
        const existingEvent = await this.findById(eventId);
        if(!existingEvent) throw new BadRequestException('No se encontró el evento');
        // Se actualiza el estado del evento
        const event = await this.prisma.events.update({
            where: {id: eventId},
            data: {is_active: isActive}
        });
        if(!event) throw new BadRequestException('No se pudo actualizar el evento');
        return event;
    }

    // Servicio para eliminar un evento
    async delete(eventId: number){
        // Se verifica que el evento existe
        const existingEvent = await this.findById(eventId);
        if(!existingEvent) throw new BadRequestException('No se encontró el evento');
        // Se elimina el evento
        const event = await this.prisma.events.update({
            where: {id: eventId},
            data: {deleted_at: new Date()}
        });
        if(!event) throw new BadRequestException('No se pudo eliminar el evento');
        return event;
    }
}