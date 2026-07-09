import {z} from 'zod';

// Defino el esquema de validación de los datos de un equipo
const teamSchema = z.object({
    name_team: z.string().min(3).max(50).trim(),
    description_team: z.string().min(3).max(500).trim().optional(),
    date_founded: z.coerce.date().optional(),
    location: z.string().min(3).max(50).trim(),
});

// Defino el esquema de validación para actualizar los datos de un equipo
const updateTeamSchema = teamSchema.partial().extend({
    is_active: z.boolean().optional(),
});

export type TeamSchemaDTO = z.infer<typeof teamSchema>;
export type UpdateTeamSchemaDTO = z.infer<typeof updateTeamSchema>;

// Defino la función que valida los datos de un equipo
export function validateTeam(data: TeamSchemaDTO){
    return teamSchema.safeParse(data);
}

// Defino la función que valida los datos para actualizar los datos de un equipo
export function validateUpdateTeam(data: UpdateTeamSchemaDTO){
    return updateTeamSchema.safeParse(data);
}