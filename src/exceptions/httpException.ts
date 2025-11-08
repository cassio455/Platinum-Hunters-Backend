export class HttpException extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string = 'Recurso não encontrado') {
        super(message, 404);
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string = 'Requisição inválida') {
        super(message, 400);
    }
}

export class ConflictException extends HttpException {
    constructor(message: string = 'Conflito de dados') {
        super(message, 409);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Não autorizado') {
        super(message, 401);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message: string = 'Acesso negado') {
        super(message, 403);
    }
}

export class InternalServerException extends HttpException {
    constructor(message: string = 'Erro interno do servidor') {
        super(message, 500, false);
    }
}
