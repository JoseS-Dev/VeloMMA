import { z } from 'zod';

// Defino el esquema de validación de los equipos de los luchadores
const StableSchema = z.object({
    fighter_id: z.number().nonnegative().positive(),
    team_id: z.number().nonnegative().positive(),
    is_current: z.boolean().optional(),
    joined_date: z.coerce.date().optional(),
    left_date: z.coerce.date().optional(),
});

// Defino el esquema de validación para actualizar los equipos de los luchadores
const updateStableSchema = StableSchema.partial()

export type StableSchemaDTO = z.infer<typeof StableSchema>;
export type UpdateStableSchemaDTO = z.infer<typeof updateStableSchema>;

// Validacion de los equipos de los luchadores
export function validateStable(data: StableSchemaDTO){
    return StableSchema.safeParse(data);
}

// Validacion para actualizar los equipos de los luchadores
export function validateUpdateStable(data: UpdateStableSchemaDTO){
    return updateStableSchema.safeParse(data);
}