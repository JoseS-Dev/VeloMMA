import { z } from 'zod';
import { Gender, Stance } from '../../../generated/prisma/index.js';

// Esquema de validación de los datos de un luchador
export const fighterSchema = z.object({
    first_name: z.string().min(2).max(50),
    last_name: z.string().min(2).max(50),
    nickname: z.string().min(2).max(50).optional(),
    birth_date: z.string().regex(/Z$/).transform((val) => new Date(val)).optional(),
    gender: z.enum(Gender).optional(),
    nationality: z.string().min(2).max(50).optional(),
    height: z.number().min(0).max(300).optional(),
    weight: z.number().min(0).max(300).optional(),
    stance: z.enum(Stance).optional(),
    reach: z.number().min(0).max(300).optional(),
});

// Esquema de validación de los datos de actualización de un luchador
export const fighterUpdateSchema = fighterSchema.partial().extend({
    is_active: z.boolean().optional(),
});

export type FighterSchemaDTO = z.infer<typeof fighterSchema>;
export type FighterUpdateSchemaDTO = z.infer<typeof fighterUpdateSchema>;

// Función para validar los datos de un luchador
export function validateFighter(fighter: FighterSchemaDTO) {return fighterSchema.safeParse(fighter)}

// Función para validar los datos de actualización de un luchador
export function validateFighterUpdate(fighter: FighterUpdateSchemaDTO) {return fighterUpdateSchema.safeParse(fighter)}