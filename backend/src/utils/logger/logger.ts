// src/utils/logger/logger.ts
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { settings } from '../../../config/settings.js';
import { getCorrelationId } from '../context/correlation.context.js';

// ✅ Detectar si estamos en test
const isTest = settings.nodeEnv === 'test';
const isDevelopment = settings.nodeEnv === 'development';

// ✅ Configuración de niveles
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// ✅ Crear transportes según entorno
const createTransports = () => {
    if (isTest) {
        return [
            new winston.transports.Console({
                level: 'error',
                silent: true,
                format: winston.format.json(),
            }),
        ];
    }

    // ✅ EN DESARROLLO: Console con colores
    if (isDevelopment) {
        return [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ all: true }),
                    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    winston.format.printf(({ timestamp, level, message, correlationId, ...meta }) => {
                        const cid = correlationId || getCorrelationId() || 'no-cid';
                        const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
                        return `[${timestamp}] [${cid}] ${level}: ${message}${metaStr}`;
                    })
                ),
            }),
            new DailyRotateFile({
                filename: 'logs/%DATE%-application.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '14d',
                level: 'info',
                format: winston.format.json(),
                silent: isTest,
            }),
        ];
    }
    return [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'ISO' }),
                winston.format.json()
            ),
        }),
        new DailyRotateFile({
            filename: 'logs/%DATE%-application.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.json(),
            silent: isTest, 
        }),
        new DailyRotateFile({
            filename: 'logs/%DATE%-error.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            level: 'error',
            format: winston.format.json(),
            silent: isTest,
        }),
    ];
};

// ✅ Crear logger
export const logger = winston.createLogger({
    level: isTest ? 'error' : (isDevelopment ? 'debug' : 'info'),
    levels,
    format: winston.format.json(),
    transports: createTransports(),
    exceptionHandlers: isTest ? [] : [
        new winston.transports.File({
            filename: 'logs/exceptions.log',
            format: winston.format.json(),
        }),
    ],
    rejectionHandlers: isTest ? [] : [
        new winston.transports.File({
            filename: 'logs/rejections.log',
            format: winston.format.json(),
        }),
    ],
    exitOnError: !isTest,
});

export const log = {
    error: (message: string, meta?: any) => {
        if (!isTest) {
            const correlationId = getCorrelationId();
            logger.error(message, { ...meta, correlationId });
        }
    },
    warn: (message: string, meta?: any) => {
        if (!isTest) {
            const correlationId = getCorrelationId();
            logger.warn(message, { ...meta, correlationId });
        }
    },
    info: (message: string, meta?: any) => {
        if (!isTest) {
            const correlationId = getCorrelationId();
            logger.info(message, { ...meta, correlationId });
        }
    },
    http: (message: string, meta?: any) => {
        if (!isTest) {
            const correlationId = getCorrelationId();
            logger.http(message, { ...meta, correlationId });
        }
    },
    debug: (message: string, meta?: any) => {
        if (!isTest) {
            const correlationId = getCorrelationId();
            logger.debug(message, { ...meta, correlationId });
        }
    },
};