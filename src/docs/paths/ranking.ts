import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { 
    manageTitleSchema,
    updateTitleSchema, 
    deleteTitleSchema,
    manageChallengeSchema,
    deleteChallengeSchema,
    completeChallengeSchema,
    buyTitleSchema,
    equipTitleSchema
} from '../../models/schemas/rankingSchemas.js';

export function registerRankingPaths(registry: OpenAPIRegistry): void {
    
    // ==================== ROTAS PÚBLICAS ====================
    
    // GET /shop/titles - Listar todos os títulos disponíveis
    registry.registerPath({
        method: 'get',
        path: '/shop/titles',
        description: 'Get all available titles in the shop',
        summary: 'List all titles',
        tags: ['Shop & Ranking'],
        responses: {
            200: {
                description: 'List of titles',
                content: {
                    'application/json': {
                        schema: z.array(z.object({
                            _id: z.string(),
                            name: z.string(),
                            cost: z.number()
                        })),
                        example: [
                            { _id: "123", name: "🌸 Explorador de Sakura 🌸", cost: 100 },
                            { _id: "456", name: "⚔️ Caçador de Elite ⚔️", cost: 200 }
                        ]
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // GET /challenges - Listar todos os desafios
    registry.registerPath({
        method: 'get',
        path: '/challenges',
        description: 'Get all daily challenges',
        summary: 'List all challenges',
        tags: ['Shop & Ranking'],
        responses: {
            200: {
                description: 'List of challenges',
                content: {
                    'application/json': {
                        schema: z.array(z.object({
                            day: z.number(),
                            title: z.string(),
                            points: z.number()
                        })),
                        example: [
                            { day: 1, title: "Jogue 30 minutos em qualquer jogo", points: 50 },
                            { day: 2, title: "Termine 1 review de um jogo", points: 75 }
                        ]
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // GET /ranking - Ranking de usuários
    registry.registerPath({
        method: 'get',
        path: '/ranking',
        description: 'Get the user ranking sorted by ranking points',
        summary: 'Get ranking',
        tags: ['Shop & Ranking'],
        responses: {
            200: {
                description: 'User ranking',
                content: {
                    'application/json': {
                        schema: z.array(z.object({
                            id: z.string(),
                            name: z.string(),
                            avatar: z.string(),
                            rankingPoints: z.number(),
                            equippedTitle: z.string().nullable(),
                            completedChallenges: z.array(z.number())
                        })),
                        example: [
                            {
                                id: "user-1",
                                name: "kaori",
                                avatar: "https://i.pravatar.cc/100?img=5",
                                rankingPoints: 15300,
                                equippedTitle: "🌸 Explorador de Sakura 🌸",
                                completedChallenges: [1, 2, 3, 4, 5]
                            }
                        ]
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // ==================== ROTAS DE ADMIN ====================

    // POST /shop/manage/title - Criar título (ADMIN)
    registry.registerPath({
        method: 'post',
        path: '/shop/manage/title',
        description: 'Create a new title in the shop (Admin only)',
        summary: 'Create title',
        tags: ['Shop & Ranking - Admin'],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: manageTitleSchema.shape.body,
                        example: {
                            name: "🎮 Gamer Profissional 🎮",
                            cost: 500
                        }
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Title created successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            title: z.object({
                                _id: z.string(),
                                name: z.string(),
                                cost: z.number()
                            })
                        }),
                        example: {
                            message: "Título criado!",
                            title: {
                                _id: "abc123",
                                name: "🎮 Gamer Profissional 🎮",
                                cost: 500
                            }
                        }
                    }
                }
            },
            400: {
                description: 'Title already exists',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            401: {
                description: 'Unauthorized - Invalid or missing token',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            403: {
                description: 'Forbidden - Admin access required',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // PUT /shop/manage/title/:id - Atualizar título (ADMIN)
    registry.registerPath({
        method: 'put',
        path: '/shop/manage/title/{id}',
        description: 'Update an existing title in the shop (Admin only)',
        summary: 'Update title',
        tags: ['Shop & Ranking - Admin'],
        security: [{ bearerAuth: [] }],
        request: {
            params: updateTitleSchema.shape.params,
            body: {
                content: {
                    'application/json': {
                        schema: updateTitleSchema.shape.body,
                        example: {
                            name: "🎮 Gamer Profissional 🎮",
                            cost: 600
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Title updated successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            title: z.object({
                                _id: z.string(),
                                name: z.string(),
                                cost: z.number()
                            })
                        }),
                        example: {
                            message: "Título atualizado!",
                            title: {
                                _id: "abc123",
                                name: "🎮 Gamer Profissional 🎮",
                                cost: 600
                            }
                        }
                    }
                }
            },
            400: {
                description: 'Title name already exists',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            401: {
                description: 'Unauthorized - Invalid or missing token',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            403: {
                description: 'Forbidden - Admin access required',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            404: {
                description: 'Title not found',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // DELETE /shop/manage/title/:id - Deletar título (ADMIN)
    registry.registerPath({
        method: 'delete',
        path: '/shop/manage/title/{id}',
        description: 'Delete a title from the shop (Admin only)',
        summary: 'Delete title',
        tags: ['Shop & Ranking - Admin'],
        security: [{ bearerAuth: [] }],
        request: {
            params: deleteTitleSchema.shape.params
        },
        responses: {
            200: {
                description: 'Title deleted successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            id: z.string()
                        }),
                        example: {
                            message: "Título excluído!",
                            id: "abc123"
                        }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            403: {
                description: 'Forbidden - Admin access required',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // POST /ranking/manage/challenge - Criar/Editar desafio (ADMIN)
    registry.registerPath({
        method: 'post',
        path: '/ranking/manage/challenge',
        description: 'Create or update a daily challenge (Admin only)',
        summary: 'Manage challenge',
        tags: ['Shop & Ranking - Admin'],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: manageChallengeSchema.shape.body,
                        example: {
                            day: 1,
                            title: "Complete 5 jogos",
                            points: 100
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Challenge updated successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            challenge: z.object({
                                day: z.number(),
                                title: z.string(),
                                points: z.number()
                            })
                        })
                    }
                }
            },
            201: {
                description: 'Challenge created successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            challenge: z.object({
                                day: z.number(),
                                title: z.string(),
                                points: z.number()
                            })
                        })
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            403: {
                description: 'Forbidden - Admin access required',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // DELETE /ranking/manage/challenge/:day - Deletar desafio (ADMIN)
    registry.registerPath({
        method: 'delete',
        path: '/ranking/manage/challenge/{day}',
        description: 'Delete a daily challenge and clear user progress for that day (Admin only)',
        summary: 'Delete challenge',
        tags: ['Shop & Ranking - Admin'],
        security: [{ bearerAuth: [] }],
        request: {
            params: deleteChallengeSchema.shape.params
        },
        responses: {
            200: {
                description: 'Challenge deleted successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            day: z.number()
                        }),
                        example: {
                            message: "Desafio excluído e histórico limpo!",
                            day: 5
                        }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            403: {
                description: 'Forbidden - Admin access required',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // ==================== AÇÕES DO USUÁRIO ====================

    // POST /ranking/complete - Completar desafio
    registry.registerPath({
        method: 'post',
        path: '/ranking/complete',
        description: 'Complete a daily challenge and earn points and coins. Points are fetched from the challenge model to prevent manipulation.',
        summary: 'Complete challenge',
        tags: ['Shop & Ranking'],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: completeChallengeSchema.shape.body,
                        example: {
                            day: 1
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Challenge completed successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            newPoints: z.number(),
                            newCoins: z.number(),
                            completedChallenges: z.array(z.number())
                        }),
                        example: {
                            message: "Desafio completado!",
                            newPoints: 150,
                            newCoins: 150,
                            completedChallenges: [1]
                        }
                    }
                }
            },
            400: {
                description: 'Challenge already completed',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() }),
                        example: { message: "Desafio já completado." }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            404: {
                description: 'User or challenge not found',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // POST /shop/buy - Comprar título
    registry.registerPath({
        method: 'post',
        path: '/shop/buy',
        description: 'Buy a title from the shop using coins',
        summary: 'Buy title',
        tags: ['Shop & Ranking'],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: buyTitleSchema.shape.body,
                        example: {
                            title: "🌸 Explorador de Sakura 🌸",
                            cost: 100
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Title purchased successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            coins: z.number(),
                            ownedTitles: z.array(z.string())
                        }),
                        example: {
                            message: "Título comprado!",
                            coins: 50,
                            ownedTitles: ["🌸 Explorador de Sakura 🌸"]
                        }
                    }
                }
            },
            400: {
                description: 'Insufficient coins or title already owned',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            404: {
                description: 'User not found',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });

    // POST /shop/equip - Equipar título
    registry.registerPath({
        method: 'post',
        path: '/shop/equip',
        description: 'Equip a title that you own',
        summary: 'Equip title',
        tags: ['Shop & Ranking'],
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: equipTitleSchema.shape.body,
                        example: {
                            title: "🌸 Explorador de Sakura 🌸"
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Title equipped successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            equippedTitle: z.string()
                        }),
                        example: {
                            message: "Título equipado!",
                            equippedTitle: "🌸 Explorador de Sakura 🌸"
                        }
                    }
                }
            },
            400: {
                description: 'Title not owned',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() }),
                        example: { message: "Você não possui este título" }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            404: {
                description: 'User not found',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            },
            500: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() })
                    }
                }
            }
        }
    });
}
