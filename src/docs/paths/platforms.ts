import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export function registerPlatformsPaths(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: 'get',
    path: '/platforms',
    description: 'Get a list of platforms with optional search filter',
    summary: 'Get platforms',
    tags: ['Platforms'],
    request: {
      query: z.object({
        search: z.string().optional().openapi({
          description: 'Search query to filter platforms by name',
          example: 'playstation'
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
        description: 'Platforms retrieved successfully',
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
              message: 'Platforms retrieved successfully',
              data: {
                items: [
                  {
                    _id: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'PlayStation 5'
                  },
                  {
                    _id: '123e4567-e89b-12d3-a456-426614174001',
                    name: 'Xbox Series S/X'
                  },
                  {
                    _id: '123e4567-e89b-12d3-a456-426614174002',
                    name: 'PC'
                  }
                ],
                pagination: {
                  page: 1,
                  limit: 50,
                  total: 15,
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
