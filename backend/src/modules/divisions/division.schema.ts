import {z} from 'zod';
import type { DivisionDTO, UpdateDivisionDTO } from '../../types/divisions/division.types.js';
import { Gender } from '../../../generated/prisma/index.js';
// Defino el esquema de validación de las divisiones
const DivisionSchema = z.object({
    name_division: z.string().min(3).max(50).trim(),
    weight_class: z.string().min(3).max(50).trim(),
    gender: z.enum(Gender)
});

// Defino el esquema de validación para actualizar las divisiones
const updateDivisionSchema = DivisionSchema.extend({
    is_active: z.boolean().optional(),
});

// Validacion de las divisiones
export function validateDivision(data: DivisionDTO){
    return DivisionSchema.safeParse(data);
}

// Validacion para actualizar las divisiones
export function validateUpdateDivision(data: UpdateDivisionDTO){
    return updateDivisionSchema.safeParse(data);
}

