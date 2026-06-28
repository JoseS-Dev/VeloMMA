import type { JudgesDTO, JudgesUpdateDTO } from "../../../types/index.js";
import {  z } from 'zod';

// Defino el esquema de los jueces de una pelea
const SchemaJudge = z.object({
    bout_id: z.number().nonnegative().positive(),
    judge_name: z.string().min(1).max(50),
    red_score: z.number(),
    blue_score: z.number()
});

// Defino el esquema de los jueces de una pelea a la hora de ser actaulizadas
const SchemaJudgeUpdate = SchemaJudge.partial();

// Defino la función que valida los datos del jueces de la pelea
export function validateJudgeData(data: JudgesDTO){
    return SchemaJudge.safeParse(data);
}

// Defino la función que valida los datos del jueces de la pelea a la hora de ser actaulizadas
export function validateJudgeUpdateData(data: JudgesUpdateDTO){
    return SchemaJudgeUpdate.safeParse(data);
}