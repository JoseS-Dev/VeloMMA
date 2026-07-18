import type { Response, Request } from 'express';
import { EventService } from './event.services.js';
import { validateEvent, validateUpdateEvent } from './event.schema.js';
import { SendResponse, PaginationFor, buildPaginationMeta } from '../../common/decorator/decorator.js';

// Controlador para los eventos
export class EventController {
    constructor(private eventService: EventService) {}

    // Controlador para crear un nuevo evento
    @SendResponse('Evento creado correctamente', 201)
    async create(req: Request, res: Response) {
        const validation = validateEvent(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const event = await this.eventService.create(validation.data);
        return event;
    }

    // Controlador para obtener todos los eventos
    @PaginationFor('cursor')
    @SendResponse('Eventos obtenidos correctamente', 200)
    async findAll(req: Request, res: Response) {
        const { cursor, limit } = req.pagination!;
        const { events, nextCursor, total } = await this.eventService.findAll(cursor, limit);
        return { 
            data: events,
            meta: buildPaginationMeta(req.pagination!, total, events.length, nextCursor)
        };
    }

    // Controlador para obtener todos los eventos activos
    @PaginationFor('cursor')
    @SendResponse('Eventos obtenidos correctamente', 200)
    async findAllActive(req: Request, res: Response) {
        const { cursor, limit } = req.pagination!;
        const { events, total } = await this.eventService.findAllActive(cursor, limit);
        return { 
            data: events,
            meta: buildPaginationMeta(req.pagination!, total, events.length)
        };
    }

    // Controlador para obtener un evento por su id
    @SendResponse('Evento obtenido correctamente', 200)
    async findById(req: Request, res: Response) {
        const {eventId} = req.params;
        const event = await this.eventService.findById(Number(eventId));
        return event;
    }

    // Controlador para obtener los eventos de una locación en especifico
    @SendResponse('Eventos obtenidos correctamente', 200)
    async findByLocation(req: Request, res: Response) {
        const {location} = req.params;
        const events = await this.eventService.findByLocation(String(location));
        return events;
    }

    // Controlador para actualizar los datos de un evento
    @SendResponse('Evento actualizado correctamente', 200)
    async update(req: Request, res: Response) {
        const {eventId} = req.params;
        const validation = validateUpdateEvent(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const event = await this.eventService.update(Number(eventId), validation.data);
        return event;
    }

    // Controlador para cambiar el estado de un evento
    @SendResponse('Evento actualizado correctamente', 200)
    async changeStatus(req: Request, res: Response) {
        const {eventId} = req.params;
        const {isActive} = req.body;
        if(typeof isActive !== 'boolean') return res.status(400).json({message: 'El parámetro isActive debe ser un booleano'});
        const event = await this.eventService.changeStatus(Number(eventId), Boolean(isActive));
        return event;
    }

    // Controlador para eliminar un evento
    @SendResponse('Evento eliminado correctamente', 200)
    async delete(req: Request, res: Response) {
        const {eventId} = req.params;
        const event = await this.eventService.delete(Number(eventId));
        return event;
    }
}