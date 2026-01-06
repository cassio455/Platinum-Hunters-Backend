import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js';
import { UserRole } from '../models/user.js';
import { validate } from '../middlewares/validateSchema.js';
import { 
    trackTrophiesSchema, 
    toggleTrophySchema, 
    toggleAllTrophiesSchema,
    createTrophySchema,
    editTrophySchema,
    deleteTrophySchema
} from '../models/schemas/trophy.js';
import { TrophyProgressModel } from '../data/documents/trophyDocument.js';
import { TrophyDataModel } from '../models/schemas/trophyData.js'; 

const route = Router();

// --- Rota Pública: Buscar troféus de um jogo específico ---
route.get('/trophies/game/:gameId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameId } = req.params;
        const trophies = await TrophyDataModel.find({ gameId });
        res.json(trophies);
    } catch (error) {
        next(error);
    }
});

// --- Rota Pública: Listar jogos disponíveis ---
route.get('/trophies/available-games', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const games = await TrophyDataModel.distinct('gameId');
        res.json(games);
    } catch (error) {
        next(error);
    }
});

// --- Rota Autenticada: Ver progresso (COM TOTAL CALCULADO) ---
route.get('/trophies/my-progress', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as AuthRequest).user.userId;

        // AGREGATION PIPELINE: Busca o progresso e cruza com a tabela de troféus para contar o total
        const progressList = await TrophyProgressModel.aggregate([
            { $match: { userId } },
            {
                $lookup: {
                    from: 'trophydatas', // Nome da coleção no Mongo (minúsculo e plural)
                    localField: 'gameId',
                    foreignField: 'gameId',
                    as: 'allGameTrophies'
                }
            },
            {
                $project: {
                    userId: 1,
                    gameId: 1,
                    completedTrophies: 1,
                    isTracked: 1,
                    lastUpdated: 1,
                    // Cria um campo 'total' contando quantos troféus vieram no lookup
                    total: { $size: "$allGameTrophies" } 
                }
            }
        ]);
        
        res.json(progressList);
    } catch (error) {
        next(error);
    }
});

// --- Rota Autenticada: Seguir Jogo ---
route.post('/trophies/track', authMiddleware, validate(trackTrophiesSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as AuthRequest).user.userId;
        const { gameId, isTracked } = req.body;

        const progress = await TrophyProgressModel.findOneAndUpdate(
            { userId, gameId },
            { isTracked },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(progress);
    } catch (error) {
        next(error);
    }
});

// --- Rota Autenticada: Marcar Troféu ---
route.post('/trophies/toggle', authMiddleware, validate(toggleTrophySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as AuthRequest).user.userId;
        const { gameId, trophyName } = req.body;

        const progress = await TrophyProgressModel.findOne({ userId, gameId });
        
        if (!progress) {
            const newProgress = await TrophyProgressModel.create({
                userId,
                gameId,
                completedTrophies: [trophyName],
                isTracked: true
            });
            return res.json(newProgress);
        }

        const index = progress.completedTrophies.indexOf(trophyName);
        if (index > -1) {
            progress.completedTrophies.splice(index, 1);
        } else {
            progress.completedTrophies.push(trophyName);
        }
        
        progress.lastUpdated = new Date();
        await progress.save();
        res.json(progress);
    } catch (error) {
        next(error);
    }
});

// --- Rota Autenticada: Marcar Todos ---
route.post('/trophies/toggle-all', authMiddleware, validate(toggleAllTrophiesSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as AuthRequest).user.userId;
        const { gameId, allTrophies, markAll } = req.body;

        const update = markAll 
            ? { $addToSet: { completedTrophies: { $each: allTrophies } } }
            : { $pull: { completedTrophies: { $in: allTrophies } } };

        const progress = await TrophyProgressModel.findOneAndUpdate(
            { userId, gameId },
            update,
            { new: true, upsert: true }
        );
        res.json(progress);
    } catch (error) {
        next(error);
    }
});

// --- Rotas Admin (Mantidas iguais) ---
route.post('/trophies/create', authMiddleware, authorize(UserRole.ADMIN), validate(createTrophySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameId, name, description, difficulty } = req.body;
        const randomId = Math.floor(Math.random() * 1000000) + 9000000;
        
        const newTrophy = new TrophyDataModel({
            _id: randomId.toString(),
            gameId,
            name,
            description,
            image: "https://via.placeholder.com/64",
            isCustom: true
        });
        await newTrophy.save();
        res.status(201).json(newTrophy);
    } catch (error) {
        next(error);
    }
});

route.put('/trophies/edit/:id', authMiddleware, authorize(UserRole.ADMIN), validate(editTrophySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedTrophy = await TrophyDataModel.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedTrophy) { res.status(404).json({ message: "Troféu não encontrado" }); return; }
        res.json(updatedTrophy);
    } catch (error) {
        next(error);
    }
});

route.delete('/trophies/delete/:id', authMiddleware, authorize(UserRole.ADMIN), validate(deleteTrophySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await TrophyDataModel.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default route;