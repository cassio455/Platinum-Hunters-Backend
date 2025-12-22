import { Router, Request, Response, NextFunction } from 'express';

// --- IMPORTAÇÕES DE SEGURANÇA E VALIDAÇÃO ---
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js'; // <--- Middleware de permissão
import { UserRole } from '../models/user.js'; // <--- Enum com os cargos (ADMIN, USER)
import { validate } from '../middlewares/validateSchema.js';

// Importando os Schemas Zod
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
import { INITIAL_TROPHIES } from '../scripts/initialTrophies.js'; 

const route = Router();

// ==========================================
// 🔓 ROTAS PÚBLICAS OU DE USUÁRIO COMUM
// (Qualquer usuário logado pode acessar)
// ==========================================

// 1. Pegar progresso
route.get(
    '/trophies/my-progress',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as AuthRequest).user.userId;
            const progressList = await TrophyProgressModel.find({ userId });

            const formattedData = await Promise.all(progressList.map(async (p) => {
                const customCount = await TrophyDataModel.countDocuments({ 
                    gameId: p.gameId, 
                    isCustom: true 
                });

                return {
                    gameId: p.gameId,
                    data: {
                        isTracked: p.isTracked,
                        completedTrophies: p.completedTrophies,
                        customTrophyCount: customCount 
                    }
                };
            }));

            const formattedProgress: Record<string, any> = {};
            formattedData.forEach(item => {
                formattedProgress[item.gameId] = item.data;
            });

            res.json(formattedProgress);
        } catch (error) {
            next(error);
        }
    }
);

// 2. Seguir jogo (Track)
route.post(
    '/trophies/track',
    authMiddleware,
    validate(trackTrophiesSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { gameId, isTracked } = req.body; 
            const userId = (req as AuthRequest).user.userId;

            let progress = await TrophyProgressModel.findOne({ userId, gameId });

            if (!progress) {
                progress = new TrophyProgressModel({
                    userId,
                    gameId,
                    completedTrophies: [],
                    isTracked: isTracked
                });
            } else {
                progress.isTracked = isTracked;
            }

            progress.lastUpdated = new Date();
            await progress.save();

            res.json({ message: "Lista de jogos atualizada!", gameId, isTracked });
        } catch (error) {
            next(error);
        }
    }
);

// 3. Marcar/Desmarcar Troféu
route.post(
    '/trophies/toggle',
    authMiddleware,
    validate(toggleTrophySchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { gameId, trophyName } = req.body; 
            const userId = (req as AuthRequest).user.userId;

            let progress = await TrophyProgressModel.findOne({ userId, gameId });

            if (!progress) {
                progress = new TrophyProgressModel({
                    userId,
                    gameId,
                    completedTrophies: [],
                    isTracked: true 
                });
            }

            const trophyIndex = progress.completedTrophies.indexOf(trophyName);
            let isCompleted = false;

            if (trophyIndex > -1) {
                progress.completedTrophies.splice(trophyIndex, 1);
                isCompleted = false;
            } else {
                progress.completedTrophies.push(trophyName);
                isCompleted = true;
            }

            progress.lastUpdated = new Date();
            await progress.save();

            res.json({ 
                message: "Troféu atualizado", 
                gameId, 
                trophyName, 
                isCompleted,
                totalCompleted: progress.completedTrophies.length
            });
        } catch (error) {
            next(error);
        }
    }
);

// 4. Marcar Todos
route.post(
    '/trophies/toggle-all',
    authMiddleware,
    validate(toggleAllTrophiesSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { gameId, allTrophies, markAll } = req.body; 
            const userId = (req as AuthRequest).user.userId;

            let progress = await TrophyProgressModel.findOne({ userId, gameId });

            if (!progress) {
                progress = new TrophyProgressModel({
                    userId,
                    gameId,
                    completedTrophies: [],
                    isTracked: true
                });
            }

            if (markAll) {
                progress.completedTrophies = allTrophies;
                progress.isTracked = true; 
            } else {
                progress.completedTrophies = [];
            }

            progress.lastUpdated = new Date();
            await progress.save();

            res.json({ 
                message: markAll ? "Todos os troféus marcados!" : "Todos os troféus desmarcados!",
                gameId, 
                completedTrophies: progress.completedTrophies 
            });
        } catch (error) {
            next(error);
        }
    }
);

// 5. Listar Troféus do Jogo (Pública ou autenticada, aqui deixei aberta)
route.get('/trophies/list/:gameId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameId } = req.params;
        const trophies = await TrophyDataModel.find({ gameId }).sort({ createdAt: 1 });
        res.json(trophies);
    } catch (error) {
        next(error);
    }
});

// 6. Resetar Banco (Seed) - CUIDADO: Talvez queira proteger isso como ADMIN também?
route.post('/trophies/seed-database', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let totalInserted = 0;
        for (const [gameId, rawList] of Object.entries(INITIAL_TROPHIES)) {
            const list = rawList as any[]; 
            await TrophyDataModel.deleteMany({ gameId, isCustom: false });
            const trophiesToInsert = list.map((t: any) => ({
                gameId,
                name: t.name,
                description: t.description,
                difficulty: 'bronze', 
                isCustom: false 
            }));
            if (trophiesToInsert.length > 0) {
                await TrophyDataModel.insertMany(trophiesToInsert);
                totalInserted += trophiesToInsert.length;
            }
        }
        res.json({ message: `Sucesso! ${totalInserted} troféus oficiais restaurados.` });
    } catch (error) {
        next(error);
    }
});

// ==========================================
// 🔒 ROTAS ADMINISTRATIVAS
// (Somente quem tem role 'ADMIN' pode acessar)
// ==========================================

// CREATE (Criar Customizado)
route.post(
    '/trophies/create',
    authMiddleware,            // 1. Verifica se está logado
    authorize(UserRole.ADMIN), // 2. Verifica se é ADMIN
    validate(createTrophySchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { gameId, name, description, difficulty } = req.body;
            
            const newTrophy = new TrophyDataModel({
                gameId,
                name,
                description,
                difficulty,
                isCustom: true
            });
            await newTrophy.save();
            res.status(201).json(newTrophy);
        } catch (error) {
            next(error);
        }
    }
);

// EDIT
route.put(
    '/trophies/edit/:id',
    authMiddleware,
    authorize(UserRole.ADMIN), // SOMENTE ADMIN
    validate(editTrophySchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { name, description, difficulty } = req.body;
            const updatedTrophy = await TrophyDataModel.findByIdAndUpdate(
                id,
                { name, description, difficulty },
                { new: true } 
            );
            if (!updatedTrophy) {
                 res.status(404).json({ message: "Troféu não encontrado" });
                 return; 
            }
            res.json(updatedTrophy);
        } catch (error) {
            next(error);
        }
    }
);

// DELETE
route.delete(
    '/trophies/delete/:id',
    authMiddleware,
    authorize(UserRole.ADMIN), // SOMENTE ADMIN
    validate(deleteTrophySchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await TrophyDataModel.findByIdAndDelete(id);
            res.json({ message: "Troféu deletado com sucesso", id });
        } catch (error) {
            next(error);
        }
    }
);

export default route;