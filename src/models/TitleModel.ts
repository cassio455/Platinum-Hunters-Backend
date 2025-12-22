import mongoose, { Schema, Document } from 'mongoose';

export interface ITitleModel extends Document {
  name: string;
  cost: number;
}

const TitleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  cost: { type: Number, required: true, min: 0 }
}, {
  timestamps: true
});

export default mongoose.model<ITitleModel>('Title', TitleSchema);