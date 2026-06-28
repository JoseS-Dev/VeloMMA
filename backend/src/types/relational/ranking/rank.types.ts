// Defino la interfaz de la tabla de clasificaciones de los luchadores
export interface RankingDTO {
    fighter_id: number;
    division_id: number;
    rank: number;
    as_of_date: Date;
}

// Defino la interfaz de la tabla de clasificaciones de los luchadores
export interface RankingUpdateDTO extends Partial<RankingDTO> {}