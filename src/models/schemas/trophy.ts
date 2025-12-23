import { z } from 'zod';

export const trackTrophiesSchema = z.object({
  body: z.object({
    gameId: z.string().min(1, "Game ID is required"), 
    isTracked: z.boolean() 
  })
});

export const toggleTrophySchema = z.object({
  body: z.object({
    gameId: z.string().min(1),
    trophyName: z.string().min(1)
  })
});

export const toggleAllTrophiesSchema = z.object({
  body: z.object({
    gameId: z.string().min(1),
    allTrophies: z.array(z.string()),
    markAll: z.boolean()
  })
});

export const createTrophySchema = z.object({
  body: z.object({
    gameId: z.string().min(1),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.string().default("bronze")
  })
});

export const editTrophySchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    difficulty: z.string().optional()
  })
});

export const deleteTrophySchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});