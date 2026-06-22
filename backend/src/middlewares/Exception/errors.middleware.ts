import type { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../common/errors/error.js';
import { ZodError } from 'zod';

export function errorsMiddleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
){
    if(error instanceof HttpException){
        return res.status(error.status).json({
            status: error.status,
            message: error.message,
            data: null,
        });
    }
    // Si el error es de Zod, lo manejo de manera específica
    else if(error instanceof ZodError){
        return res.status(400).json({
            status: 400,
            message: error,
            data: null,
        });
    }
    return res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        data: null,
    });
}