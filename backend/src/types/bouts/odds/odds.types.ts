// Defino la interfaz para la creación de una casa de apuesta para una pelea
export interface CreateBoutOddsDTO {
    bout_id: number;
    red_opening_odds: number;
    blue_opening_odds: number;
    red_closing_odds: number;
    blue_closing_odds: number;
    provider: string;
}

// Defino la interfaz para la actualización de una casa de apuesta para una pelea
export interface UpdateBoutOddsDTO extends Partial<CreateBoutOddsDTO> {}