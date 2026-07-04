import { createClient } from 'redis';
import { settings } from '../settings.js';

export let client: ReturnType<typeof createClient> | null = null
const isRedisUsed = settings.redisEnv && settings.nodeEnv !== 'test';

if(isRedisUsed){
    // Se crea la instancia de redis
     client = createClient({
        url: settings.redisUrl
    });

    // Manejador de auditoria de logs
    client.on('connect', () => console.log('Redis conectado'));
    client.on('ready', () => console.log('Redis listo'));
    client.on('error', (err: any) => console.error('Redis error', err));
}

// Función para inicializar la conexión
export async function connectRedis(){
    if(isRedisUsed && client){
        await client?.connect();
    }
}