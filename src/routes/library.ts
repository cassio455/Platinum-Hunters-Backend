import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middlewares/validateSchema.js';
import { LibraryItemStatus } from '../models/libraryItemStatus.js';
import { 
  addGameToLibraryValidation, 
  getLibraryValidation, 
  updateProgressValidation,
  removeGameValidation 
} from '../models/schemas/library.js';
import { addGameToLibraryService } from '../services/library/addGameToLibraryService.js';
import { getUserLibraryService } from '../services/library/getUserLibraryService.js';
import { updateGameProgressService } from '../services/library/updateGameProgressService.js';
import { removeGameFromLibraryService } from '../services/library/removeGameFromLibraryService.js';

const route = Router();

route.post(
  '/library',
  validate(addGameToLibraryValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = 'temp-user-id';
      const result = await addGameToLibraryService({
        userId,
        ...req.body
      });
      
      res.status(201).json({
        message: 'Game added to library',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

route.get(
  '/library',
  validate(getLibraryValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = 'temp-user-id';
      const { status, page, limit } = req.query;
      
      const result = await getUserLibraryService({
        userId,
        status: status as LibraryItemStatus,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });
      
      res.json({
        message: 'Library retrieved',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

route.patch(
  '/library/:gameId',
  validate(updateProgressValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = 'temp-user-id';
      const { gameId } = req.params;
      
      const result = await updateGameProgressService({
        userId,
        gameId,
        ...req.body
      });
      
      res.json({
        message: 'Progress updated',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

route.delete(
  '/library/:gameId',
  validate(removeGameValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = 'temp-user-id';
      const { gameId } = req.params;
      
      const result = await removeGameFromLibraryService({
        userId,
        gameId
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default route;