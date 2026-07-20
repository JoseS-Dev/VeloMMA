import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { getCorrelationId } from '../context/correlation.context.js';
import { settings } from '../../../config/settings.js';

// Defino niveles de logs
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

// Defino colores para cada nivel de log
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
}

winston.addColors(colors);

// Formato de JSON para producción
const jsonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'ISO' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
)

// Transporte para logs en consola
const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
    )
})

// Transporte para archivos
const fileTransport = new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: jsonFormat
})

// Transporte para errores
const errorTransport = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
    format: jsonFormat
})

// Configurar logger según el nivel
const level = () => {
    const env = settings.nodeEnv || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'info';
}

// creamos el logger}
export const logger = winston.createLogger({
    level: level(),
    levels,
    format: jsonFormat,
    defaultMeta: {
        service: 'velomma-api',
        environment: settings.nodeEnv,
    },
    transports: [
        consoleTransport,
        fileTransport,
        errorTransport,
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'logs/exceptions.log',
            format: jsonFormat,
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize()
            ),
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: 'logs/rejections.log',
            format: jsonFormat,
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize()
            ),
        }),
    ],
    exitOnError: false,
});

// Función para loggear perticiones HTTP
export function logHttpRequest(req: any, res: any, duration: number) {
    const correlationId = req.correlationId || 'no-cid';
    const loggerWithCid = logger.child({ correlationId });

    loggerWithCid.http(`${req.method} ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        userId: req.user?.id,
    });
}

export const log = {
    error: (message: string, meta?: any) => {
        const correlationId = getCorrelationId();
        logger.error(message, { ...meta, correlationId });
    },
    warn: (message: string, meta?: any) => {
        const correlationId = getCorrelationId();
        logger.warn(message, { ...meta, correlationId });
    },
    info: (message: string, meta?: any) => {
        const correlationId = getCorrelationId();
        logger.info(message, { ...meta, correlationId });
    },
    http: (message: string, meta?: any) => {
        const correlationId = getCorrelationId();
        logger.http(message, { ...meta, correlationId });
    },
    debug: (message: string, meta?: any) => {
        const correlationId = getCorrelationId();
        logger.debug(message, { ...meta, correlationId });
    },
};

