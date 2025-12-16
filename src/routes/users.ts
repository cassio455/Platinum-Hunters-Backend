import { Router, Request, Response, NextFunction } from "express";
import { createUserValidation, loginUserValidation } from "../models/schemas/user.js";
import { validate } from "../middlewares/validateSchema.js";
import { createUserService } from "../services/user/createUserService.js";
import { loginUserService } from "../services/user/loginService.js";

const route = Router();

route.post(
    '/users/register',
    validate(createUserValidation),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // MUDANÇA AQUI: Adicionei profileImageUrl na lista de coisas para ler
            const { username, email, password, profileImageUrl } = req.body;
            
            const newUser = await createUserService({
                username,
                email,
                password,
                profileImageUrl // E repasso para o serviço criar o usuário com foto
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

export default route;