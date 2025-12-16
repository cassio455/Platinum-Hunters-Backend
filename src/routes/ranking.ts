import { Router, Request, Response } from 'express';
import { requireAuth } from '../middlewares/passportAuth.js'; 
import { UserModel } from '../data/documents/userDocument.js';

const route = Router();

// --- ROTA DE RANKING (Mantida igual) ---
route.get('/ranking', async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find()
            .sort({ rankingPoints: -1 })
            .limit(50)
            .select('username rankingPoints coins equippedTitle profileImageUrl platinums totalTrophies');
        
        const formattedUsers = users.map(u => ({
            id: u._id,
            name: u.username,
            avatar: u.profileImageUrl || "https://i.pravatar.cc/100?img=3",
            rankingPoints: u.rankingPoints || 0,
            equippedTitle: u.equippedTitle,
            platinums: 0,
            totalTrophies: 0
        }));

        res.json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar ranking" });
    }
});

// --- ROTA DE COMPLETAR DESAFIO (Mantida igual) ---
route.post('/ranking/complete', requireAuth, async (req: Request, res: Response) => {
    try {
        const { day, points } = req.body;
        const userId = (req.user as any)._id || (req.user as any).id;
        const user = await UserModel.findById(userId);

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        if (!user.completedChallenges) user.completedChallenges = [];

        if (user.completedChallenges.includes(day)) {
            return res.status(400).json({ message: "Desafio já completado hoje." });
        }

        user.rankingPoints = (user.rankingPoints || 0) + points;
        user.coins = (user.coins || 0) + points;
        user.completedChallenges.push(day);

        await user.save();

        res.json({ 
            message: "Desafio completado!", 
            newPoints: user.rankingPoints,
            newCoins: user.coins,
            completedChallenges: user.completedChallenges 
        });

    } catch (error) {
        console.error("Erro no ranking:", error);
        res.status(500).json({ message: "Erro ao completar desafio" });
    }
});

// --- NOVAS ROTAS DA LOJA ---

// 3. COMPRAR TÍTULO
route.post('/shop/buy', requireAuth, async (req: Request, res: Response) => {
    try {
        const { title, cost } = req.body;
        const userId = (req.user as any)._id;
        const user = await UserModel.findById(userId);

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        // Validações
        if (user.coins < cost) {
            return res.status(400).json({ message: "Moedas insuficientes" });
        }
        if (user.ownedTitles && user.ownedTitles.includes(title)) {
            return res.status(400).json({ message: "Você já possui este título" });
        }

        // Executa a compra
        user.coins -= cost;
        if (!user.ownedTitles) user.ownedTitles = [];
        user.ownedTitles.push(title);

        await user.save();

        res.json({
            message: "Título comprado com sucesso!",
            coins: user.coins,
            ownedTitles: user.ownedTitles
        });

    } catch (error) {
        res.status(500).json({ message: "Erro ao comprar título" });
    }
});

// 4. EQUIPAR TÍTULO
route.post('/shop/equip', requireAuth, async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        const userId = (req.user as any)._id;
        const user = await UserModel.findById(userId);

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        // Só pode equipar se tiver o título
        if (!user.ownedTitles || !user.ownedTitles.includes(title)) {
            return res.status(400).json({ message: "Você não possui este título" });
        }

        user.equippedTitle = title;
        await user.save();

        res.json({
            message: "Título equipado!",
            equippedTitle: user.equippedTitle
        });

    } catch (error) {
        res.status(500).json({ message: "Erro ao equipar título" });
    }
});

export default route;