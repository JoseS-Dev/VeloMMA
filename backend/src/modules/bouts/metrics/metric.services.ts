import type { MetricSchemaDTO, MetricUpdateSchemaDTO } from './metric.schema.js';
import type { ExtendedPrismaClient } from '../../../utils/prisma/prisma.js';
import { BadRequestException, NotFoundException } from "../../../common/errors/error.js";

// Modelo que interactua con la tabla de métricas de una pelea
export class MetricService {
    constructor(private prisma: ExtendedPrismaClient) {}

    // Servicio para agregar una métrica a una pelea
    async create(data: MetricSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la pelea y el luchador con sus metricas
        const [existingBout, existingFighter] = await Promise.all([
            this.prisma.bouts.findUnique({ where: { id: data.bout_id } }),
            this.prisma.fighters.findUnique({ where: { id: data.fighter_id } })
        ]);
        if(!existingBout) throw new NotFoundException('No existe la pelea');
        if(!existingFighter) throw new NotFoundException('No existe el luchador');
        // Se agrega la métrica
        const newMetric = await this.prisma.boutMetrics.create({
            data: data
        });
        if(!newMetric) throw new BadRequestException('No se pudo agregar la métrica');
        return newMetric;
    }

    // Servicio para obtener todas las métricas de una pelea
    async findAll(
        BoutId: number,
        page: number = 1,
        limit: number = 10,
    ){
        if(!BoutId) throw new BadRequestException('El id de la pelea es obligatorio');
        // Se verifica que exista la pelea
        const existingBout = await this.prisma.bouts.findUnique({
            where: { id: BoutId }
        });
        if(!existingBout) throw new NotFoundException('No existe la pelea');
        const skip = (page - 1) * limit;
        // Se cuenta el total de métricas
        const total = await this.prisma.boutMetrics.count({
            where: { bout_id: BoutId }
        });
        // Se obtienen las métricas
        const metrics = await this.prisma.boutMetrics.findMany({
            where: { bout_id: BoutId },
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
        return {
            metrics,
            total: total
        }
    }

    // Servicio para obtener las metricas de un lucahdor en un round en especifico de una pelea
    async findAllByFighter(
        BoutId: number,
        fighterId: number,
        round: number,
    ){
        if(!BoutId) throw new BadRequestException('El id de la pelea es obligatorio');
        if(!fighterId) throw new BadRequestException('El id del luchador es obligatorio');
        if(!round) throw new BadRequestException('El round es obligatorio');
        // Se verifica que exista la pelea y el luchador con sus metricas
        const [existingBout, existingFighter] = await Promise.all([
            this.prisma.bouts.findUnique({ where: { id: BoutId } }),
            this.prisma.fighters.findUnique({ where: { id: fighterId } })
        ]);
        if(!existingBout) throw new NotFoundException('No existe la pelea');
        if(!existingFighter) throw new NotFoundException('No existe el luchador');
        // Se obtienen las métricas
        const metrics = await this.prisma.boutMetrics.findMany({
            where: { bout_id: BoutId, fighter_id: fighterId, round: round },
            orderBy: {
                created_at: 'desc'
            }
        });
        return metrics;
    }

    // Servicio para obtener una métrica por su ID
    async findById(MetricId: number){
        if(!MetricId) throw new BadRequestException('El id de la métrica es obligatorio');
        // Se verifica que exista la métrica
        const existingMetric = await this.prisma.boutMetrics.findUnique({
            where: { id: MetricId }
        });
        if(!existingMetric) throw new NotFoundException('No existe la métrica');
        return existingMetric;
    }

    // Servicio para actualizar una métrica por su ID
    async update(MetricId: number, data: MetricUpdateSchemaDTO){
        if(!MetricId) throw new BadRequestException('El id de la métrica es obligatorio');
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista la métrica
        const existingMetric = await this.findById(MetricId);
        if(!existingMetric) throw new NotFoundException('No existe la métrica');
        // Se actualiza la métrica
        const updatedMetric = await this.prisma.boutMetrics.update({
            where: { id: MetricId },
            data: data
        });
        if(!updatedMetric) throw new BadRequestException('No se pudo actualizar la métrica');
        return updatedMetric;
    }

    // Servicio para eliminar una métrica por su ID
    async delete(MetricId: number){
        if(!MetricId) throw new BadRequestException('El id de la métrica es obligatorio');
        // Se verifica que exista la métrica
        const existingMetric = await this.findById(MetricId);
        if(!existingMetric) throw new NotFoundException('No existe la métrica');
        // Se elimina la métrica
        const deletedMetric = await this.prisma.boutMetrics.update({
            where: { id: MetricId },
            data: {deleted_at: new Date()}
        });
        if(!deletedMetric) throw new BadRequestException('No se pudo eliminar la métrica');
        return deletedMetric;
    }
}