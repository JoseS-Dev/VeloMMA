// Defino la interfaz de los equipos
export interface TeamDTO {
    name_team: string;
    description_team?: string;
    date_founded?: Date;
    location: string;
}

// Defino la interfaz para actualizar los datos de un equipo
export interface UpdateTeamDTO extends Partial<TeamDTO> {
    is_active?: boolean;
}