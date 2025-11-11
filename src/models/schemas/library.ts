import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { LibraryItemStatus } from '../libraryItemStatus.js';

extendZodWithOpenApi(z);

const statusEnum = z.enum([
  LibraryItemStatus.PLAYING,
  LibraryItemStatus.COMPLETED,
  LibraryItemStatus.ABANDONED,
  LibraryItemStatus.WISHLIST
]);

export const UpdateGameProgressSchema = z.object({
    gameId: z.string().uuid().openapi({description: "The unique identifier of the user's game"}),
    progress: z.number().min(0).max(100).optional().openapi({description: "The user's progress in the game, represented as a percentage"})
})

export type GameProgress = z.infer<typeof UpdateGameProgressSchema>;

export const addGameToLibraryValidation = z.object({
  body: z.object({
    gameId: z.string().min(1, 'Game ID is required'),
    status: statusEnum.optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const getLibraryValidation = z.object({
  params: z.object({}),
  query: z.object({
    status: statusEnum.optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional()
  }),
  body: z.object({})
});

export const updateProgressValidation = z.object({
  params: z.object({
    gameId: z.string().min(1, 'Game ID is required')
  }),
  body: z.object({
    progress: z.number().min(0).max(100).optional(),
    platinum: z.boolean().optional(),
    hoursPlayed: z.number().min(0).optional(),
    status: statusEnum.optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  }),
  query: z.object({})
});

export const removeGameValidation = z.object({
  params: z.object({
    gameId: z.string().min(1, 'Game ID is required')
  }),
  body: z.object({}),
  query: z.object({})
});

export const updateGameProgressValidation = z.object({
    params: z.object({
        gameId: z.string().uuid()
    }),
    body: z.object({
        progress: z.number().min(0).max(100).optional()
    }),
    query: z.object({}).optional()
});