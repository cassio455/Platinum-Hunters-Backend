import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateSchema.js';
import { UserModel } from '../data/documents/userDocument.js';
import { UserRankingDataModel } from '../data/documents/userRankingDataDocument.js';
import { CompletedChallengeModel } from '../data/documents/completedChallengeDocument.js';
// IMPORTANTE: Importando os modelos de troféus
import { TrophyProgressModel } from '../data/documents/trophyDocument.js';
import { TrophyDataModel } from '../models/schemas/trophyData.js'; 

import ChallengeModel from '../models/ChallengeModel.js';
import TitleModel from '../models/TitleModel.js';
import { 
    manageTitleSchema,
    updateTitleSchema, 
    deleteTitleSchema, 
    manageChallengeSchema, 
    deleteChallengeSchema, 
    completeChallengeSchema, 
    buyTitleSchema, 
    equipTitleSchema 
} from '../models/schemas/rankingSchemas.js';
import { authorize } from '../middlewares/authorize.js';
import { UserRole } from '../models/user.js';

const route = Router();

// --- Rotas Públicas ---

route.get('/shop/titles', async (req: Request, res: Response) => {
    try {
        const titles = await TitleModel.find().sort({ cost: 1 });
        res.json(titles);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar títulos." });
    }
});

route.get('/challenges', async (req: Request, res: Response) => {
    try {
        const challenges = await ChallengeModel.find().sort({ day: 1 });
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar desafios." });
    }
});

// --- ROTA DE RANKING ATUALIZADA ---
route.get('/ranking', async (req: Request, res: Response) => {
    try {
        // 1. Buscar a lista de usuários ordenada por pontos
        const rankingData = await UserRankingDataModel.find()
            .sort({ rankingPoints: -1 })
            .limit(50)
            .populate('userId', 'username profileImageUrl');

        // 2. Criar um mapa de "Total de Troféus por Jogo"
        // Isso evita fazer milhares de consultas dentro do loop
        const allTrophiesCount = await TrophyDataModel.aggregate([
            { $group: { _id: "$gameId", count: { $sum: 1 } } }
        ]);
        
        // Ex: { "elden-ring": 42, "god-of-war": 35 }
        const gameTotalTrophiesMap: Record<string, number> = {};
        allTrophiesCount.forEach(item => {
            gameTotalTrophiesMap[item._id] = item.count;
        });
        
        // 3. Formatar os dados de cada usuário calculando Platinas e Troféus
        const formattedUsers = await Promise.all(rankingData.map(async (data: any) => {
            const userId = data.userId._id;

            // Buscar desafios completados
            const completedChallenges = await CompletedChallengeModel.find({ userId }).select('challengeDay');
            
            // Buscar progresso de troféus deste usuário
            const userTrophyProgress = await TrophyProgressModel.find({ userId });

            let totalTrophiesCount = 0;
            let platinumsCount = 0;

            userTrophyProgress.forEach(progress => {
                const userCount = progress.completedTrophies ? progress.completedTrophies.length : 0;
                totalTrophiesCount += userCount;

                // Verificar Platina: Usuário tem todos os troféus que existem no banco para aquele jogo?
                const maxTrophiesForGame = gameTotalTrophiesMap[progress.gameId] || 0;
                
                // Só conta platina se o jogo tiver troféus cadastrados e o usuário tiver pego todos
                if (maxTrophiesForGame > 0 && userCount >= maxTrophiesForGame) {
                    platinumsCount++;
                }
            });

            return {
                id: userId,
                name: data.userId.username,
                avatar: data.userId.profileImageUrl || "https://i.pravatar.cc/100?img=3",
                rankingPoints: data.rankingPoints || 0,
                equippedTitle: data.equippedTitle,
                completedChallenges: completedChallenges.map((c: any) => c.challengeDay),
                // Novos campos calculados
                platinums: platinumsCount,
                totalTrophies: totalTrophiesCount
            };
        }));
        
        res.json(formattedUsers);
    } catch (error) {
        console.error("Erro no ranking:", error);
        res.status(500).json({ message: "Erro ao buscar ranking" });
    }
});

// --- Rotas Protegidas ---
// ... (O resto do arquivo continua exatamente igual, sem alterações)

// Gerenciar Títulos
route.post('/shop/manage/title', authMiddleware, authorize(UserRole.ADMIN), validate(manageTitleSchema), async (req: Request, res: Response) => {
    try {
        const { name, cost } = req.body;
        const newTitle = await TitleModel.create({ name, cost });
        return res.status(201).json({ message: "Título criado!", title: newTitle });
    } catch (error: any) {
        if (error.code === 11000) return res.status(400).json({ message: "Já existe um título com este nome." });
        res.status(500).json({ message: "Erro ao salvar título." });
    }
});

route.put('/shop/manage/title/:id', authMiddleware, authorize(UserRole.ADMIN), validate(updateTitleSchema), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, cost } = req.body;
        
        const title = await TitleModel.findById(id);
        if (!title) {
            return res.status(404).json({ message: "Título não encontrado." });
        }
        
        title.name = name;
        title.cost = cost;
        await title.save();
        
        return res.json({ message: "Título atualizado!", title });
    } catch (error: any) {
        if (error.code === 11000) return res.status(400).json({ message: "Já existe um título com este nome." });
        res.status(500).json({ message: "Erro ao atualizar título." });
    }
});

