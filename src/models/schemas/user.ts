import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateUserSchema = z.object({
   username: z.string().min(5).max(20).openapi({description: "The user's unique username"}),
   email: z.string().email().openapi({description: "The user's email address"}),
   password: z.string().min(8).max(32).openapi({description: "The user's password"})
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

// Schema de validação para a rota de criação de usuário
export const createUserValidation = z.object({
   body: CreateUserSchema,
   query: z.object({}).optional(),
   params: z.object({}).optional()
});

export const LoginUserSchema = z.object({
   email: z.string().email().openapi({description: "The user's email address"}),
   password: z.string().min(8).max(32).openapi({description: "The user's password"})
});
export type LoginUser = z.infer<typeof LoginUserSchema>;

// Schema de validação para a rota de login de usuário
export const loginUserValidation = z.object({
   body: LoginUserSchema,
   query: z.object({}).optional(),
   params: z.object({}).optional()
});