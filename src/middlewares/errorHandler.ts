import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/httpException.js';
import { ArgumentException } from '../exceptions/argumentException.js';
import { ZodError } from 'zod';


export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error: ', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method
    });

    if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
            message: error.message
        });
    }

    if (error instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation error',
            errors: error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    if (error instanceof ArgumentException) {
        return res.status(400).json({
            message: error.message
        });
    }

    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        return res.status(500).json({
            message: 'Database error occurred'
        });
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation error'
        });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid ID or data format'
        });
    }

    return res.status(500).json({
        message: 'Internal server error'
    });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: `Route ${req.method} ${req.url} not found`
    });
};
