import mongoose, { Schema, Document } from 'mongoose';

export interface ICompletedChallenge extends Document {
    userId: string;
    challengeDay: number;
    pointsEarned: number;
    completedAt: Date;
}

const CompletedChallengeSchema = new Schema<ICompletedChallenge>(
    {
        userId: {
            type: String,
            required: true,
            ref: 'User'
        },
        challengeDay: {
            type: Number,
            required: true
        },
        pointsEarned: {
            type: Number,
            required: true,
            min: 0
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false,
        collection: 'completed_challenges'
    }
);

// Índice composto para garantir que um usuário não complete o mesmo desafio duas vezes
CompletedChallengeSchema.index({ userId: 1, challengeDay: 1 }, { unique: true });
CompletedChallengeSchema.index({ challengeDay: 1 });

export const CompletedChallengeModel = mongoose.model<ICompletedChallenge>('CompletedChallenge', CompletedChallengeSchema);
