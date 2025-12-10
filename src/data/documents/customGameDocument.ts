import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomGameDocument extends Document {
  _id: string;
  userId: string;
  nome: string;
  backgroundimage?: string;
  plataformas?: string[];
  genres?: string[];
  ano_de_lancamento?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomGameSchema = new Schema<ICustomGameDocument>(
  {
    _id: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    nome: {
      type: String,
      required: true
    },
    backgroundimage: {
      type: String,
      required: false
    },
    plataformas: {
      type: [String],
      default: []
    },
    genres: {
      type: [String],
      default: []
    },
    ano_de_lancamento: {
      type: Number,
      required: false
    },
    description: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    _id: false,
    collection: 'custom_games'
  }
);

CustomGameSchema.index({ userId: 1, nome: 1 });
CustomGameSchema.index({ userId: 1, createdAt: -1 });

export const CustomGameModel = mongoose.model<ICustomGameDocument>('CustomGame', CustomGameSchema);
