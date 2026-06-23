import type { WeightDTO, UpdateWeightDTO } from '../../../types/relational/weights/weight.types.js';
import { z } from 'zod';

// Defino el esquema de validación de los pesos de los luchadores
const WeightSchema = z.object({
    fighter_id: z.number().nonnegative().positive(),
    division_id: z.number().nonnegative().positive(),
    is_current: z.boolean().optional(),
})

// Defino el esquema de validación para actualizar los pesos de los luchadores
const updateWeightSchema = WeightSchema.extend({
    fighter_id: z.number().nonnegative().positive().optional(),
    division_id: z.number().nonnegative().positive().optional(),
    is_current: z.boolean().optional(),
});

// Validacion de los pesos de los luchadores
export function validateWeight(data: WeightDTO){
    return WeightSchema.safeParse(data);
}

// Validacion para actualizar los pesos de los luchadores
export function validateUpdateWeight(data: UpdateWeightDTO){
    return updateWeightSchema.safeParse(data);
}