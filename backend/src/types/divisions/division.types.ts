import { Gender } from "../../../generated/prisma/index.js";
// Defino la interfaz de las divisiones
export interface DivisionDTO {
    name_division: string;
    weight_class: string
    gender: Gender;
}

// Defino la interfaz para actualizar las divisiones
export interface UpdateDivisionDTO extends Partial<DivisionDTO> {
    is_active?: boolean;
}