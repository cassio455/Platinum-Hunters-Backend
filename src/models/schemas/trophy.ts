import { z } from 'zod';

// Schema para rastrear jogo (Track)
export const trackTrophiesSchema = z.object({
  body: z.object({
    // Removi o objeto interno para corrigir o erro. 
    // O Zod já trata como obrigatório por padrão.
    gameId: z.string().min(1, "Game ID is required"), 
    isTracked: z.boolean() 
  })
});

// Schema para marcar um troféu (Toggle)
export const toggleTrophySchema = z.object({
  body: z.object({
    gameId: z.string().min(1),
    trophyName: z.string().min(1)
  })
});

// Schema para marcar todos (Toggle All)
export const toggleAllTrophiesSchema = z.object({
  body: z.object({
    gameId: z.string().min(1),
    allTrophies: z.array(z.string()),
    markAll: z.boolean()
  })
});

// Schema para Criar Troféu Customizado
export const createTrophySchema = z.object({
  body: z.object({
    gameId: z.string().min(1),
    name: z.string().min(1, "Name is required"), // .min(1) é o jeito seguro de validar string vazia
    description: z.string().min(1, "Description is required"),
    difficulty: z.string().default("bronze")
  })
});

// Schema para Editar Troféu
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

// Schema para Deletar Troféu
export const deleteTrophySchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});