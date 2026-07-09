import { EventEmitter } from "node:stream";
import { prisma } from "../prisma/prisma.js";
import type { UpdateFighterStatsEvent } from "../../types/index.js";
import { StatsService } from "../../modules/relational/stats/stats.services.js";

// Definimos el evento que se emitirá cuando se actualicen las estadísticas de los luchadores
export const statsEventEmitter = new EventEmitter();

// Escuchamos el evento y actualizamos las estadísticas de los luchadores
statsEventEmitter.on('updateFighterStats', async (data: UpdateFighterStatsEvent) => {
    const statsService = new StatsService(prisma);
    await Promise.all([
        statsService.updateFighterCareerStats(data.redFighterId),
        statsService.updateFighterCareerStats(data.blueFighterId)
    ])
});

