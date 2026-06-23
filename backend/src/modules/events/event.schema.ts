import {z} from 'zod';
import type { EventDTO, UpdateEventDTO } from '../../types/events/event.types.js';

// Defino el esquema de validación de los datos de un evento
const eventSchema = z.object({
    name_event: z.string().min(3).max(50).trim(),
    date_event: z.coerce.date(),
    location_event: z.string().min(3).max(50).trim(),
    venue_event: z.string().min(3).max(50).trim().optional(),
    octagon_size: z.number().min(1).max(100).optional(),
});

// Defino el esquema de validación para actualizar los datos de un evento
const updateEventSchema = eventSchema.extend({
    is_active: z.boolean().optional(),
});

// Validacion de los eventos
export function validateEvent(data: EventDTO){
    return eventSchema.safeParse(data);
}

// Validacion para actualizar los eventos
export function validateUpdateEvent(data: UpdateEventDTO){
    return updateEventSchema.safeParse(data);
}