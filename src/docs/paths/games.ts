import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerGamesPaths(registry: OpenAPIRegistry): void {
    registry.registerPath({
        method: 'get',
        path: '/games',
        description: 'Get a paginated list of games with optional text search',
        summary: 'Get games with pagination',
        tags: ['Games'],
        request: {
            query: z.object({
                page: z.string().regex(/^\d+$/).optional().openapi({
                    description: 'Page number for pagination',
                    example: '1'
                }),
                limit: z.string().regex(/^\d+$/).optional().openapi({
                    description: 'Number of items per page',
                    example: '20'
                }),
                q: z.string().optional().openapi({
                    description: 'Text search query',
                    example: 'God of War'
                })
            })
        },
        responses: {
            200: {
                description: 'Games retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                items: z.array(z.object({
                                    _id: z.string(),
                                    title: z.string(),
                                    backgroundImage: z.string(),
                                    releaseDate: z.string(),
                                    rating: z.number().optional(),
                                    genres: z.array(z.string()).optional(),
                                    plataformas: z.array(z.string()).optional()
                                })),
                                total: z.number(),
                                page: z.number(),
                                limit: z.number(),
                                totalPages: z.number()
                            })
                        }),
                        example: {
                            message: 'Games retrieved successfully',
                            data: {
                                items: [
                                    {
                                        _id: '507f1f77bcf86cd799439011',
                                        title: 'God of War',
                                        backgroundImage: 'https://example.com/image.jpg',
                                        releaseDate: '2018-04-20',
                                        rating: 9.5,
                                        genres: ['Action', 'Adventure'],
                                        plataformas: ['PS4', 'PS5']
                                    }
                                ],
                                total: 100,
                                page: 1,
                                limit: 20,
                                totalPages: 5
                            }
                        }
                    }
                }
            },
            400: {
                description: 'Invalid request parameters',
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

    registry.registerPath({
        method: 'get',
        path: '/games/{gameId}',
        description: 'Get detailed information about a specific game',
        summary: 'Get game details',
        tags: ['Games'],
        request: {
            params: z.object({
                gameId: z.string().openapi({
                    description: 'Game ID',
                    example: '507f1f77bcf86cd799439011'
                })
            })
        },
        responses: {
            200: {
                description: 'Game details retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                _id: z.string(),
                                title: z.string(),
                                backgroundImage: z.string(),
                                releaseDate: z.string(),
                                rating: z.number().optional(),
                                genres: z.array(z.string()).optional(),
                                plataformas: z.array(z.string()).optional(),
                                description: z.string().optional(),
                                developer: z.string().optional(),
                                publisher: z.string().optional()
                            })
                        }),
                        example: {
                            message: 'Game details retrieved successfully',
                            data: {
                                _id: '507f1f77bcf86cd799439011',
                                title: 'God of War',
                                backgroundImage: 'https://example.com/image.jpg',
                                releaseDate: '2018-04-20',
                                rating: 9.5,
                                genres: ['Action', 'Adventure'],
                                plataformas: ['PS4', 'PS5'],
                                description: 'An epic adventure game...',
                                developer: 'Santa Monica Studio',
                                publisher: 'Sony Interactive Entertainment'
                            }
                        }
                    }
                }
            },
            404: {
                description: 'Game not found',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string()
                        }),
                        example: {
                            message: 'Game not found'
                        }
                    }
                }
            },
            400: {
                description: 'Invalid game ID',
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

    registry.registerPath({
        method: 'post',
        path: '/games/filters',
        description: 'Get a paginated list of games using complex filters',
        summary: 'Search games with filters',
        tags: ['Games'],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            genres: z.array(z.string()).optional().openapi({
                                description: 'Filter by genres',
                                example: ['Action', 'Adventure']
                            }),
                            plataformas: z.array(z.string()).optional().openapi({
                                description: 'Filter by platforms',
                                example: ['PS4', 'PS5']
                            }),
                            sort: z.enum(['rating_desc', 'rating_asc', 'name']).optional().openapi({
                                description: 'Sort order',
                                example: 'rating_desc'
                            }),
                            page: z.number().int().positive().optional().openapi({
                                description: 'Page number',
                                example: 1
                            }),
                            limit: z.number().int().positive().optional().openapi({
                                description: 'Items per page',
                                example: 20
                            })
                        }),
                        example: {
                            genres: ['Action', 'RPG'],
                            plataformas: ['PS5'],
                            sort: 'rating_desc',
                            page: 1,
                            limit: 20
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Games retrieved successfully with filters',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                items: z.array(z.object({
                                    _id: z.string(),
                                    title: z.string(),
                                    backgroundImage: z.string(),
                                    releaseDate: z.string(),
                                    rating: z.number().optional(),
                                    genres: z.array(z.string()).optional(),
                                    plataformas: z.array(z.string()).optional()
                                })),
                                total: z.number(),
                                page: z.number(),
                                limit: z.number(),
                                totalPages: z.number()
                            })
                        }),
                        example: {
                            message: 'Games retrieved successfully with filters',
                            data: {
                                items: [
                                    {
                                        _id: '507f1f77bcf86cd799439011',
                                        title: 'God of War Ragnarök',
                                        backgroundImage: 'https://example.com/image.jpg',
                                        releaseDate: '2022-11-09',
                                        rating: 9.8,
                                        genres: ['Action', 'Adventure', 'RPG'],
                                        plataformas: ['PS4', 'PS5']
                                    }
                                ],
                                total: 50,
                                page: 1,
                                limit: 20,
                                totalPages: 3
                            }
                        }
                    }
                }
            },
            400: {
                description: 'Invalid request body',
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
