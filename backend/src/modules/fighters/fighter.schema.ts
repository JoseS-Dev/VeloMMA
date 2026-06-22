import { z } from 'zod';
import type { FighterDTO, FighterUpdateDTO } from '../../types/index.js';
import { Gender, Stance } from '../../../generated/prisma/enums.js';

// Esquema de validación de los datos de un luchador
export const fighterSchema = z.object({
    first_name: z.string().min(2).max(50),
    last_name: z.string().min(2).max(50),
    nickname: z.string().min(2).max(50).optional(),
    birth_date: z.coerce.date().optional(),
    gender: z.enum(Gender).optional(),
    nationality: z.string().min(2).max(50).optional(),
    height: z.number().min(0).max(300).optional(),
    weight: z.number().min(0).max(300).optional(),
    stance: z.enum(Stance).optional(),
});

// Esquema de validación de los datos de actualización de un luchador
export const fighterUpdateSchema = fighterSchema.extend({
    is_active: z.boolean().optional(),
});

// Función para validar los datos de un luchador
export function validateFighter(fighter: FighterDTO) {
    return fighterSchema.safeParse(fighter)
}

// Función para validar los datos de actualización de un luchador
export function validateFighterUpdate(fighter: FighterUpdateDTO) {
    return fighterUpdateSchema.safeParse(fighter)
}