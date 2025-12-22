import mongoose, { Schema, Document } from 'mongoose';

export interface IUserRankingData extends Document {
    userId: string;
    coins: number;
    rankingPoints: number;
    ownedTitles: string[];
    equippedTitle: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserRankingDataSchema = new Schema<IUserRankingData>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            ref: 'User'
        },
        coins: {
            type: Number,
            default: 0,
            min: 0
        },
        rankingPoints: {
            type: Number,
            default: 0,
            min: 0
        },
        ownedTitles: {
            type: [String],
            default: []
        },
        equippedTitle: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true,
        collection: 'user_ranking_data'
    }
);

UserRankingDataSchema.index({ rankingPoints: -1 });

export const UserRankingDataModel = mongoose.model<IUserRankingData>('UserRankingData', UserRankingDataSchema);
