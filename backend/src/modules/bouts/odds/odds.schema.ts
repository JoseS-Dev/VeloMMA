import { z } from 'zod';

// Defino el esquema de validación para la creación de una casa de apuesta para una pelea
const SchemaCreateBoutOddsDTO = z.object({
    bout_id: z.number().int().positive(),
    red_opening_odds: z.number(),
    blue_opening_odds: z.number(),
    red_closing_odds: z.number(),
    blue_closing_odds: z.number(),
    provider: z.string().min(1),
});

// Defino el esquema de validación para la actualización de una casa de apuesta para una pelea
const SchemaUpdateBoutOddsDTO = SchemaCreateBoutOddsDTO.partial();

export type CreateBoutOddsSchemaDTO = z.infer<typeof SchemaCreateBoutOddsDTO>;
export type UpdateBoutOddsSchemaDTO = z.infer<typeof SchemaUpdateBoutOddsDTO>;

// Función para validar los datos de creación de una casa de apuesta para una pelea
export function validateCreateBoutOddsDTO(data: CreateBoutOddsSchemaDTO) {
    return SchemaCreateBoutOddsDTO.safeParse(data);
}

// Función para validar los datos de actualización de una casa de apuesta para una pelea
export function validateUpdateBoutOddsDTO(data: UpdateBoutOddsSchemaDTO) {
    return SchemaUpdateBoutOddsDTO.safeParse(data);
}