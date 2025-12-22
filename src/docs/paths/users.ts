import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { CreateUserSchema, LoginUserSchema } from '../../models/schemas/user.js';

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
                                createdAt: z.string().datetime(),
                                token: z.string()
                            })
                        }),
                        example: {
                            message: "User created successfully",
                            data: {
                                id: "550e8400-e29b-41d4-a716-446655440000",
                                username: "johndoe",
                                email: "john@example.com",
                                createdAt: "2025-11-07T10:30:00.000Z",
                                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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

    registry.registerPath({
        method: 'post',
        path: '/users/login',
        description: 'Authenticate a user and return a JWT token',
        summary: 'Login user',
        tags: ['Users'],
        request: {
            body: { 
                content: { 
                    'application/json': { 
                        schema: LoginUserSchema,
                        example: {
                            email: "john@example.com",
                            password: "securePassword123"
                        }
                    } 
                } 
            },
        },
        responses: {
            200: { 
                description: 'User logged in successfully', 
                content: { 
                    'application/json': { 
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                id: z.string().uuid(),
                                username: z.string(),
                                email: z.string().email(),
                                profileImageUrl: z.string().optional(),
                                coins: z.number(),
                                rankingPoints: z.number(),
                                completedChallenges: z.array(z.number()),
                                ownedTitles: z.array(z.string()),
                                equippedTitle: z.string().nullable(),
                                token: z.string()
                            })
                        }),
                        example: {
                            message: "User logged in successfully",
                            data: {
                                id: "550e8400-e29b-41d4-a716-446655440000",
                                username: "johndoe",
                                email: "john@example.com",
                                profileImageUrl: "https://example.com/profile.jpg",
                                coins: 100,
                                rankingPoints: 250,
                                completedChallenges: [1, 2, 3],
                                ownedTitles: ["🌸 Explorador de Sakura 🌸"],
                                equippedTitle: "🌸 Explorador de Sakura 🌸",
                                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            }
                        }
                    } 
                } 
            },
            400: { 
                description: 'Invalid credentials', 
                content: { 
                    'application/json': { 
                        schema: z.object({ 
                            message: z.string()
                        }),
                        example: {
                            message: "Invalid email or password"
                        }
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

    registry.registerPath({
        method: 'get',
        path: '/users/me',
        description: 'Get the profile and statistics of the authenticated user',
        summary: 'Get user profile',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'User profile retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                user: z.object({
                                    id: z.string().uuid(),
                                    username: z.string(),
                                    email: z.string().email(),
                                    profileImageUrl: z.string().optional(),
                                    roles: z.array(z.string()),
                                    createdAt: z.string().datetime(),
                                    updatedAt: z.string().datetime()
                                }),
                                statistics: z.object({
                                    totalGamesInLibrary: z.number(),
                                    totalPlatinum: z.number(),
                                    totalCompleted: z.number(),
                                    totalPlaying: z.number(),
                                    totalWishlist: z.number(),
                                    totalAbandoned: z.number(),
                                    totalCustomGames: z.number(),
                                    totalHoursPlayed: z.number(),
                                    averageProgress: z.number()
                                })
                            })
                        }),
                        example: {
                            message: "User profile retrieved successfully",
                            data: {
                                user: {
                                    id: "550e8400-e29b-41d4-a716-446655440000",
                                    username: "johndoe",
                                    email: "john@example.com",
                                    profileImageUrl: "https://example.com/profile.jpg",
                                    roles: ["USER"],
                                    createdAt: "2025-01-01T10:00:00.000Z",
                                    updatedAt: "2025-01-15T14:30:00.000Z"
                                },
                                statistics: {
                                    totalGamesInLibrary: 45,
                                    totalPlatinum: 12,
                                    totalCompleted: 8,
                                    totalPlaying: 15,
                                    totalWishlist: 7,
                                    totalAbandoned: 3,
                                    totalCustomGames: 5,
                                    totalHoursPlayed: 324.5,
                                    averageProgress: 67.8
                                }
                            }
                        }
                    }
                }
            },
            401: {
                description: 'Unauthorized - Invalid or missing token',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string()
                        }),
                        example: {
                            message: "Unauthorized"
                        }
                    }
                }
            },
            404: {
                description: 'User not found',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string()
                        }),
                        example: {
                            message: "User not found"
                        }
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
            }
        }
    });
}
