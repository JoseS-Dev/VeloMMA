import crypto from 'crypto';

interface CursorOptions {
    cursor?: number;
    limit?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
    where?: { [key: string]: any };
}

// Function para cargar todas las rutas de la API en la raiz del servidor
export function registerRoutes(app: any, routes: Object) {
    Object.values(routes).forEach(moduleRoutes => {
        if(typeof moduleRoutes === 'object') {
            Object.values(moduleRoutes).forEach(route => {
                app.use(route);
            });
        }
    });
}

// Record para los estados de las peleas
export const BoutStatusRecord: Record<string, string[]> = {
    Programada: ['Cancelada', 'En_proceso', 'Finalizada'],
    Cancelada: ['Programada'],
    En_Proceso: ['Finalizada', 'Cancelada'],
    Finalizada: []
}

// Función que genra un hash sha256 a partir de un string
export function generateHash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Función para la consulta base de los metodos findAll y findAllActive de los servicios de la API
export const buildQueryOptions = (options: CursorOptions) => {
    const { cursor, limit = 10, orderBy = { id: 'desc' }, where = {} } = options;
    const queryOptions: any = {
        take: limit,
        orderBy,
        where,
    };
    if (cursor){
        queryOptions.cursor = { id: cursor };
        queryOptions.skip = 1;
    }
    return queryOptions;
}
