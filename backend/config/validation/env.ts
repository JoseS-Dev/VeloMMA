import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __currentDir = path.dirname(__filename);

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? 
    path.resolve(__currentDir, '../../.env.test') 
    : path.resolve(__currentDir, '../../.env.local'),
    override: true
});

export const env = createEnv({
    server: {
        // Variables obligatorias
        DATABASE_URL: z.string().url(),
        JWT_SECRET: z.string().min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
        API_SECRET_KEY: z.string().min(16),
        COOKIE_SECRET: z.string().min(32),
        
        // Variables con default
        PORT: z.coerce.number().default(3000),
        NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
        BASE_PATH: z.string().default("/api/v1"),
        CORS_ORIGIN: z.string().url().default("*"),
        
        // Redis
        REDIS_URL: z.string().url().optional(),
        REDIS_PORT: z.coerce.number().default(6379),
        REDIS_ENV: z.string().transform((val) => val === 'true').default(false),
        
        // Rate limits
        LIMIT_READ_WINDOW_MS: z.coerce.number().default(5 * 60 * 1000),
        LIMIT_READ_MAX: z.coerce.number().default(100),
        LIMIT_WRITE_WINDOW_MS: z.coerce.number().default(60 * 1000),
        LIMIT_WRITE_MAX: z.coerce.number().default(10),
    },
    client: {},
    clientPrefix: "VITE_",
    runtimeEnv: process.env
});

export type Env = typeof env;