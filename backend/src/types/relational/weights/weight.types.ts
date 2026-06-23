// Defino la interfaz de los pesos oficiales de un luchador
export interface WeightDTO {
    fighter_id: number;
    division_id: number;
    is_current?: boolean;
}

// Defino la interfaz para actualizar los pesos oficiales de un luchador
export interface UpdateWeightDTO {
    fighter_id?: number;
    division_id?: number;
    is_current?: boolean;
}