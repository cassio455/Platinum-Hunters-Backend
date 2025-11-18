import { Router, Request, Response, NextFunction } from "express";
import { validate } from "../middlewares/validateSchema.js";
import { 
  getGamesValidation, 
  getGameDetailsValidation, 
  postFiltersValidation 
} from "../models/schemas/game.js"; // Criaremos este arquivo
import { getGamesService } from "../services/game/getGamesService.js";
import { getGameDetailsService } from "../services/game/getGameDetailsService.js";

const route = Router();

/**
 * Endpoint 1: GET /games (GetGamesWithPaginations)
 * Busca paginada de jogos, com busca textual simples.
 */
route.get(
  '/games',
  validate(getGamesValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, q } = req.query;
      
      const result = await getGamesService({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        q: q as string | undefined
      });
      
      res.json({
        message: 'Games retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Endpoint 2: GET /games/:gameId (GetGameDetails)
 * Busca detalhes de um jogo específico pelo ID.
 */
route.get(
  '/games/:gameId',
  validate(getGameDetailsValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameId } = req.params;
      const game = await getGameDetailsService(gameId);
      
      res.json({
        message: 'Game details retrieved successfully',
        data: game
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Endpoint 3: POST /games/filters (PostFilters)
 * Busca paginada usando filtros complexos no body.
 */
route.post(
  '/games/filters',
  validate(postFiltersValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, ...filters } = req.body;

      const result = await getGamesService({
        page: page || 1,
        limit: limit || 20,
        filters: filters
      });
      
      res.json({
        message: 'Games retrieved successfully with filters',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

export default route;