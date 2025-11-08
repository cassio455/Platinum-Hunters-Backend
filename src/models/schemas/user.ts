import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateUserSchema = z.object({
   username: z.string().min(5).max(20).openapi({description: "The user's unique username"}),
   email: z.string().email().openapi({description: "The user's email address"}),
   password: z.string().min(8).openapi({description: "The user's password"})
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

// Schema de validação para a rota de criação de usuário
export const createUserValidation = z.object({
   body: CreateUserSchema,
   query: z.object({}).optional(),
   params: z.object({}).optional()
});