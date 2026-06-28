
// Defino la interfaz de las métricas de una pelea
export interface MetricDTO {
    bout_id: number;
    fighter_id: number;
    round: number;
    sig_strikes_landed: number;
    sig_strikes_attempted: number;
    total_strikes_landed: number;
    total_strikes_attempted: number;
    head_strikes_landed: number;
    body_strikes_landed: number;
    leg_strikes_landed: number;
    takedowns_landed: number;
    takedowns_attempted: number;
    submissions_landed: number;
    reversals: number;
    control_time: number;
    knockdowns: number;
}

// Defino la interfaz de las métricas de una pelea a la hora de ser actaulizadas
export interface MetricUpdateDTO extends Partial<MetricDTO> {}