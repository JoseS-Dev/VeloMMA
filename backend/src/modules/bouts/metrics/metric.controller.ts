import type { Request, Response } from "express";
import { MetricService } from "./metric.services.js";
import { validateMetricData, validateMetricUpdateData } from "./metric.schema.js";
import { SendResponse } from "../../../common/decorator/decorator.js";

// Controlador que interactua con la tabla de métricas de una pelea
export class MetricController {
    constructor(private readonly metricService: MetricService) {}

    // Controlador para agregar una métrica a una pelea
    @SendResponse('Métrica agregada exitosamente', 201)
    async create(req: Request, res: Response){
        const validation = validateMetricData(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.metricService.create(validation.data);
        return result
    }

    // Controlador para obtener todas las metricas de una pelea
    @SendResponse('Métricas obtenidas exitosamente', 200)
    async findAll(req: Request, res: Response){
        const {BoutId} = req.params;
        const {page, limit} = req.query;
        // Se valida los parametros
        if(page && Number.isNaN(Number(page))) return res.status(400).json({message: 'El page debe ser un número'});
        if(limit && Number.isNaN(Number(limit))) return res.status(400).json({message: 'El limit debe ser un número'});
        const result = await this.metricService.findAll(Number(BoutId), Number(page) || 1, Number(limit) || 10);
        return {
            data: result.metrics,
            meta: {
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            }
        }
    }

    // Controlador para obtener las metricas de un luchador en un round en especifico de una pelea
    @SendResponse('Métricas obtenidas exitosamente', 200)
    async findAllByFighter(req: Request, res: Response){
        const {BoutId, fighterId, round} = req.params;
        // Se valida los parametros
        if(Number.isNaN(Number(BoutId))) return res.status(400).json({message: 'El id de la pelea es obligatorio'});
        if(Number.isNaN(Number(fighterId))) return res.status(400).json({message: 'El id del luchador es obligatorio'});
        if(Number.isNaN(Number(round))) return res.status(400).json({message: 'El round es obligatorio'});
        const result = await this.metricService.findAllByFighter(Number(BoutId), Number(fighterId), Number(round));
        return result
    }

    // Controlador para obtener una métrica por su ID
    @SendResponse('Métrica obtenida exitosamente', 200)
    async findById(req: Request, res: Response){
        const {MetricId} = req.params;
        // Se valida los parametros
        if(Number.isNaN(Number(MetricId))) return res.status(400).json({message: 'El id de la métrica es obligatorio'});
        const result = await this.metricService.findById(Number(MetricId));
        return result
    }

    // Controlador para actualizar una métrica por su ID
    @SendResponse('Métrica actualizada exitosamente', 200)
    async update(req: Request, res: Response){
        const {MetricId} = req.params;
        const validation = validateMetricUpdateData(req.body);
        if(!validation.success) return res.status(400).json({message: 'Error de validación', error: validation.error});
        const result = await this.metricService.update(Number(MetricId), validation.data);
        return result
    }

    // Controlador para eliminar una métrica por su ID
    @SendResponse('Métrica eliminada exitosamente', 200)
    async delete(req: Request, res: Response){
        const {MetricId} = req.params;
        // Se valida los parametros
        if(Number.isNaN(Number(MetricId))) return res.status(400).json({message: 'El id de la métrica es obligatorio'});
        const result = await this.metricService.delete(Number(MetricId));
        return result
    }
}

