// config/metrics/http.metrics.ts
import client from 'prom-client';
import { register } from './register.js';

// ============ HTTP Request Metrics ============
export const httpRequestsTotal = new client.Counter({
    name: 'velomma_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code', 'status_category'],
    registers: [register],
});

export const httpRequestDuration = new client.Histogram({
    name: 'velomma_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [register],
});

export const httpRequestSize = new client.Summary({
    name: 'velomma_http_request_size_bytes',
    help: 'HTTP request size in bytes',
    labelNames: ['method', 'route'],
    registers: [register],
    percentiles: [0.5, 0.9, 0.99],
});

export const httpResponseSize = new client.Summary({
    name: 'velomma_http_response_size_bytes',
    help: 'HTTP response size in bytes',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
    percentiles: [0.5, 0.9, 0.99],
});

export const httpActiveRequests = new client.Gauge({
    name: 'velomma_http_active_requests',
    help: 'Number of active HTTP requests',
    labelNames: ['method'],
    registers: [register],
});

// ============ Exportar grupo ============
export const httpMetrics = {
    requestsTotal: httpRequestsTotal,
    requestDuration: httpRequestDuration,
    requestSize: httpRequestSize,
    responseSize: httpResponseSize,
    activeRequests: httpActiveRequests,
};