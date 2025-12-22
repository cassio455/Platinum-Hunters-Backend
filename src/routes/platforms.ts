import { Router, Request, Response, NextFunction } from 'express';
import { getPlatformsService } from '../services/platform/getPlatformsService.js';

const route = Router();

/**
 * GET /platforms
 * Busca plataformas com suporte a pesquisa por texto
 * Query params:
 *  - search: string (opcional) - busca por nome da plataforma
 *  - page: number (opcional) - página atual (default: 1)
 *  - limit: number (opcional) - itens por página (default: 50)
 */
route.get(
  '/platforms',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;

      const result = await getPlatformsService({
        search: search as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50
      });

      res.json({
        message: 'Platforms retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

export default route;
