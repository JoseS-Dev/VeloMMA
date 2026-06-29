import type { StableDTO, UpdateStableDTO } from '../../../types/relational/stables/stable.types.js';
import { z } from 'zod';

// Defino el esquema de validación de los equipos de los luchadores
const StableSchema = z.object({
    fighter_id: z.number().nonnegative().positive(),
    team_id: z.number().nonnegative().positive(),
    is_current: z.boolean(),
    joined_date: z.coerce.date().optional(),
    left_date: z.coerce.date().optional(),
});

// Defino el esquema de validación para actualizar los equipos de los luchadores
const updateStableSchema = StableSchema.partial()

// Validacion de los equipos de los luchadores
export function validateStable(data: StableDTO){
    return StableSchema.safeParse(data);
}

// Validacion para actualizar los equipos de los luchadores
export function validateUpdateStable(data: UpdateStableDTO){
    return updateStableSchema.safeParse(data);
}