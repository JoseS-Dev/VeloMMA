import type { Request, Response, NextFunction } from 'express';
import type { APIResponse } from '../../types/api/api.js';
import { toPositiveInt } from '../../utils/functions/function.js';
import { BadRequestException } from '../errors/error.js';

// ──────────────────────────────────────────────
// Tipos de paginación
// ──────────────────────────────────────────────

export interface OffsetPagination {
  strategy: 'offset';
  page: number;
  limit: number;
}

export interface CursorPagination {
  strategy: 'cursor';
  cursor?: number;
  limit: number;
}

export type PaginationParams = OffsetPagination | CursorPagination;

export interface OffsetMeta {
  total: number;
  page: number;
  limit: number;
}

export interface CursorMeta {
  total: number;
  nextCursor: number | null;
  limit: number;
  hasMore: boolean;
}

export type PaginationMeta = OffsetMeta | CursorMeta;

export interface FlatPagination {
  strategy: 'offset' | 'cursor';
  page: number;
  limit: number;
  cursor?: number;
}


export function extractPagination(req: Request, strategy?: 'offset' | 'cursor'): PaginationParams {
  const { page, cursor, limit } = req.query;
  const limitNum = toPositiveInt(limit, 'limit');
  const effectiveLimit = isNaN(limitNum) ? 10 : limitNum;

  const effectiveStrategy = strategy ?? (cursor !== undefined ? 'cursor' : 'offset');

  if (effectiveStrategy === 'cursor') {
    if (cursor !== undefined) {
      return { strategy: 'cursor', cursor: toPositiveInt(cursor, 'cursor'), limit: effectiveLimit };
    }
    return { strategy: 'cursor', cursor: undefined, limit: effectiveLimit };
  }

  const pageNum = toPositiveInt(page, 'page');
  return { strategy: 'offset', page: isNaN(pageNum) ? 1 : pageNum, limit: effectiveLimit };
}

export function flattenPagination(p: PaginationParams): FlatPagination {
  if (p.strategy === 'cursor') {
    return { strategy: 'cursor', page: 1, cursor: p.cursor, limit: p.limit };
  }
  return { strategy: 'offset', page: p.page, cursor: undefined, limit: p.limit };
}


export function buildPaginationMeta(
  pagination: FlatPagination,
  total: number,
  dataLength: number,
  nextCursor?: number | null
): PaginationMeta {
  if (pagination.strategy === 'cursor') {
    return {
      total,
      nextCursor: nextCursor ?? null,
      limit: pagination.limit,
      hasMore: dataLength === pagination.limit,
    };
  }
  return {
    total,
    page: pagination.page,
    limit: pagination.limit,
  };
}

export function PaginationFor(strategy?: 'offset' | 'cursor') {
  return function <Args extends any[], Return>(
    originalMethod: (this: any, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<any, (this: any, ...args: Args) => Return>
  ) {
    if (context.kind !== 'method') {
      throw new Error('@PaginationFor solo puede usarse en métodos');
    }

    async function replacementMethod(this: any, ...args: Args): Promise<any> {
      const req = args[0] as Request;
      req.pagination = flattenPagination(extractPagination(req, strategy));
      return originalMethod.apply(this, args);
    }

    return replacementMethod;
  };
}

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