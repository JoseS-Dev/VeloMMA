import { 
    BoutResult,
    WinMethod,
    BoutStatus,
    SubmissionType 
} from "../../../../generated/prisma/index.js";
// Defino la interfaz para el tipo de datos de las luchas
export interface BoutDTO {
    event_id: number;
    division_id: number;
    red_corner_id: number;
    blue_corner_id: number;
    result?: BoutResult;
    method?: WinMethod;
    submission_type?: SubmissionType;
    rounded_ended?: number;
    time_ended?: number;
    referee?: string;
    is_title_fight?: boolean;
    status_bout?: BoutStatus;
    upset?: boolean;
}

// Defino la interfaz para el tipo de datos de las luchas a la hora de ser actaulizadas
export interface BoutUpdateDTO extends Partial<BoutDTO> {}