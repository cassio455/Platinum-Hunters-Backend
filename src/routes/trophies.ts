import { Router, Request, Response } from 'express';
import { requireAuth } from '../middlewares/passportAuth.js'; // Usando seu middleware de auth existente
import { TrophyProgressModel } from '../data/documents/trophyDocument.js';

const route = Router();

// --- ROTA 1: PEGAR MEUS JOGOS E PROGRESSO ---
// O Front chama isso para saber o que pintar de verde/vermelho e quais jogos listar
route.get('/trophies/my-progress', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        // Busca tudo que esse usuário tem no banco de troféus
        const progressList = await TrophyProgressModel.find({ userId });

        // Formata para facilitar o uso no front
        // Retorna um objeto onde a chave é o gameId
        const formattedProgress: Record<string, any> = {};
        
        progressList.forEach(p => {
            formattedProgress[p.gameId] = {
                isTracked: p.isTracked,
                completedTrophies: p.completedTrophies
            };
        });

        res.json(formattedProgress);
    } catch (error) {
        console.error("Erro ao buscar troféus:", error);
        res.status(500).json({ message: "Erro ao buscar progresso de troféus" });
    }
});

// --- ROTA 2: ADICIONAR OU REMOVER JOGO DA LISTA (TRACK) ---
// Usada no AddTrophyGames.jsx
route.post('/trophies/track', requireAuth, async (req: Request, res: Response) => {
    try {
        const { gameId, isTracked } = req.body; // gameId: "hollow-knight", isTracked: true/false
        const userId = (req as any).user._id;

        // Procura se já existe registro desse jogo para esse usuário
        let progress = await TrophyProgressModel.findOne({ userId, gameId });

        if (!progress) {
            // Se não existe, cria um novo
            progress = new TrophyProgressModel({
                userId,
                gameId,
                completedTrophies: [],
                isTracked: isTracked
            });
        } else {
            // Se existe, só atualiza o status
            progress.isTracked = isTracked;
        }

        progress.lastUpdated = new Date();
        await progress.save();

        res.json({ message: "Lista de jogos atualizada!", gameId, isTracked });

    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar lista de jogos" });
    }
});

// --- ROTA 3: MARCAR/DESMARCAR UM TROFÉU (TOGGLE) ---
// Usada no TrophyDetails.jsx
route.post('/trophies/toggle', requireAuth, async (req: Request, res: Response) => {
    try {
        const { gameId, trophyName } = req.body; 
        const userId = (req as any).user._id;

        // Busca o documento do jogo
        let progress = await TrophyProgressModel.findOne({ userId, gameId });

        // Se o usuário clicou no troféu mas nunca tinha adicionado o jogo, criamos agora
        if (!progress) {
            progress = new TrophyProgressModel({
                userId,
                gameId,
                completedTrophies: [],
                isTracked: true // Assume que se ele marcou um troféu, quer rastrear o jogo
            });
        }

        const trophyIndex = progress.completedTrophies.indexOf(trophyName);

        let isCompleted = false;

        if (trophyIndex > -1) {
            // Se já tem o troféu, remove (Desmarcar)
            progress.completedTrophies.splice(trophyIndex, 1);
            isCompleted = false;
        } else {
            // Se não tem, adiciona (Marcar)
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
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar troféu" });
    }
});

// --- ROTA 4: MARCAR/DESMARCAR TODOS OS TROFÉUS ---
// Usada no TrophyDetails.jsx para o botão "Marcar Todos"
route.post('/trophies/toggle-all', requireAuth, async (req: Request, res: Response) => {
    try {
        const { gameId, allTrophies, markAll } = req.body; 
        // allTrophies: Array com o nome de TODOS os troféus do jogo
        // markAll: boolean (true = marcar tudo, false = desmarcar tudo)
        
        const userId = (req as any).user._id;

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
            // Se for para marcar tudo, substituímos o array pelo array completo vindo do front
            progress.completedTrophies = allTrophies;
            progress.isTracked = true; // Garante que o jogo está sendo rastreado
        } else {
            // Se for para desmarcar, limpamos o array
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
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar todos os troféus" });
    }
});

export default route;