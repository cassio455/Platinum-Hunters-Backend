import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middlewares/validateSchema.js';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js';
import { UserRole } from '../models/user.js';
import { LibraryItemStatus } from '../models/libraryItemStatus.js';
import { 
  addGameToLibraryValidation, 
  getLibraryValidation, 
  updateProgressValidation,
  removeGameValidation 
} from '../models/schemas/library.js';
import {
  createCustomGameValidation,
  getCustomGamesValidation,
  updateCustomGameValidation,
  deleteCustomGameValidation
} from '../models/schemas/customGame.js';
import { addGameToLibraryService } from '../services/library/addGameToLibraryService.js';
import { getUserLibraryService } from '../services/library/getUserLibraryService.js';
import { updateGameProgressService } from '../services/library/updateGameProgressService.js';
import { removeGameFromLibraryService } from '../services/library/removeGameFromLibraryService.js';
import { createCustomGameService } from '../services/library/createCustomGameService.js';
import { getCustomGamesService } from '../services/library/getCustomGamesService.js';
import { updateCustomGameService } from '../services/library/updateCustomGameService.js';
import { deleteCustomGameService } from '../services/library/deleteCustomGameService.js';

const route = Router();

route.post(
  '/library',
  authMiddleware,
  authorize(UserRole.USER, UserRole.ADMIN, UserRole.MOD),
  validate(addGameToLibraryValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.userId;
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
  authMiddleware,
  authorize(UserRole.USER, UserRole.ADMIN, UserRole.MOD),
  validate(getLibraryValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.userId;
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
  authMiddleware,
  authorize(UserRole.USER, UserRole.ADMIN, UserRole.MOD),
  validate(updateProgressValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.userId;
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
  authMiddleware,
  authorize(UserRole.USER, UserRole.ADMIN, UserRole.MOD),
  validate(removeGameValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.userId;
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

route.post(
  '/library/custom-games',
  authMiddleware,
  authorize(UserRole.USER, UserRole.ADMIN, UserRole.MOD),
  validate(createCustomGameValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const result = await createCustomGameService({
        userId,
        ...req.body
      });
      
      res.status(201).json({
        message: 'Custom game created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

route.get(
  '/library/custom-games',
  authMiddleware,
  authorize(UserRole.USER, UserRole.ADMIN, UserRole.MOD),
  validate(getCustomGamesValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { page, limit } = req.query;
      
      const result = await getCustomGamesService({
        userId,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });
      
      res.json({
        message: 'Custom games retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

route.patch(
  '/library/custom-games/:gameId',
  authMiddleware,
  authorize(UserRole.USER, UserRole.ADMIN, UserRole.MOD),
  validate(updateCustomGameValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { gameId } = req.params;
      
      const result = await updateCustomGameService({
        userId,
        gameId,
        ...req.body
      });
      
      res.json({
        message: 'Custom game updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

route.delete(
  '/library/custom-games/:gameId',
  authMiddleware,
  authorize(UserRole.USER, UserRole.ADMIN, UserRole.MOD),
  validate(deleteCustomGameValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { gameId } = req.params;
      
      const result = await deleteCustomGameService({
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