import mongoose, { Schema, Document } from 'mongoose';

export interface IChallengeModel extends Document {
  day: number;
  title: string;
  points: number;
}

const ChallengeSchema: Schema = new Schema({
  day: { type: Number, required: true, unique: true, min: 1, max: 31 },
  title: { type: String, required: true },
  points: { type: Number, required: true, min: 1 }
}, {
  timestamps: true
});

export default mongoose.model<IChallengeModel>('Challenge', ChallengeSchema);