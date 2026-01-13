import { Schema, model, Types } from "mongoose";

// Subdocumento para cada troféu
const TrophySchema = new Schema({
  id: { type: String, required: true }, // UUID
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  rarity: { type: String, required: true },
  howTo: { type: String, required: true }
}, { _id: false });

// Subdocumento para cada comentário
const CommentSchema = new Schema({
  id: { type: String, required: true }, // UUID
  author: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  timestamp: { type: String, required: true },
  replies: { type: [this], default: [] } // replies é um array de comentários (recursivo)
}, { _id: false });

// Schema principal do Guide
const GuideSchema = new Schema({
  title: { type: String, required: true },
  game: { type: String, required: true },
  roadmap: { type: String, required: true },
  author: { type: String, required: true },    // Nome do autor
  authorId: { type: String, required: true },  // ID do autor (UUID ou ID do usuário)
  likes: { type: Number, default: 0 },
  comments: { type: [CommentSchema], default: [] },
  trophies: { type: [TrophySchema], required: true }
}, { timestamps: true });

export const GuideModel = model("Guide", GuideSchema);