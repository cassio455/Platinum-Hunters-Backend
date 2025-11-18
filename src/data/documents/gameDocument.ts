// src/data/documents/gameDocument.ts
import mongoose, { Schema, Document } from 'mongoose';

// Interface para os ratings (baseado no db.json)
interface IRating extends Document {
  id: number;
  title: string;
  count: number;
  percent: number;
}

// Interface principal do Jogo
export interface IGameDocument extends Document {
  _id: string; // Mapeando 'id' do db.json para '_id'
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
    _id: { // Usando _id como string para aceitar o 'id' do db.json
      type: String,
      required: true
    },
    nome: { type: String, required: true },
    ano_de_lancamento: { type: Number },
    playtime: { type: Number },
    plataformas: { type: [String] },
    backgroundimage: { type: String },
    rating: { type: Number },
    ratings: { type: [RatingSchema] }, // Schema aninhado
    ratings_count: { type: Number },
    genres: { type: [String] }
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt
    _id: false, // Já que estamos definindo _id manualmente
    collection: 'games' // Especifica o nome da coleção no MongoDB
  }
);

// Adiciona um índice de texto no campo 'nome' para otimizar a busca
GameSchema.index({ nome: 'text' });

export const GameModel = mongoose.model<IGameDocument>('Game', GameSchema);