import type { TitleDTO, UpdateTitleDTO } from "../../../types/index.js";
import { TitleType } from "../../../../generated/prisma/index.js";
import { z } from "zod";

// Defino el esquema de validación para los titulos de un luchador en una divsión
const SchemaTitle = z.object({
    division_id: z.number().int().positive(),
    fighter_id: z.number().int().positive(),
    title_type: z.enum(TitleType),
    won_date: z.coerce.date(),
    lost_date: z.coerce.date().optional(),
});

// Defino el esquema de validación para actualizar un titulo de un luchador en una división
const SchemaUpdateTitle = SchemaTitle.partial();

// Función para validar un objeto TitleDTO
export function validateTitleDTO(data: TitleDTO){
    return SchemaTitle.safeParse(data);
}

// Función para validar un objeto UpdateTitleDTO
export function validateUpdateTitleDTO(data: UpdateTitleDTO){
    return SchemaUpdateTitle.safeParse(data);
}