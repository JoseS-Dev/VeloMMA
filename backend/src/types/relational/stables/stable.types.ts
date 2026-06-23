// Defino la interfaz de los equipos de los luchadores
export interface StableDTO {
    fighter_id: number;
    team_id: number;
    is_current: boolean;
    joined_date?: Date;
    left_date?: Date;
}

// Defino la interfaz para actualizar los equipos de los luchadores
export interface UpdateStableDTO extends StableDTO {}