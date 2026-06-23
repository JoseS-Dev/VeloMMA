// Defino la interfaz de los eventos
export interface EventDTO {
    name_event: string;
    date_event: Date;
    location_event: string;
    venue_event?: string;
    octagon_size?: number;
}

// Defino la interfaz para actualizar los datos de un evento
export interface UpdateEventDTO extends EventDTO {
    is_active?: boolean;
}