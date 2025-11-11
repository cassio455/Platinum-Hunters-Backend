import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { LibraryItemStatus } from '../../models/libraryItemStatus.js';

export function registerLibraryPaths(registry: OpenAPIRegistry): void {
    registry.registerPath({
        method: 'post',
        path: '/library',
        description: 'Add a game to user library',
        summary: 'Add game to library',
        tags: ['Library'],
        request: {
            body: { 
                content: { 
                    'application/json': { 
                        schema: z.object({
                            gameId: z.string(),
                            status: z.enum([
                                LibraryItemStatus.PLAYING,
                                LibraryItemStatus.COMPLETED,
                                LibraryItemStatus.ABANDONED,
                                LibraryItemStatus.WISHLIST
                            ]).optional()
                        }),
                        example: {
                            gameId: "3498",
                            status: "playing"
                        }
                    } 
                } 
            },
        },
        responses: {
            201: { 
                description: 'Game added successfully', 
                content: { 
                    'application/json': { 
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                id: z.string(),
                                userId: z.string(),
                                gameId: z.string(),
                                status: z.string(),
                                progress: z.number(),
                                platinum: z.boolean(),
                                hoursPlayed: z.number(),
                                createdAt: z.string().datetime()
                            })
                        }),
                        example: {
                            message: "Game added to library",
                            data: {
                                id: "673bd123abc456def789",
                                userId: "temp-user-id",
                                gameId: "3498",
                                status: "playing",
                                progress: 0,
                                platinum: false,
                                hoursPlayed: 0,
                                createdAt: "2025-11-11T10:30:00.000Z"
                            }
                        }
                    } 
                } 
            },
            400: { 
                description: 'Invalid data or game already in library', 
                content: { 
                    'application/json': { 
                        schema: z.object({ 
                            message: z.string()
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
        method: 'get',
        path: '/library',
        description: 'Get user library with pagination and filters',
        summary: 'Get user library',
        tags: ['Library'],
        request: {
            query: z.object({
                status: z.enum([
                    LibraryItemStatus.PLAYING,
                    LibraryItemStatus.COMPLETED,
                    LibraryItemStatus.ABANDONED,
                    LibraryItemStatus.WISHLIST
                ]).optional(),
                page: z.string().optional(),
                limit: z.string().optional()
            })
        },
        responses: {
            200: { 
                description: 'Library retrieved successfully', 
                content: { 
                    'application/json': { 
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                items: z.array(z.object({
                                    _id: z.string(),
                                    userId: z.string(),
                                    gameId: z.string(),
                                    status: z.string(),
                                    progress: z.number(),
                                    platinum: z.boolean(),
                                    hoursPlayed: z.number(),
                                    createdAt: z.string().datetime(),
                                    updatedAt: z.string().datetime()
                                })),
                                pagination: z.object({
                                    page: z.number(),
                                    limit: z.number(),
                                    total: z.number(),
                                    totalPages: z.number()
                                })
                            })
                        }),
                        example: {
                            message: "Library retrieved",
                            data: {
                                items: [
                                    {
                                        _id: "673bd123abc456def789",
                                        userId: "temp-user-id",
                                        gameId: "3498",
                                        status: "playing",
                                        progress: 50,
                                        platinum: false,
                                        hoursPlayed: 25,
                                        createdAt: "2025-11-11T10:30:00.000Z",
                                        updatedAt: "2025-11-11T15:45:00.000Z"
                                    }
                                ],
                                pagination: {
                                    page: 1,
                                    limit: 20,
                                    total: 1,
                                    totalPages: 1
                                }
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
                            message: z.string()
                        }) 
                    } 
                } 
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/library/{gameId}',
        description: 'Update game progress and status in user library',
        summary: 'Update game progress',
        tags: ['Library'],
        request: {
            params: z.object({
                gameId: z.string()
            }),
            body: { 
                content: { 
                    'application/json': { 
                        schema: z.object({
                            progress: z.number().min(0).max(100).optional(),
                            platinum: z.boolean().optional(),
                            hoursPlayed: z.number().min(0).optional(),
                            status: z.enum([
                                LibraryItemStatus.PLAYING,
                                LibraryItemStatus.COMPLETED,
                                LibraryItemStatus.ABANDONED,
                                LibraryItemStatus.WISHLIST
                            ]).optional()
                        }),
                        example: {
                            progress: 75,
                            hoursPlayed: 30,
                            platinum: false
                        }
                    } 
                } 
            },
        },
        responses: {
            200: { 
                description: 'Progress updated successfully', 
                content: { 
                    'application/json': { 
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                id: z.string(),
                                userId: z.string(),
                                gameId: z.string(),
                                progress: z.number(),
                                platinum: z.boolean(),
                                hoursPlayed: z.number(),
                                status: z.string(),
                                updatedAt: z.string().datetime()
                            })
                        }),
                        example: {
                            message: "Progress updated",
                            data: {
                                id: "673bd123abc456def789",
                                userId: "temp-user-id",
                                gameId: "3498",
                                progress: 75,
                                platinum: false,
                                hoursPlayed: 30,
                                status: "playing",
                                updatedAt: "2025-11-11T16:00:00.000Z"
                            }
                        }
                    } 
                } 
            },
            400: { 
                description: 'Invalid data', 
                content: { 
                    'application/json': { 
                        schema: z.object({ 
                            message: z.string()
                        })
                    } 
                } 
            },
            404: { 
                description: 'Game not found in library', 
                content: { 
                    'application/json': { 
                        schema: z.object({ 
                            message: z.string()
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
        method: 'delete',
        path: '/library/{gameId}',
        description: 'Remove a game from user library',
        summary: 'Remove game from library',
        tags: ['Library'],
        request: {
            params: z.object({
                gameId: z.string()
            })
        },
        responses: {
            200: { 
                description: 'Game removed successfully', 
                content: { 
                    'application/json': { 
                        schema: z.object({
                            message: z.string()
                        }),
                        example: {
                            message: "Game removed from library"
                        }
                    } 
                } 
            },
            404: { 
                description: 'Game not found in library', 
                content: { 
                    'application/json': { 
                        schema: z.object({ 
                            message: z.string()
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
