import {z} from 'zod';
import { Gender } from '../../../generated/prisma/index.js';
// Defino el esquema de validación de las divisiones
const DivisionSchema = z.object({
    name_division: z.string().min(3).max(50).trim(),
    weight_class: z.string().min(3).max(50).trim(),
    gender: z.enum(Gender)
});

// Defino el esquema de validación para actualizar las divisiones
const updateDivisionSchema = DivisionSchema.partial().extend({
    is_active: z.boolean().optional(),
});

export type DivisionSchemaDTO = z.infer<typeof DivisionSchema>;
export type UpdateDivisionSchemaDTO = z.infer<typeof updateDivisionSchema>;

// Validacion de las divisiones
export function validateDivision(data: DivisionSchemaDTO){
    return DivisionSchema.safeParse(data);
}

// Validacion para actualizar las divisiones
export function validateUpdateDivision(data: UpdateDivisionSchemaDTO){
    return updateDivisionSchema.safeParse(data);
}

