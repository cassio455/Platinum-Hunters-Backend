import { Router, Request, Response, NextFunction } from "express";
import { createUserValidation } from "../models/schemas/user.js";
import { validate } from "../middlewares/validateSchema.js";
import { createUserService } from "../services/user/createUserService.js";

const route = Router();

route.post(
    '/users/register',
    validate(createUserValidation),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, email, password } = req.body;
            
            const newUser = await createUserService({
                username,
                email,
                password
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

export default route;