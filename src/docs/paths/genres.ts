import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerGenresPaths(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: 'get',
    path: '/genres',
    description: 'Get a list of genres with optional search filter',
    summary: 'Get genres',
    tags: ['Genres'],
    request: {
      query: z.object({
        search: z.string().optional().openapi({
          description: 'Search query to filter genres by name',
          example: 'action'
        }),
        page: z.string().regex(/^\d+$/).optional().openapi({
          description: 'Page number for pagination',
          example: '1'
        }),
        limit: z.string().regex(/^\d+$/).optional().openapi({
          description: 'Number of items per page (max 50)',
          example: '50'
        })
      })
    },
    responses: {
      200: {
        description: 'Genres retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
              data: z.object({
                items: z.array(z.object({
                  _id: z.string(),
                  name: z.string()
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
              message: 'Genres retrieved successfully',
              data: {
                items: [
                  {
                    _id: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Action'
                  },
                  {
                    _id: '123e4567-e89b-12d3-a456-426614174001',
                    name: 'Adventure'
                  },
                  {
                    _id: '123e4567-e89b-12d3-a456-426614174002',
                    name: 'RPG'
                  }
                ],
                pagination: {
                  page: 1,
                  limit: 50,
                  total: 20,
                  totalPages: 1
                }
              }
            }
          }
        }
      },
      500: {
        description: 'Internal server error'
      }
    }
  });
}
