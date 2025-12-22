import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const getGamesValidation = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().refine(
      (val) => !val || parseInt(val) >= 1,
      { message: 'Page must be at least 1' }
    ),
    limit: z.string().regex(/^\d+$/).optional().refine(
      (val) => !val || (parseInt(val) >= 1 && parseInt(val) <= 50),
      { message: 'Limit must be between 1 and 50' }
    ),
    q: z.string().optional()
  }),
  params: z.object({}),
  body: z.object({}).optional()
});

export const getGameDetailsValidation = z.object({
  params: z.object({
    gameId: z.string().min(1, 'Game ID is required')
  }),
  query: z.object({}),
  body: z.object({}).optional()
});

export const postFiltersValidation = z.object({
  body: z.object({
    genres: z.array(z.string()).optional(),
    plataformas: z.array(z.string()).optional(),
    sort: z.enum(['rating_desc', 'rating_asc', 'name']).optional(),
    page: z.number().int().min(1, 'Page must be at least 1').optional(),
    limit: z.number().int().min(1, 'Limit must be at least 1').max(50, 'Limit cannot exceed 50').optional()
  }),
  params: z.object({}),
  query: z.object({})
});