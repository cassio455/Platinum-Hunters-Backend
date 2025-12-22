import { Router, Request, Response, NextFunction } from 'express';
import { getGenresService } from '../services/genre/getGenresService.js';

const route = Router();

/**
 * GET /genres
 * Busca gêneros com suporte a pesquisa por texto
 * Query params:
 *  - search: string (opcional) - busca por nome do gênero
 *  - page: number (opcional) - página atual (default: 1)
 *  - limit: number (opcional) - itens por página (default: 50)
 */
route.get(
  '/genres',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;

      const result = await getGenresService({
        search: search as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50
      });

      res.json({
        message: 'Genres retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

export default route;
