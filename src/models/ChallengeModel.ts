import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
    day: number;
    title: string;
    points: number;
    // 'SPECIFIC' = exige nome exato | 'COUNT' = exige quantidade
    type: 'SPECIFIC' | 'COUNT'; 
    targetCount?: number; 
    requiredTrophy?: { 
        gameId: string;
        trophyName: string;
        trophyId?: string;
        anyTrophy?: boolean; // <--- NOVO CAMPO
    };
}

const ChallengeSchema: Schema = new Schema({
    day: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    points: { type: Number, required: true },
    
    type: { 
        type: String, 
        enum: ['SPECIFIC', 'COUNT'], 
        default: 'SPECIFIC' 
    },
    // Se for tipo COUNT, esse número diz quantos troféus precisa ter (ex: 5)
    targetCount: { type: Number, default: 0 },

    requiredTrophy: {
        gameId: { type: String },
        trophyName: { type: String },
        trophyId: { type: String },
        anyTrophy: { type: Boolean, default: false } // <--- NOVO CAMPO NO SCHEMA
    }
});

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);