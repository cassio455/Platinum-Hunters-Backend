import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { UpdateGameProgressSchema } from '../models/schemas/library.js';
import { CreateUserSchema } from '../models/schemas/user.js';

const registry = new OpenAPIRegistry();

registry.registerPath({
    method: 'post',
    path: '/users/register',
    description: 'Register a new user in the system',
    summary: 'Create new user',
    tags: ['Users'],
    request: {
        body: { 
            content: { 
                'application/json': { 
                    schema: CreateUserSchema,
                    example: {
                        username: "johndoe",
                        email: "john@example.com",
                        password: "securePassword123"
                    }
                } 
            } 
        },
    },
    responses: {
        201: { 
            description: 'User created successfully', 
            content: { 
                'application/json': { 
                    schema: z.object({
                        message: z.string().default('User created successfully'),
                        data: z.object({
                            id: z.string().uuid().openapi({ description: 'User unique ID' }),
                            username: z.string().openapi({ description: 'Username' }),
                            email: z.string().email().openapi({ description: 'User email' }),
                            profileImageUrl: z.string().optional().openapi({ description: 'Profile image URL' }),
                            createdAt: z.string().datetime().openapi({ description: 'Creation date' })
                        })
                    }),
                    example: {
                        message: "User created successfully",
                        data: {
                            id: "550e8400-e29b-41d4-a716-446655440000",
                            username: "johndoe",
                            email: "john@example.com",
                            createdAt: "2025-11-07T10:30:00.000Z"
                        }
                    }
                } 
            } 
        },
        400: { 
            description: 'Invalid data or user already exists', 
            content: { 
                'application/json': { 
                    schema: z.object({ 
                        message: z.string(),
                        errors: z.array(z.object({
                            path: z.string(),
                            message: z.string()
                        })).optional()
                    }),
                    examples: {
                        validationError: {
                            value: {
                                message: "Validation error",
                                errors: [
                                    {
                                        path: "body.email",
                                        message: "Invalid email"
                                    }
                                ]
                            },
                            summary: "Field validation error"
                        },
                        userExists: {
                            value: {
                                message: "Unable to create user. Please check the provided data."
                            },
                            summary: "Email or username already registered"
                        }
                    }
                } 
            } 
        },
        500: { 
            description: 'Internal server error', 
            content: { 
                'application/json': { 
                    schema: z.object({ 
                        message: z.string().default('Internal server error')
                    }) 
                } 
            } 
        },
    },
});

const paramsSchema = z.object({
    gameId: z.string().openapi({ description: "The game id in the path" }),
});

const requestBodySchema = UpdateGameProgressSchema.omit({ gameId: true });

registry.registerPath({
    method: 'patch',
    path: '/library/{gameId}/progress',
    description: 'Update game progress in user library',
    summary: 'Update game progress',
    tags: ['Library'],
        request: {
            params: paramsSchema,
            body: { content: { 'application/json': { schema: requestBodySchema } } },
        },
        responses: {
            200: { description: 'OK', content: { 'application/json': { schema: z.object({message: z.string(), gameId: z.string(), progress: z.number().optional(),}) } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: z.object({ message: z.string().default('Unauthorized') }) } } },
            500: { description: 'Internal Server Error', content: { 'application/json': { schema: z.object({ message: z.string().default('Internal server error') }) } } },
        },
});


const generator = new OpenApiGeneratorV3(registry.definitions);
const doc = generator.generateDocument({
    openapi: '3.0.0',
    info: { 
        title: 'Platinum Hunters API', 
        version: '1.0.0',
        description: 'API para gerenciamento de usuários, jogos e biblioteca de jogos'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor de Desenvolvimento'
        }
    ],
    tags: [
        {
            name: 'Users',
            description: 'Operações relacionadas a usuários'
        },
        {
            name: 'Library',
            description: 'Operações relacionadas à biblioteca de jogos do usuário'
        }
    ]
});

export default doc;