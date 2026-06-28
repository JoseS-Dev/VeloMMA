import type { BoutDTO, BoutUpdateDTO } from "../../../types/index.js";
import { 
    BoutResult,
    WinMethod,
    BoutStatus 
} from "../../../../generated/prisma/index.js";
import { z } from "zod";

// Defino el esquema de validación para la creación de una pelea
const SchemaBoutDTO = z.object({
    event_id: z.number().int().positive(),
    division_id: z.number().int().positive(),
    red_corner_id: z.number().int().positive(),
    blue_corner_id: z.number().int().positive(),
    result: z.enum(BoutResult).optional(),
    method: z.enum(WinMethod).optional(),
    rounded_ended: z.number().int().positive().optional(),
    time_ended: z.string().optional(),
    referee: z.string().optional(),
    is_title_fight: z.boolean().optional(),
    status_bout: z.enum(BoutStatus).optional()
});

// Defino el esquema de validación para actualizar una pelea
const SchemaBoutUpdateDTO = SchemaBoutDTO.partial();

// Función que valida los datos a la hora de crear una pelea
export function validateBoutDTO(data: BoutDTO){
    return SchemaBoutDTO.safeParse(data);
}

// Función que valida los datos a la hora de actualizar una pelea
export function validateBoutUpdateDTO(data: BoutUpdateDTO){
    return SchemaBoutUpdateDTO.safeParse(data);
}