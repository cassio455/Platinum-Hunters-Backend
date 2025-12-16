import mongoose, { Schema, Document } from 'mongoose';

export interface IUserModel extends Document {
  username: string;
  email: string;
  passwordHash: string;
  roles: string[];
  // Novos campos para suportar o Frontend de Ranking/Shop
  coins: number;
  rankingPoints: number;
  ownedTitles: string[];
  equippedTitle: string | null;
  profileImageUrl?: string;
  completedChallenges: number[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['USER'] },
  // Dados do Jogo/Ranking
  coins: { type: Number, default: 0 },
  rankingPoints: { type: Number, default: 0 },
  ownedTitles: { type: [String], default: [] },
  equippedTitle: { type: String, default: null },
  profileImageUrl: { type: String },
  completedChallenges: { type: [Number], default: [] }
}, {
  timestamps: true // Cria createdAt e updatedAt automaticamente
});

export default mongoose.model<IUserModel>('user', UserSchema);