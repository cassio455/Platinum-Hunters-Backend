import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Middleware to validate request data against a Zod schema
 * @param schema - Zod schema that defines body, query, and params structure
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: 'Erro de validação',
                    errors: error.issues,
                });
            }
            next(error);
        }
    };
};
