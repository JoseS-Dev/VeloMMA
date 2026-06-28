// Defino la interfaz para los jueces de una pelea
export interface JudgesDTO {
    bout_id: number;
    judge_name: string;
    red_score: number;
    blue_score: number;
}

// Defino la interfaz para los jueces de una pelea a la hora de ser actaulizadas
export interface JudgesUpdateDTO extends Partial<JudgesDTO> {}