import { TitleType } from "../../../../generated/prisma/index.js";
// Defino la interfaz para los titulos de un peleador en una divisiòn de peso
export interface TitleDTO {
    division_id: number;
    fighter_id: number;
    title_type: TitleType;
    won_date: Date;
    lost_date?: Date;
}

// Defino la interfaz para actualizar de un titulo de una división
export interface UpdateTitleDTO extends Partial<TitleDTO> {}