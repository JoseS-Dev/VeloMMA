// src/middlewares/metrics/prisma-metrics.middleware.ts
import { dbQueryDuration, dbQueryTotal, dbQueryErrors } from "../../../../config/metrics/index.js";
import type { ExtendedPrismaClient } from "../../../utils/prisma/prisma.js";

function getOperationType(operation: string): string {
    if (operation.startsWith('find') || operation === 'count') return 'READ';
    if (operation.startsWith('create')) return 'CREATE';
    if (operation.startsWith('update') || operation === 'upsert') return 'UPDATE';
    if (operation.startsWith('delete')) return 'DELETE';
    if (operation.includes('Raw')) return 'RAW';
    return 'UNKNOWN';
}

export function middlewarePrismaMetrics(prisma: ExtendedPrismaClient) {
    return new Proxy(prisma as any, {
        get(target: any, prop: string) {
            const original = target[prop];

            if (typeof original !== 'function' || prop === '$transaction') {
                return original;
            }

            return async function(this: any, ...args: any[]) {
                const start = Date.now();
                const operation = prop.toString();
                const table = target.name || 'unknown';
                const operationType = getOperationType(operation);
                let success = 'true';

                try {
                    const result = await original.apply(this, args);
                    return result;
                } catch (error: any) {
                    success = 'false';
                    
                    // ✅ Registrar error específico
                    if (dbQueryErrors && dbQueryErrors.labels) {
                        dbQueryErrors.labels(operationType, table, error.code || 'unknown').inc();
                    }
                    
                    throw error;
                } finally {
                    const duration = (Date.now() - start) / 1000;
                    
                    // ✅ Registrar métricas
                    if (dbQueryDuration && dbQueryDuration.labels) {
                        dbQueryDuration.labels(operationType, table, success).observe(duration);
                    }
                    if (dbQueryTotal && dbQueryTotal.labels) {
                        dbQueryTotal.labels(operationType, table, success).inc();
                    }
                }
            };
        }
    }) as ExtendedPrismaClient;
}