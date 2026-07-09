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

export type TitleSchemaDTO = z.infer<typeof SchemaTitle>;
export type UpdateTitleSchemaDTO = z.infer<typeof SchemaUpdateTitle>;

// Función para validar un objeto TitleSchemaDTO
export function validateTitleDTO(data: TitleSchemaDTO){
    return SchemaTitle.safeParse(data);
}

// Función para validar un objeto UpdateTitleDTO
export function validateUpdateTitleDTO(data: UpdateTitleSchemaDTO){
    return SchemaUpdateTitle.safeParse(data);
}