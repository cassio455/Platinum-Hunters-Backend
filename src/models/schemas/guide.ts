import { z } from "zod";

// Schema para cada troféu do guia
export const trofeuSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  tipo: z.string().min(1),
  descricao: z.string().min(1),
  raridade: z.string().min(1),
  comoObter: z.string().min(1)
});

// Schema para cada comentário
export const comentarioSchema = z.object({
  id: z.string().uuid(),
  autor: z.string().min(1),
  texto: z.string().min(1),
  likes: z.number().int().nonnegative(),
  timestamp: z.string(),
  replies: z.array(z.any()) // Pode detalhar depois se quiser
});

// Schema principal do Guia
export const guideSchema = z.object({
  id: z.string().uuid().optional(), // O backend pode gerar o id
  title: z.string().min(1, "Título obrigatório"),
  game: z.string().min(1, "Jogo obrigatório"),
  roadmap: z.string().min(1, "Roadmap obrigatório"),
  likes: z.number().int().nonnegative().optional(),
  comentarios: z.array(comentarioSchema).optional(),
  trofeus: z.array(trofeuSchema).min(1, "Deve ter pelo menos um troféu")
});