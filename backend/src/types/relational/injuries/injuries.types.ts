import { InjurySeverity } from "../../../../generated/prisma/index.js";
// Defino la interfaz de las lesiones o inactividades de un luchador
export interface InjuryDTO {
    fighter_id: number;
    description_injury: string;
    severity_injury: InjurySeverity;
    injury_date?: Date;
    recovery_date?: Date;
}

// Defino la interfaz para actualizar las lesiones o inactividades de un luchador
export interface UpdateInjuryDTO extends InjuryDTO {
    is_active?: boolean;
}