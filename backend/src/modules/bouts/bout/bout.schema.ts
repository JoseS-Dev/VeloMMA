import { 
    BoutResult,
    WinMethod,
    BoutStatus,
    SubmissionType 
} from "../../../../generated/prisma/index.js";
import { z } from "zod";

// Defino el esquema de validación para la creación de una pelea
const SchemaBoutDTO = z.object({
    event_id: z.number().int().positive(),
    division_id: z.number().int().positive(),
    red_corner_id: z.number().int().positive(),
    blue_corner_id: z.number().int().positive(),
    result: z.enum(BoutResult).nullish(),
    method: z.enum(WinMethod).nullish(),
    submission_type: z.enum(SubmissionType).nullish(),
    rounded_ended: z.number().int().positive().nullish(),
    time_ended: z.number().nullish(),
    referee: z.string().nullish(),
    is_title_fight: z.boolean().optional(),
    upset: z.boolean().optional(),
    status_bout: z.enum(BoutStatus).optional()
});

// Defino el esquema de validación para actualizar una pelea
const SchemaBoutUpdateDTO = SchemaBoutDTO.partial();

export type BoutSchemaDTO = z.infer<typeof SchemaBoutDTO>;
export type BoutUpdateSchemaDTO = z.infer<typeof SchemaBoutUpdateDTO>;

// Función que valida los datos a la hora de crear una pelea
export function validateBoutDTO(data: BoutSchemaDTO){
    return SchemaBoutDTO.safeParse(data);
}

// Función que valida los datos a la hora de actualizar una pelea
export function validateBoutUpdateDTO(data: BoutUpdateSchemaDTO){
    return SchemaBoutUpdateDTO.safeParse(data);
}