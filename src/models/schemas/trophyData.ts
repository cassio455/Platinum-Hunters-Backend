import { Schema, model } from 'mongoose';

export const TrophyDataSchema = new Schema({
    _id: { type: String, required: true },
    gameId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    isCustom: { type: Boolean, default: true }, 
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

export const TrophyDataModel = model('TrophyData', TrophyDataSchema);
