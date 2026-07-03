// Defino la interfaz para la creación de una campamento doonde entreno un luchador para una pelea
export interface CreateCampDTO {
    bout_id: number;
    team_id: number;
    fighter_id: number;
}

// Defino la interfaz para la actualización de un campamento donde entreno un luchador para una pelea
export interface UpdateCampDTO extends Partial<CreateCampDTO> {}