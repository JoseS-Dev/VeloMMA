// config/metrics/register.ts
import client from 'prom-client';
import { settings } from '../settings.js';

// ✅ Registro global
export const register = new client.Registry();

// ✅ Configurar métricas por defecto de Node.js
export function registerDefaultMetrics() {
    client.collectDefaultMetrics({
        register,
        prefix: settings.nodeEnv === 'production' ? 'velomma_' : 'velomma_dev_',
        gcDurationBuckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });
}

// ✅ Obtener el registro
export function getRegister() {
    return register;
}

// ✅ Limpiar métricas (para testing)
export function clearMetrics() {
    register.clear();
}

// ✅ Función para obtener métricas en formato Prometheus
export async function getMetrics() {
    return await register.metrics();
}

// ✅ Función para obtener métricas en JSON
export async function getMetricsJSON() {
    return await register.getMetricsAsJSON();
}

