import type { PrismaClient } from "../../../../generated/prisma/index.js";
import { BadRequestException, NotFoundException } from "../../../common/errors/error.js";
// Servicio para manejar las estadisticas de un luchador
export class StatsService {
    constructor(private readonly prisma: PrismaClient) {}

    // Servicio para crear o actualizar las estadisticas de un luchador
    async updateFighterCareerStats(fighterId: number){
        if(!fighterId) throw new BadRequestException('El ID del luchador es necesario');
        const existingFighter = await this.prisma.fighters.findUnique({
            where: {id: fighterId}
        });
        if(!existingFighter) throw new NotFoundException('El luchador no existe');
        // Se obtienen todas las metricas del luchador (ofensivas)
        const fighterMetrics = await this.prisma.boutMetrics.findMany({
            where: { fighter_id: fighterId, deleted_at: null },
            include: {
                bout: true
            }
        });

        // Obtenemos las peleas donde en las que participó
        const boutIds = fighterMetrics.map(metric => metric.bout_id);
        // traemos las metricas del openente
        const opponentMetrics = await this.prisma.boutMetrics.findMany({
            where: {
                bout_id: { in: boutIds },
                fighter_id: { not: fighterId },
                deleted_at: null
            }
        });

        if(fighterMetrics.length === 0) return null;

        // Defino las variables para almacenar las estatdisticas del luchador
        let totalSigLanded = 0;
        let totalSigAttempted = 0;
        let totalTdLanded = 0;
        let totalTdAttempted = 0;

        let totalSigAbsorbed = 0;
        let totalTdDefendedAttempted = 0; // Intentos de derribo del rival
        let totalTdDefendedLanded = 0;    // Derribos que el rival sí logró conectar

        // Agrupamos por pelea única para calcular el tiempo total acumulado en la jaula
        const uniqueBoutMap = new Map<number, { roundedEnded: number, timeEndedStr: number}>();

        // Metricas Ofensivas
        for (const row of fighterMetrics) {
            totalSigLanded += row.sig_strikes_landed;
            totalSigAttempted += row.sig_strikes_attempted;
            totalTdLanded += row.takedowns_landed;
            totalTdAttempted += row.takedowns_attempted;

            // Guardamos la información del tiempo de la pelea (evitando duplicar por cada round en el bucle)
            if (!uniqueBoutMap.has(row.bout_id) && row.bout) {
              uniqueBoutMap.set(row.bout_id, {
                roundedEnded: row.bout.rounded_ended || 3, // por defecto 3 si es nulo
                timeEndedStr: row.bout.time_ended || 300  // por defecto round completo
              });
            }
        }
        
        // Metricas de Oponentes (Para defensa y absorción)
        for (const row of opponentMetrics) {
            totalSigAbsorbed += row.sig_strikes_landed; // Lo que el rival conectó es lo que el luchador absorbió
            totalTdDefendedAttempted += row.takedowns_attempted;
            totalTdDefendedLanded += row.takedowns_landed;
        }

        // Se calcula el tiempos de pelea (Conversión analitica a segundos y minutos)
        let totalTimeInSeconds = 0;
        const totalBoutsCount = uniqueBoutMap.size;

        uniqueBoutMap.forEach((boutInfo) => {
            const completedRoundTime = (boutInfo.roundedEnded - 1) * 300; // Cada round completo son 300 segundos
            const lastRoundTime = boutInfo.timeEndedStr; // Tiempo del último round en segundos
            totalTimeInSeconds += completedRoundTime + lastRoundTime;
        })

        const totalTimeInMinutes = totalTimeInSeconds / 60;

        const sigStrikesAccuracy = totalSigAttempted > 0 ? (totalSigLanded / totalSigAttempted) * 100 : 0;
        const takedownAccuracy = totalTdAttempted > 0 ? (totalTdLanded / totalTdAttempted) * 100 : 0;

        // Defensa de derribos: de los que le intentaron, ¿cuántos NO entraron?
        const tdDefendedAbsorbed = totalTdDefendedAttempted - totalTdDefendedLanded;
        const takedownDefense = totalTdDefendedAttempted > 0 ? (tdDefendedAbsorbed / totalTdDefendedAttempted) * 100 : 0;

        // Golpes significativos absorbidos por minuto
        const sigStrikesAbsorbedPm = totalTimeInMinutes > 0 ? (totalSigAbsorbed / totalTimeInMinutes) : 0;

        // Promedio de tiempo por pelea
        const averageFightTime = totalBoutsCount > 0 ? (totalTimeInSeconds / totalBoutsCount) : 0;

        // Realizamos el upsert para la estadisticas
        const updatedStats = await this.prisma.fighterStats.upsert({
            where: { fighter_id: fighterId },
            update: {
                sig_strikes_accuracy: parseFloat(sigStrikesAccuracy.toFixed(2)),
                sig_strikes_absorbed_pm: parseFloat(sigStrikesAbsorbedPm.toFixed(2)),
                takedown_accuracy: parseFloat(takedownAccuracy.toFixed(2)),
                takedown_defense: parseFloat(takedownDefense.toFixed(2)),
                average_fight_time: parseFloat(averageFightTime.toFixed(2)),
            },
            create: {
                fighter_id: fighterId,
                sig_strikes_accuracy: parseFloat(sigStrikesAccuracy.toFixed(2)),
                sig_strikes_absorbed_pm: parseFloat(sigStrikesAbsorbedPm.toFixed(2)),
                takedown_accuracy: parseFloat(takedownAccuracy.toFixed(2)),
                takedown_defense: parseFloat(takedownDefense.toFixed(2)),
                average_fight_time: parseFloat(averageFightTime.toFixed(2)),
            }
        });
        if(!updatedStats) throw new BadRequestException('No se pudo actualizar las estadisticas del luchador');
        return updatedStats;
    }

    // Servicio para obtener las estadisticas de un luchador
    async findByFighterId(fighterId: number){
        if(!fighterId) throw new BadRequestException('El ID del luchador es necesario');
        const existingFighter = await this.prisma.fighters.findUnique({
            where: {id: fighterId}
        });
        if(!existingFighter) throw new NotFoundException('El luchador no existe');
        const stats = await this.prisma.fighterStats.findUnique({
            where: { fighter_id: fighterId }
        });
        if(!stats) throw new NotFoundException('No existen estadisticas para el luchador en cuestión');
        return stats;
    }
}