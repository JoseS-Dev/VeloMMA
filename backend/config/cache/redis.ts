import { createClient } from 'redis';
import { settings } from '../settings.js';

// Se crea la instancia de redis
export const client = createClient({
    url: settings.redisUrl
});

// Manejador de auditoria de logs
client.on('connect', () => console.log('Redis conectado'));
client.on('ready', () => console.log('Redis listo'));
client.on('error', (err) => console.error('Redis error', err));

// Función para inicializar la conexión
export async function connectRedis(){
    if(!client.isOpen){
        await client.connect();
    }
}