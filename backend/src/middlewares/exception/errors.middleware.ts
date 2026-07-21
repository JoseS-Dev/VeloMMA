import type { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../common/errors/error.js';

export function errorsMiddleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
){
    if(error instanceof HttpException){
        const body: Record<string, unknown> = {
            status: error.status,
            message: error.message,
        };
        const details = (error as any).details;
        if(details) body.details = details;
        return res.status(error.status).json(body);
    }
    return res.status(500).json({
        status: 500,
        message: 'Error interno del servidor',
        data: null,
    });
}