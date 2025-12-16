import { Schema } from 'mongoose';

// Este Schema define o progresso de UM usuário em UM jogo específico
export const TrophyProgressSchema = new Schema({
    userId: {
        type: String, // <--- Agora aceita seu UUID corretamente
        ref: 'User', 
        required: true
    },
    gameId: {
        type: String, // O slug do jogo, ex: "hollow-knight", "god-of-war"
        required: true
    },
    // Array com os NOMES dos troféus conquistados (bate com o trophy.name do front)
    completedTrophies: [{
        type: String
    }],
    // Se o usuário adicionou esse jogo à lista "Meus Jogos" (AddTrophyGames.jsx)
    isTracked: {
        type: Boolean,
        default: false
    },
    // Data da última alteração (útil para ordenação futura)
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Cria um índice composto para garantir que um usuário só tenha UM documento por jogo
TrophyProgressSchema.index({ userId: 1, gameId: 1 }, { unique: true });