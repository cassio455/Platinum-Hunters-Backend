import { Router,type Request, type Response } from "express";
import { UpdateGameProgressSchema } from "../models/schemas/library.js";
import { Game } from "../models/game.js";
const route = Router();

//GET: Get games list by user ID
route.get('/library/me/games', async (req: Request, res: Response) => {
    const userId = 1;
    const games: Game[] = [];
    if(!userId){
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // Substituir dps pelo serviço
        await new Promise((resolve) => setTimeout(resolve, 1000));
        games.push(new Game({id: "1", title: "Game One", backgroundImage: "http://example.com/game1.jpg", releaseDate: "2023-01-01"}));
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json(games);
});

//POST: Add a new game to user's library


//POST: Remove a game from user's library


//PATCH: Update game progress in user's library
route.patch(
    "/library/:gameId/progress",
    async (req: Request<{ gameId: string }, unknown, { progress?: number }>, res: Response) => {
        const payload = { gameId: req.params.gameId, progress: req.body?.progress };
        const result = UpdateGameProgressSchema.safeParse(payload);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.format() });
        }
        
        try {
            // Substituir dps pela chamada ao DB!
            await new Promise((resolve) => setTimeout(resolve, 1000));   

            const { gameId, progress } = result.data;
            return res.status(200).json({
                message: "Game progress updated successfully",
                gameId,
                ...(progress !== undefined ? { progress } : {}),
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
);
export default route;