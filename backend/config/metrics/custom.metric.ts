// config/metrics/custom.metrics.ts
import client from 'prom-client';
import { register } from './register.js';

// ============ Custom API Metrics ============
export const apiResponseTime = new client.Histogram({
    name: 'velomma_api_response_time_seconds',
    help: 'API response time in seconds',
    labelNames: ['endpoint', 'method'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    registers: [register],
});

export const authenticationAttempts = new client.Counter({
    name: 'velomma_authentication_attempts_total',
    help: 'Total number of authentication attempts',
    labelNames: ['method', 'success'],
    registers: [register],
});

export const validationErrors = new client.Counter({
    name: 'velomma_validation_errors_total',
    help: 'Total number of validation errors',
    labelNames: ['endpoint', 'field'],
    registers: [register],
});

export const rateLimitHits = new client.Counter({
    name: 'velomma_rate_limit_hits_total',
    help: 'Total number of rate limit hits',
    labelNames: ['endpoint', 'method'],
    registers: [register],
});

// ============ Exportar grupo ============
export const customMetrics = {
    apiResponseTime,
    authenticationAttempts,
    validationErrors,
    rateLimitHits,
};