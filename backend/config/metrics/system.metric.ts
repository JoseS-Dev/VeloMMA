// config/metrics/system.metrics.ts
import client from 'prom-client';
import { register } from './register.js';

// ============ System Metrics ============
export const memoryUsage = new client.Gauge({
    name: 'velomma_memory_usage_bytes',
    help: 'Memory usage in bytes',
    labelNames: ['type'], // heap_total, heap_used, rss, external
    registers: [register],
});

export const cpuUsage = new client.Gauge({
    name: 'velomma_cpu_usage_percent',
    help: 'CPU usage percentage',
    registers: [register],
});

export const eventLoopLag = new client.Histogram({
    name: 'velomma_event_loop_lag_seconds',
    help: 'Event loop lag in seconds',
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
    registers: [register],
});

export const garbageCollection = new client.Histogram({
    name: 'velomma_gc_duration_seconds',
    help: 'Garbage collection duration in seconds',
    labelNames: ['type'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
    registers: [register],
});

// ============ Exportar grupo ============
export const systemMetrics = {
    memoryUsage,
    cpuUsage,
    eventLoopLag,
    garbageCollection,
};