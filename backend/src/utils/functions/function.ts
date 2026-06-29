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