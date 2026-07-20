import { AsyncLocalStorage } from "async_hooks";

// Interface para alamacenar el Correlation ID en el contexto
export interface CorrelationContext {
    correlationId: string;
    userId?: number;
    requestId?: string;
    startTime?: number;
}

export const correlationContext = new AsyncLocalStorage<CorrelationContext>();

// Helper para obtener el Correlation ID del contexto actual
export function getCorrelationId(): string | undefined {
    const store = correlationContext.getStore();
    return store?.correlationId;
}

// Helper para obtener el contexto completo del Correlation ID
export function getCorrelationContext(): CorrelationContext | undefined {
    return correlationContext.getStore();
}