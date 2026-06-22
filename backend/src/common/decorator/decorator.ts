import type { Request, Response, NextFunction } from 'express';
import type { APIResponse } from '../../types/api/api.js';

// Decorador para las respuestas de la API
export function SendResponse(message: string = 'Success', statusCode: number = 200) {
    return function <Args extends any[], Return>(
        originalMethod: (this: any, ...args: Args) => Return,
        context: ClassMethodDecoratorContext<any, (this: any, ...args: Args) => Return>
    ) {
        if (context.kind !== 'method') {
            throw new Error('El decorador @SendResponse solo puede usarse en métodos de clase.');
        }

        // Mantenemos la firma exacta de argumentos (Args) que tenga el método original
        async function replacementMethod(this: any, ...args: Args): Promise<any> {
            try {
                // Buscamos si Express inyectó 'res' y 'next' en los argumentos de la función
                const req = args[0] as Request;
                const res = args[1] as Response;
                const next = args[2] as NextFunction | undefined;

                // Ejecutamos el método original tal cual fue escrito
                const result = await originalMethod.apply(this, args);
                
                // Si el método ya envió cabeceras (ej. una descarga de archivo), no hacemos nada
                if (res && res.headersSent) return result;

                const data = result && (result as any).data !== undefined ? (result as any).data : result;
                const meta = result && (result as any).meta !== undefined ? (result as any).meta : undefined;

                const responseBody: APIResponse<typeof data> = {
                    status: statusCode,
                    message,
                    data,
                    ...(meta && { meta })
                };

                if (res && typeof res.status === 'function') {
                    return res.status(statusCode).json(responseBody);
                }

                return result;
            } catch (error) {
                // Si Express nos pasó la función 'next', le mandamos el error de forma segura
                const next = args[2] as NextFunction | undefined;
                if (typeof next === 'function') {
                    next(error);
                } else {
                    throw error;
                }
            }
        }

        return replacementMethod;
    };
}