import type { RankingDTO, RankingUpdateDTO } from "../../../types/index.js";
import { z } from "zod";

// Defino el esquema para la creación de una clasificación de un luchador
const SchemaCreateRanking = z.object({
    fighter_id: z.number(),
    division_id: z.number(),
    rank: z.number(),
    as_of_date: z.date()
});

// Defino el esquema para actualizar una clasificación de un luchador
const SchemaUpdateRanking = SchemaCreateRanking.partial();

// Función para validar la creación de una clasificación de un luchador
export function validateRankingData(data: RankingDTO){
    return SchemaCreateRanking.safeParse(data);
}

// Función para validar la actualización de una clasificación de un luchador
export function validateRankingUpdateData(data: RankingUpdateDTO){
    return SchemaUpdateRanking.safeParse(data);
}