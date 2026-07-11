// config/metrics/cache.metrics.ts
import client from 'prom-client';
import { register } from './register.js';

// ============ Cache Metrics ============
export const cacheHits = new client.Counter({
    name: 'velomma_cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_type', 'key_prefix'],
    registers: [register],
});

export const cacheMisses = new client.Counter({
    name: 'velomma_cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_type', 'key_prefix'],
    registers: [register],
});

export const cacheHitRatio = new client.Gauge({
    name: 'velomma_cache_hit_ratio',
    help: 'Cache hit ratio (0-1)',
    labelNames: ['cache_type'],
    registers: [register],
});

export const cacheSize = new client.Gauge({
    name: 'velomma_cache_size_bytes',
    help: 'Cache size in bytes',
    labelNames: ['cache_type'],
    registers: [register],
});

export const cacheOperations = new client.Counter({
    name: 'velomma_cache_operations_total',
    help: 'Total number of cache operations',
    labelNames: ['operation', 'cache_type', 'success'], // get, set, delete
    registers: [register],
});

// ============ Exportar grupo ============
export const cacheMetrics = {
    hits: cacheHits,
    misses: cacheMisses,
    hitRatio: cacheHitRatio,
    size: cacheSize,
    operations: cacheOperations,
};