import { z } from "zod";

// Validação para Criar Título
export const manageTitleSchema = z.object({
  body: z.object({
    name: z.string().min(1, "O nome do título é obrigatório"),
    cost: z.number().min(0, "O custo não pode ser negativo"),
  }),
});

// Validação para Atualizar Título
export const updateTitleSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID deve ser um UUID válido"),
  }),
  body: z.object({
    name: z.string().min(1, "O nome do título é obrigatório"),
    cost: z.number().min(0, "O custo não pode ser negativo"),
  }),
});

// Validação para Deletar Título (valida o ID na URL)
export const deleteTitleSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID deve ser um UUID válido"),
  }),
});

// Validação para Criar/Editar Desafio
export const manageChallengeSchema = z.object({
  body: z.object({
    day: z.number(),
    title: z.string().min(1, "O título é obrigatório"),
    points: z.number().min(1, "Os pontos devem ser maiores que 0"),
  }),
});

// Validação para Deletar Desafio (valida o parâmetro day)
// O express recebe params como string, mas podemos usar regex para garantir que é número
export const deleteChallengeSchema = z.object({
  params: z.object({
    day: z.string().regex(/^\d+$/, "O dia deve ser um número"),
  }),
});

// Validação para Completar Desafio
export const completeChallengeSchema = z.object({
  body: z.object({
    day: z.number(),
  }),
});

// Validação para Comprar Título
export const buyTitleSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    cost: z.number().min(1),
  }),
});

// Validação para Equipar Título
export const equipTitleSchema = z.object({
  body: z.object({
    title: z.string().min(1),
  }),
});