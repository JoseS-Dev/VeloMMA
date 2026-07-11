import { InjurySeverity } from '../../../../generated/prisma/index.js';
import { z } from 'zod';

// Defino el esquema de validación de las lesiones o inactividades de un luchador
const InjurySchema = z.object({
    fighter_id: z.number().nonnegative().positive(),
    description_injury: z.string().min(3).max(500).trim(),
    severity_injury: z.enum(InjurySeverity),
    injury_date: z.string().regex(/Z$/).transform((val) => new Date(val)),
    recovery_date: z.string().regex(/Z$/).transform((val) => new Date(val)).optional(),
});

// Defino el esquema de validación para actualizar las lesiones o inactividades de un luchador
const updateInjurySchema = InjurySchema.partial().extend({
    is_active: z.boolean().optional(),
});

export type InjurySchemaDTO = z.infer<typeof InjurySchema>;
export type UpdateInjurySchemaDTO = z.infer<typeof updateInjurySchema>;

// Validacion de las lesiones o inactividades de un luchador
export function validateInjury(data: InjurySchemaDTO){
    return InjurySchema.safeParse(data);
}

// Validacion para actualizar las lesiones o inactividades de un luchador
export function validateUpdateInjury(data: UpdateInjurySchemaDTO){
    return updateInjurySchema.safeParse(data);
}