
import mongoose, { Schema, Document } from 'mongoose';


interface IRating extends Document {
  id: number;
  title: string;
  count: number;
  percent: number;
}


export interface IGameDocument extends Document {
  _id: string;
  nome: string;
  ano_de_lancamento: number;
  playtime: number;
  plataformas: string[];
  backgroundimage: string;
  rating: number;
  ratings: IRating[];
  ratings_count: number;
  genres: string[];
}

const RatingSchema = new Schema<IRating>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  count: { type: Number, required: true },
  percent: { type: Number, required: true },
}, { _id: false });

const GameSchema = new Schema<IGameDocument>(
  {
    _id: { 
      type: String,
      required: true
    },
    nome: { type: String, required: true },
    ano_de_lancamento: { type: Number },
    playtime: { type: Number },
    plataformas: { type: [String] },
    backgroundimage: { type: String },
    rating: { type: Number },
    ratings: { type: [RatingSchema] },
    ratings_count: { type: Number },
    genres: { type: [String] }
  },
  {
    timestamps: true, 
    _id: false,
    collection: 'games' 
  }
);
GameSchema.index({ nome: 'text' });

export const GameModel = mongoose.model<IGameDocument>('Game', GameSchema);