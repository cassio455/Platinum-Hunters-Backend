import { z } from 'zod';

export const createCustomGameValidation = z.object({
  body: z.object({
    nome: z.string().min(1, 'Game name is required').max(200, 'Game name is too long'),
    backgroundimage: z.string().url('Invalid image URL').optional(),
    plataformas: z.array(z.string()).max(20, 'Too many platforms').optional(),
    genres: z.array(z.string()).max(20, 'Too many genres').optional(),
    ano_de_lancamento: z.number().int().min(1950).max(new Date().getFullYear() + 5).optional(),
    description: z.string().max(1000, 'Description is too long').optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const getCustomGamesValidation = z.object({
  params: z.object({}),
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().refine(
      (val) => !val || parseInt(val) >= 1,
      { message: 'Page must be at least 1' }
    ),
    limit: z.string().regex(/^\d+$/).optional().refine(
      (val) => !val || (parseInt(val) >= 1 && parseInt(val) <= 50),
      { message: 'Limit must be between 1 and 50' }
    )
  }),
  body: z.object({}).optional()
});

export const updateCustomGameValidation = z.object({
  params: z.object({
    gameId: z.string().min(1, 'Game ID is required')
  }),
  body: z.object({
    nome: z.string().min(1, 'Game name is required').max(200, 'Game name is too long').optional(),
    backgroundimage: z.string().url('Invalid image URL').optional(),
    plataformas: z.array(z.string()).max(20, 'Too many platforms').optional(),
    genres: z.array(z.string()).max(20, 'Too many genres').optional(),
    ano_de_lancamento: z.number().int().min(1950).max(new Date().getFullYear() + 5).optional(),
    description: z.string().max(1000, 'Description is too long').optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  }),
  query: z.object({})
});

export const deleteCustomGameValidation = z.object({
  params: z.object({
    gameId: z.string().min(1, 'Game ID is required')
  }),
  body: z.object({}).optional(),
  query: z.object({})
});
