import { NextFunction, Router, Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import { UserRole } from "../models/user.js";
import { validate } from "../middlewares/validateSchema.js";
import { z } from "zod";

const route = Router();

export const EditGuideInputSchema = z.object({
  guideId: z.string().uuid(),
  title: z.string().min(3).max(100).optional(),
  content: z.string().min(10).optional(),
});

route.post(
  '/library',
  authMiddleware,
  authorize(UserRole.ADMIN),
  validate(EditGuideInputSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const result = await Promise.resolve();
      return res.status(200).json({
        message: 'Guide edited successfully',
      })
    } catch (error) {
      next(error);
    }
  }
);