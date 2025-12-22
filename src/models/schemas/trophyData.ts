import { Schema, model } from 'mongoose';

export const TrophyDataSchema = new Schema({
    gameId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, default: 'bronze' },
    // NOVO CAMPO: Se for true, é criado pelo usuário. Se for false, é oficial do jogo.
    isCustom: { type: Boolean, default: true }, 
    createdAt: { type: Date, default: Date.now }
});

export const TrophyDataModel = model('TrophyData', TrophyDataSchema);