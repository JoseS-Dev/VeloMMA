// Clase base para todos los errores de la aplicación
export class HttpException extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly details?: unknown
    ){
        super(message);
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
}

// Clase para 400
export class BadRequestException extends HttpException {
    constructor(message: string){
        super(400, message);
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
}

// Clase para 401
export class UnauthorizedException extends HttpException {
    constructor(message: string){
        super(401, message);
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
}

// Clase para 403
export class ForbiddenException extends HttpException {
    constructor(message: string){
        super(403, message);
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
}

// Clase para 404
export class NotFoundException extends HttpException {
    constructor(message: string){
        super(404, message);
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
}

// Clase para 409
export class ConflictException extends HttpException {
    constructor(message: string){
        super(409, message);
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
}

// Clase para 500
export class InternalServerErrorException extends HttpException {
    constructor(message: string){
        super(500, message);
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
}

// Clase para 503
export class ServiceUnavailableException extends HttpException {
    constructor(message: string){
        super(503, message);
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
}

// Clase para 422
export class UnprocessableEntityException extends HttpException {
    constructor(message: string){
        super(422, message);
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
}