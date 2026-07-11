import { z } from 'zod';

// Defino el esquema de validación de los pesajes oficiales de los luchadores para la pelea
const SchemaWeighIns = z.object({
    bout_id: z.number().nonnegative().positive(),
    fighter_id: z.number().nonnegative().positive(),
    weight_recorded: z.number(),
    missed_weight: z.boolean()
});

// Defino el esquema de validación de los pesajes oficiales de los luchadores para la pelea a la hora de ser actaulizadas
const SchemaWeighInsUpdate = SchemaWeighIns.partial();

export type WeighInsSchemaDTO = z.infer<typeof SchemaWeighIns>;
export type WeighInsUpdateSchemaDTO = z.infer<typeof SchemaWeighInsUpdate>;

// Defino la función que valida los datos de los pesajes oficiales de los luchadores para la pelea
export function validateWeighInsData(data: WeighInsSchemaDTO){
    return SchemaWeighIns.safeParse(data);
}

// Defino la función que valida los datos de los pesajes oficiales de los luchadores para la pelea a la hora de ser actaulizadas
export function validateWeighInsUpdateData(data: WeighInsUpdateSchemaDTO){
    return SchemaWeighInsUpdate.safeParse(data);
}