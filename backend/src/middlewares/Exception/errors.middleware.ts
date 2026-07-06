import type { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../common/errors/error.js';

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
    return res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        data: null
    });
}