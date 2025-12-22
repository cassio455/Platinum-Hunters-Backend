import { Schema } from 'mongoose';

export const TrophyProgressSchema = new Schema({
    userId: {
        type: String,
        ref: 'User', 
        required: true
    },
    gameId: {
        type: String,
        required: true
    },
    completedTrophies: [{
        type: String
    }],
    isTracked: {
        type: Boolean,
        default: false
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

TrophyProgressSchema.index({ userId: 1, gameId: 1 }, { unique: true });
