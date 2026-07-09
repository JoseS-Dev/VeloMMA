import { z } from "zod";

// Defino el esquema para la creación de una clasificación de un luchador
const SchemaCreateRanking = z.object({
    fighter_id: z.number(),
    division_id: z.number(),
    rank: z.number().positive(),
    as_of_date: z.coerce.date()
});

// Defino el esquema para actualizar una clasificación de un luchador
const SchemaUpdateRanking = SchemaCreateRanking.partial();

export type RankingSchemaDTO = z.infer<typeof SchemaCreateRanking>;
export type RankingUpdateSchemaDTO = z.infer<typeof SchemaUpdateRanking>;

// Función para validar la creación de una clasificación de un luchador
export function validateRankingData(data: RankingSchemaDTO){
    return SchemaCreateRanking.safeParse(data);
}

// Función para validar la actualización de una clasificación de un luchador
export function validateRankingUpdateData(data: RankingUpdateSchemaDTO){
    return SchemaUpdateRanking.safeParse(data);
}