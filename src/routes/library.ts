import { Router, type Request, type Response, type NextFunction } from "express";
import { updateGameProgressValidation } from "../models/schemas/library.js";
import { validate } from "../middlewares/validateSchema.js";
import { Game } from "../models/game.js";

const route = Router();

//GET: Get games list by user ID
route.get('/library/me/games', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = 1;
        const games: Game[] = [];
        
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        // Substituir dps pelo serviço
        await new Promise((resolve) => setTimeout(resolve, 1000));
        games.push(new Game({
            id: "1",
            title: "Game One",
            backgroundImage: "http://example.com/game1.jpg",
            releaseDate: "2023-01-01"
        }));
        
        return res.status(200).json(games);
    } catch (err) {
        next(err);
    }
});

//POST: Add a new game to user's library


//POST: Remove a game from user's library


//PATCH: Update game progress in user's library
route.patch(
    "/library/:gameId/progress",
    validate(updateGameProgressValidation),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { gameId } = req.params;
            const { progress } = req.body;
            
            // Substituir dps pela chamada ao DB!
            await new Promise((resolve) => setTimeout(resolve, 1000));

            return res.status(200).json({
                message: "Game progress updated successfully",
                gameId,
                ...(progress !== undefined ? { progress } : {}),
            });
        } catch (err) {
            next(err);
        }
    }
);

export default route;