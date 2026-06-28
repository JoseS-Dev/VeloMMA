import type { BonusDTO, BonusUpdateDTO } from "../../../types/index.js";
import {
    BonusType
} from '../../../../generated/prisma/index.js'
import {z} from 'zod';

// Defino el esquema de validación a la hora de crear los bonos de las peleas
const SchemaBonusCreate = z.object({
    bout_id: z.number().nonnegative().positive(),
    fighter_id: z.number().nonnegative().positive(),
    bonus_type: z.enum(BonusType)
});

// Defino el esquema de validación a la hora de actualizar los bonos de las peleas
const SchemaBonusUpdate = SchemaBonusCreate.partial();

// Función que valida los datos a la hora de crear los bonos de las peleas
export function validateBonusData(data: BonusDTO){
    return SchemaBonusCreate.safeParse(data);
}

// Función que valida los datos a la hora de actualizar los bonos de las peleas
export function validateBonusUpdateData(data: BonusUpdateDTO){
    return SchemaBonusUpdate.safeParse(data);
}