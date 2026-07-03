import type { CreateBoutOddsDTO, UpdateBoutOddsDTO } from '../../../types/index.js';
import { z } from 'zod';

// Defino el esquema de validación para la creación de una casa de apuesta para una pelea
const SchemaCreateBoutOddsDTO = z.object({
    bout_id: z.number().int().positive(),
    red_opening_odds: z.number().positive(),
    blue_opening_odds: z.number().positive(),
    red_closing_odds: z.number().positive(),
    blue_closing_odds: z.number().positive(),
    provider: z.string().min(1),
});

// Defino el esquema de validación para la actualización de una casa de apuesta para una pelea
const SchemaUpdateBoutOddsDTO = SchemaCreateBoutOddsDTO.partial();

// Función para validar los datos de creación de una casa de apuesta para una pelea
export function validateCreateBoutOddsDTO(data: CreateBoutOddsDTO) {
    return SchemaCreateBoutOddsDTO.safeParse(data);
}

// Función para validar los datos de actualización de una casa de apuesta para una pelea
export function validateUpdateBoutOddsDTO(data: UpdateBoutOddsDTO) {
    return SchemaUpdateBoutOddsDTO.safeParse(data);
}