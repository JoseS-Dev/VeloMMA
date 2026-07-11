// config/metrics/database.metrics.ts
import client from 'prom-client';
import { register } from './register.js';

// ============ Database Metrics ============
export const dbQueryDuration = new client.Histogram({
    name: 'velomma_db_query_duration_seconds',
    help: 'Database query duration in seconds',
    labelNames: ['operation', 'table', 'success'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [register],
});

export const dbQueryTotal = new client.Counter({
    name: 'velomma_db_query_total',
    help: 'Total number of database queries',
    labelNames: ['operation', 'table', 'success'],
    registers: [register],
});

export const dbQueryErrors = new client.Counter({
    name: 'velomma_db_query_errors_total',
    help: 'Total number of database query errors',
    labelNames: ['operation', 'table', 'error_type'],
    registers: [register],
});

export const dbConnectionPool = new client.Gauge({
    name: 'velomma_db_connection_pool',
    help: 'Database connection pool status',
    labelNames: ['state'], // active, idle, total
    registers: [register],
});

export const dbTransactionDuration = new client.Histogram({
    name: 'velomma_db_transaction_duration_seconds',
    help: 'Database transaction duration in seconds',
    labelNames: ['operation'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
    registers: [register],
});

// ============ Exportar grupo ============
export const databaseMetrics = {
    queryDuration: dbQueryDuration,
    queryTotal: dbQueryTotal,
    queryErrors: dbQueryErrors,
    connectionPool: dbConnectionPool,
    transactionDuration: dbTransactionDuration,
};