import { z } from 'zod';

// Defino el esquema de validación de los pesos de los luchadores
const WeightSchema = z.object({
    fighter_id: z.number().nonnegative().positive(),
    division_id: z.number().nonnegative().positive(),
    is_current: z.boolean().optional(),
})

// Defino el esquema de validación para actualizar los pesos de los luchadores
const updateWeightSchema = WeightSchema.partial()

export type WeightSchemaDTO = z.infer<typeof WeightSchema>;
export type UpdateWeightSchemaDTO = z.infer<typeof updateWeightSchema>;

// Validacion de los pesos de los luchadores
export function validateWeight(data: WeightSchemaDTO){
    return WeightSchema.safeParse(data);
}

// Validacion para actualizar los pesos de los luchadores
export function validateUpdateWeight(data: UpdateWeightSchemaDTO){
    return updateWeightSchema.safeParse(data);
}