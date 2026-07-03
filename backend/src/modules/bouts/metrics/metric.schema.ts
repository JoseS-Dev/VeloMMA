import type { MetricDTO, MetricUpdateDTO} from "../../../types/index.js";
import { z } from "zod";

// Defino el esquema de validación de los datos de una métrica
const SchemaMetric = z.object({
    bout_id: z.number(),
    fighter_id: z.number(),
    round: z.number(),
    sig_strikes_landed: z.number().optional(),
    sig_strikes_attempted: z.number().optional(),
    total_strikes_landed: z.number().optional(),
    total_strikes_attempted: z.number().optional(),
    head_strikes_landed: z.number().optional(),
    body_strikes_landed: z.number().optional(),
    leg_strikes_landed: z.number().optional(),
    takedowns_landed: z.number().optional(),
    takedowns_attempted: z.number().optional(),
    submissions_landed: z.number().optional(),
    head_strikes_attempted: z.number().optional(),
    body_strikes_attempted: z.number().optional(),
    leg_strikes_attempted: z.number().optional(),
    distance_strikes_landed: z.number().optional(),
    distance_strikes_attempted: z.number().optional(),
    clinch_strikes_landed: z.number().optional(),
    clinch_strikes_attempted: z.number().optional(),
    ground_strikes_landed: z.number().optional(),
    ground_strikes_attempted: z.number().optional(),
    reversals: z.number().optional(),
    control_time: z.number().optional(),
    knockdowns: z.number().optional(),
});

// Defino el esquema de validación de los datos de una métrica
const SchemaMetricUpdate = SchemaMetric.partial();

// Función para validar los datos de una métrica
export function validateMetricData(data: MetricDTO){
    return SchemaMetric.safeParse(data);
}

// Función para validar los datos de una métrica
export function validateMetricUpdateData(data: MetricUpdateDTO){
    return SchemaMetricUpdate.safeParse(data);
}