import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { CreateUserSchema } from '../../models/schemas/user.js';

export function registerUserPaths(registry: OpenAPIRegistry): void {
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
                            message: z.string(),
                            data: z.object({
                                id: z.string().uuid(),
                                username: z.string(),
                                email: z.string().email(),
                                profileImageUrl: z.string().optional(),
                                createdAt: z.string().datetime()
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
                        })
                    } 
                } 
            },
            500: { 
                description: 'Internal server error', 
                content: { 
                    'application/json': { 
                        schema: z.object({ 
                            message: z.string()
                        }) 
                    } 
                } 
            },
        },
    });
}
