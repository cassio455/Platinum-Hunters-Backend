// src/models/schemas/game.ts
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Validação para GET /games (GetGamesWithPaginations)
export const getGamesValidation = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(), // Valida se é um número em string
    limit: z.string().regex(/^\d+$/).optional(),
    q: z.string().optional() // 'q' para busca textual
  }),
  params: z.object({}),
  body: z.object({})
});

// Validação para GET /games/:gameId (GetGameDetails)
export const getGameDetailsValidation = z.object({
  params: z.object({
    gameId: z.string().min(1, 'Game ID is required') // Valida o ID na URL
  }),
  query: z.object({}),
  body: z.object({})
});

// Validação para POST /games/filters (PostFilters)
export const postFiltersValidation = z.object({
  body: z.object({
    genres: z.array(z.string()).optional(),
    plataformas: z.array(z.string()).optional(),
    sort: z.enum(['rating_desc', 'rating_asc', 'name']).optional(), // Ex: 'rating_desc'
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional()
  }),
  params: z.object({}),
  query: z.object({})
});