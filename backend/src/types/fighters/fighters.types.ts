import { Gender, Stance } from "../../../generated/prisma/index.js";
// Defino la interfaz de los luchadores
export interface FighterDTO {
    first_name: string;
    last_name: string;
    nickname?: string;
    birth_date?: Date;
    gender?: Gender;
    nationality?: string;
    height?: number;
    weight?: number;
    stance?: Stance;
    reach?: number;
}

// Defino la interfaz pra actualizar los datos de un luchador
export interface FighterUpdateDTO extends Partial<FighterDTO> {
    is_active?: boolean;
}