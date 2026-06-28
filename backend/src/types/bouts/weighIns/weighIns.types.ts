// Defino la interfaz de los pesajes oficiales de una pelea
export interface WeighInsDTO {
    bout_id: number;
    fighter_id: number;
    weight_recorded: number;
    missed_weight: boolean;
}

// Defino la interfaz de los pesajes oficiales de una pelea a la hora de ser actaulizadas
export interface WeighInsUpdateDTO extends Partial<WeighInsDTO> {}