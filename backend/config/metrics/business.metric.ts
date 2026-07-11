// config/metrics/business.metrics.ts
import client from 'prom-client';
import { register } from './register.js';

// ============ Business Metrics ============
export const activeFighters = new client.Gauge({
    name: 'velomma_active_fighters_total',
    help: 'Total number of active fighters',
    registers: [register],
});

export const activeUsers = new client.Gauge({
    name: 'velomma_active_users_total',
    help: 'Total number of active users',
    registers: [register],
});

export const fightEvents = new client.Counter({
    name: 'velomma_fight_events_total',
    help: 'Total number of fight events',
    labelNames: ['event_type', 'result', 'division'],
    registers: [register],
});

export const rankingsDistribution = new client.Gauge({
    name: 'velomma_rankings_distribution',
    help: 'Distribution of rankings by division and position',
    labelNames: ['division', 'position'],
    registers: [register],
});

export const injuriesBySeverity = new client.Gauge({
    name: 'velomma_injuries_by_severity',
    help: 'Number of injuries by severity',
    labelNames: ['severity', 'status'],
    registers: [register],
});

export const teamsCount = new client.Gauge({
    name: 'velomma_teams_total',
    help: 'Total number of teams/stables',
    labelNames: ['type'],
    registers: [register],
});

// ============ Exportar grupo ============
export const businessMetrics = {
    activeFighters,
    activeUsers,
    fightEvents,
    rankingsDistribution,
    injuriesBySeverity,
    teamsCount,
};