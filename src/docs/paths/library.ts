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
                    LibraryItemStatus.WISHLIST,
                    LibraryItemStatus.PLATINUM
                ]).optional(),
                name: z.string().optional(),
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
                                    updatedAt: z.string().datetime(),
                                    gameDetails: z.object({
                                        nome: z.string(),
                                        plataformas: z.array(z.string()).optional(),
                                        genres: z.array(z.string()).optional(),
                                        rating: z.number().optional(),
                                        playtime: z.number().optional(),
                                        ratings_count: z.number().optional(),
                                        backgroundimage: z.string().optional(),
                                        ano_de_lancamento: z.number().optional()
                                    }).nullable(),
                                    trophyProgress: z.object({
                                        totalCompleted: z.number(),
                                        totalTrophies: z.number(),
                                        progressPercentage: z.number()
                                    })
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
                                        status: "Jogando",
                                        progress: 50,
                                        platinum: false,
                                        hoursPlayed: 25,
                                        createdAt: "2025-11-11T10:30:00.000Z",
                                        updatedAt: "2025-11-11T15:45:00.000Z",
                                        gameDetails: {
                                            nome: "Grand Theft Auto V",
                                            plataformas: ["PlayStation 5", "PlayStation 4", "PC"],
                                            genres: ["Action", "Adventure"],
                                            rating: 4.47,
                                            playtime: 31,
                                            ratings_count: 6805,
                                            backgroundimage: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
                                            ano_de_lancamento: 2013
                                        },
                                        trophyProgress: {
                                            totalCompleted: 15,
                                            totalTrophies: 50,
                                            progressPercentage: 30
                                        }
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

    // ==================== CUSTOM GAMES DOCUMENTATION ====================

    registry.registerPath({
        method: 'post',
        path: '/library/custom-games',
        description: 'Create a custom/local game that only the user can see',
        summary: 'Create custom game',
        tags: ['Library', 'Custom Games'],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            nome: z.string(),
                            backgroundimage: z.string().url().optional(),
                            plataformas: z.array(z.string()).optional(),
                            genres: z.array(z.string()).optional(),
                            ano_de_lancamento: z.number().int().optional(),
                            description: z.string().optional()
                        }),
                        example: {
                            nome: "My Custom Game",
                            backgroundimage: "https://example.com/image.jpg",
                            plataformas: ["PC", "Custom Console"],
                            genres: ["RPG", "Adventure"],
                            ano_de_lancamento: 2023,
                            description: "A game I'm developing"
                        }
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Custom game created successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                _id: z.string(),
                                userId: z.string(),
                                nome: z.string(),
                                backgroundimage: z.string().optional(),
                                plataformas: z.array(z.string()),
                                genres: z.array(z.string()),
                                ano_de_lancamento: z.number().optional(),
                                description: z.string().optional(),
                                createdAt: z.string(),
                                updatedAt: z.string()
                            })
                        })
                    }
                }
            },
            409: {
                description: 'Game with this name already exists',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    registry.registerPath({
        method: 'get',
        path: '/library/custom-games',
        description: 'Get all custom games created by the user with filters by name and status',
        summary: 'Get custom games',
        tags: ['Library', 'Custom Games'],
        request: {
            query: z.object({
                status: z.enum([
                    LibraryItemStatus.PLAYING,
                    LibraryItemStatus.COMPLETED,
                    LibraryItemStatus.ABANDONED,
                    LibraryItemStatus.WISHLIST,
                    LibraryItemStatus.PLATINUM
                ]).optional(),
                name: z.string().optional(),
                page: z.string().optional(),
                limit: z.string().optional()
            })
        },
        responses: {
            200: {
                description: 'Custom games retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                items: z.array(z.object({
                                    _id: z.string(),
                                    userId: z.string(),
                                    nome: z.string(),
                                    backgroundimage: z.string().optional(),
                                    plataformas: z.array(z.string()),
                                    genres: z.array(z.string()),
                                    ano_de_lancamento: z.number().optional(),
                                    description: z.string().optional(),
                                    status: z.string().nullable(),
                                    createdAt: z.string(),
                                    updatedAt: z.string()
                                })),
                                total: z.number(),
                                page: z.number(),
                                limit: z.number(),
                                totalPages: z.number()
                            })
                        }),
                        example: {
                            message: "Custom games retrieved successfully",
                            data: {
                                items: [
                                    {
                                        _id: "custom-game-123",
                                        userId: "temp-user-id",
                                        nome: "My Custom Game",
                                        backgroundimage: "https://example.com/image.jpg",
                                        plataformas: ["PC", "Custom Console"],
                                        genres: ["RPG", "Adventure"],
                                        ano_de_lancamento: 2023,
                                        description: "A game I'm developing",
                                        status: "Jogando",
                                        createdAt: "2025-11-11T10:30:00.000Z",
                                        updatedAt: "2025-11-11T15:45:00.000Z"
                                    }
                                ],
                                total: 1,
                                page: 1,
                                limit: 20,
                                totalPages: 1
                            }
                        }
                    }
                }
            }
        }
    });

    registry.registerPath({
        method: 'patch',
        path: '/library/custom-games/{gameId}',
        description: 'Update a custom game',
        summary: 'Update custom game',
        tags: ['Library', 'Custom Games'],
        request: {
            params: z.object({
                gameId: z.string()
            }),
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            nome: z.string().optional(),
                            backgroundimage: z.string().url().optional(),
                            plataformas: z.array(z.string()).optional(),
                            genres: z.array(z.string()).optional(),
                            ano_de_lancamento: z.number().int().optional(),
                            description: z.string().optional()
                        })
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Custom game updated successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: z.object({
                                _id: z.string(),
                                userId: z.string(),
                                nome: z.string(),
                                backgroundimage: z.string().optional(),
                                plataformas: z.array(z.string()),
                                genres: z.array(z.string()),
                                ano_de_lancamento: z.number().optional(),
                                description: z.string().optional(),
                                createdAt: z.string(),
                                updatedAt: z.string()
                            })
                        })
                    }
                }
            },
            403: {
                description: 'Forbidden - not your game',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            404: {
                description: 'Custom game not found',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    registry.registerPath({
        method: 'delete',
        path: '/library/custom-games/{gameId}',
        description: 'Delete a custom game and remove it from library',
        summary: 'Delete custom game',
        tags: ['Library', 'Custom Games'],
        request: {
            params: z.object({
                gameId: z.string()
            })
        },
        responses: {
            200: {
                description: 'Custom game deleted successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            gameId: z.string()
                        })
                    }
                }
            },
            403: {
                description: 'Forbidden - not your game',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            404: {
                description: 'Custom game not found',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });
}
