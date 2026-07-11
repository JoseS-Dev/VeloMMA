import { BonusType } from '../../../../generated/prisma/index.js'
import {z} from 'zod';

// Defino el esquema de validación a la hora de crear los bonos de las peleas
const SchemaBonusCreate = z.object({
    bout_id: z.number().nonnegative().positive(),
    fighter_id: z.number().nonnegative().positive(),
    bonus_type: z.enum(BonusType)
});

// Defino el esquema de validación a la hora de actualizar los bonos de las peleas
const SchemaBonusUpdate = SchemaBonusCreate.partial();

export type BonusSchemaDTO = z.infer<typeof SchemaBonusCreate>;
export type BonusUpdateSchemaDTO = z.infer<typeof SchemaBonusUpdate>;

// Función que valida los datos a la hora de crear los bonos de las peleas
export function validateBonusData(data: BonusSchemaDTO){
    return SchemaBonusCreate.safeParse(data);
}

// Función que valida los datos a la hora de actualizar los bonos de las peleas
export function validateBonusUpdateData(data: BonusUpdateSchemaDTO){
    return SchemaBonusUpdate.safeParse(data);
}