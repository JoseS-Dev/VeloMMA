// Defino la interfaz de la API
export interface APIResponse<T> {
    status: number;
    message: string;
    data: T;
    meta?: any;
}