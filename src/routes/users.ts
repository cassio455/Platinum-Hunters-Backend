import { Router, Request, Response, NextFunction } from "express";
import { createUserValidation, loginUserValidation } from "../models/schemas/user.js";
import { validate } from "../middlewares/validateSchema.js";
import { createUserService } from "../services/user/createUserService.js";
import { loginUserService } from "../services/user/loginService.js";
import { getUserProfileService } from "../services/user/getUserProfileService.js";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import { UserRole } from "../models/user.js";

const route = Router();

route.post(
    '/users/register',
    validate(createUserValidation),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, email, password, profileImageUrl } = req.body;
            
            const newUser = await createUserService({
                username,
                email,
                password,
                profileImageUrl 
            });

            return res.status(201).json({
                message: "User created successfully",
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    }
);

route.post('/users/login', validate(loginUserValidation), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        
        const loggedUserData = await loginUserService({
            email,
            password
        });
        return res.status(200).json({
            message: "User logged in successfully",
            data: loggedUserData
        });
    } catch (error) {
        next(error);
    }
});

route.get(
    '/users/me',
    authMiddleware,
    authorize(UserRole.USER, UserRole.ADMIN, UserRole.MOD),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as AuthRequest).user.userId;
            
            const userProfile = await getUserProfileService({ userId });
            
            return res.status(200).json({
                message: "User profile retrieved successfully",
                data: userProfile
            });
        } catch (error) {
            next(error);
        }
    }
);

export default route;