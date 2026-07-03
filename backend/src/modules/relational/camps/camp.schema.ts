import type { CreateCampDTO, UpdateCampDTO } from "../../../types/index.js";
import { z } from "zod";

// Defino el esquema de validación para la creación de un campamento donde entreno un luchador para una pelea
const SchemaCreateCampDTO = z.object({
    bout_id: z.number().int().positive(),
    team_id: z.number().int().positive(),
    fighter_id: z.number().int().positive(),
});

// Defino el esquema de validación para la actualización de un campamento donde entreno un luchador para una pelea
const SchemaUpdateCampDTO = SchemaCreateCampDTO.partial();

// Función para validar los datos de creación de un campamento donde entreno un luchador para una pelea
export function validateCreateCampDTO(data: CreateCampDTO) {
    return SchemaCreateCampDTO.safeParse(data);
}

// Función para validar los datos de actualización de un campamento donde entreno un luchador para una pelea
export function validateUpdateCampDTO(data: UpdateCampDTO) {
    return SchemaUpdateCampDTO.safeParse(data);
}