route.delete('/shop/manage/title/:id', authMiddleware, authorize(UserRole.ADMIN), validate(deleteTitleSchema), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await TitleModel.findByIdAndDelete(id);
        return res.json({ message: "Título excluído!", id });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir título." });
    }
});

// Gerenciar Desafios
route.post('/ranking/manage/challenge', authMiddleware, authorize(UserRole.ADMIN), validate(manageChallengeSchema), async (req: Request, res: Response) => {
    try {
        const { day, title, points } = req.body;
        let challenge = await ChallengeModel.findOne({ day });
        if (challenge) {
            challenge.title = title;
            challenge.points = points;
            await challenge.save();
            return res.json({ message: "Desafio atualizado!", challenge });
        } else {
            challenge = await ChallengeModel.create({ day, title, points });
            return res.status(201).json({ message: "Desafio criado!", challenge });
        }
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao salvar desafio." });
    }
});

route.delete('/ranking/manage/challenge/:day', authMiddleware, authorize(UserRole.ADMIN), validate(deleteChallengeSchema), async (req: Request, res: Response) => {
    try {
        const day = parseInt(req.params.day);
        await ChallengeModel.deleteOne({ day });
        await CompletedChallengeModel.deleteMany({ challengeDay: day });
        return res.json({ message: "Desafio excluído e histórico limpo!", day });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir desafio." });
    }
});

// --- AÇÕES DO USUÁRIO ---

route.post('/ranking/complete', authMiddleware, validate(completeChallengeSchema), async (req: Request, res: Response) => {
    try {
        const { day } = req.body;
        
        const authReq = req as AuthRequest;
        const userId = authReq.user.userId;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const challenge = await ChallengeModel.findOne({ day });
        if (!challenge) {
            return res.status(404).json({ message: "Desafio não encontrado" });
        }

        const alreadyCompleted = await CompletedChallengeModel.findOne({ userId, challengeDay: day });
        if (alreadyCompleted) {
            return res.status(400).json({ message: "Desafio já completado." });
        }

        await CompletedChallengeModel.create({
            userId,
            challengeDay: day,
            pointsEarned: challenge.points
        });

        let rankingData = await UserRankingDataModel.findOne({ userId });
        if (!rankingData) {
            rankingData = await UserRankingDataModel.create({ userId, rankingPoints: 0, coins: 0 });
        }

        rankingData.rankingPoints += challenge.points;
        rankingData.coins += challenge.points;
        await rankingData.save();

        const completedChallenges = await CompletedChallengeModel.find({ userId }).select('challengeDay');

        res.json({ 
            message: "Desafio completado!", 
            newPoints: rankingData.rankingPoints, 
            newCoins: rankingData.coins, 
            completedChallenges: completedChallenges.map(c => c.challengeDay)
        });
    } catch (error) {
        console.error("Erro ao completar desafio:", error);
        res.status(500).json({ message: "Erro ao completar desafio" });
    }
});

route.post('/shop/buy', authMiddleware, validate(buyTitleSchema), async (req: Request, res: Response) => {
    try {
        const { title, cost } = req.body;
        
        const authReq = req as AuthRequest;
        const userId = authReq.user.userId;

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        
        let rankingData = await UserRankingDataModel.findOne({ userId });
        if (!rankingData) {
            rankingData = await UserRankingDataModel.create({ userId, rankingPoints: 0, coins: 0 });
        }

        const userCoins = rankingData.coins || 0;
        if (userCoins < cost) return res.status(400).json({ message: "Moedas insuficientes" });
        if (rankingData.ownedTitles && rankingData.ownedTitles.includes(title)) {
            return res.status(400).json({ message: "Você já possui este título" });
        }
        
        rankingData.coins = userCoins - cost;
        if (!rankingData.ownedTitles) rankingData.ownedTitles = [];
        rankingData.ownedTitles.push(title);
        
        await rankingData.save();
        res.json({ message: "Título comprado!", coins: rankingData.coins, ownedTitles: rankingData.ownedTitles });
    } catch (error) { 
        res.status(500).json({ message: "Erro ao comprar título" }); 
    }
});

route.post('/shop/equip', authMiddleware, validate(equipTitleSchema), async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        
        const authReq = req as AuthRequest;
        const userId = authReq.user.userId;

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        
        let rankingData = await UserRankingDataModel.findOne({ userId });
        if (!rankingData) {
            rankingData = await UserRankingDataModel.create({ userId, rankingPoints: 0, coins: 0 });
        }

        if (!rankingData.ownedTitles || !rankingData.ownedTitles.includes(title)) {
            return res.status(400).json({ message: "Você não possui este título" });
        }
        
        rankingData.equippedTitle = title;
        await rankingData.save();
        res.json({ message: "Título equipado!", equippedTitle: rankingData.equippedTitle });
    } catch (error) { 
        res.status(500).json({ message: "Erro ao equipar título" }); 
    }
});

export default route;