import { BonusType } from "../../../../generated/prisma/index.js";

// Defino la interfaz de la tabla de bonos de una pelea
export interface BonusDTO {
    bout_id: number;
    fighter_id: number;
    bonus_type: BonusType;
}

// Defino la interfaz de la tabla de bonos de una pelea
export interface BonusUpdateDTO extends Partial<BonusDTO> {}