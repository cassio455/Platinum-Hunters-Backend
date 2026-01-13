import { GuideModel } from "../../data/documents/guideDocument.js";
import { z } from "zod";
import { guideSchema } from "../../models/schemas/guide.js";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

// Função para criar um novo Guide
export const createGuideService = async (data: z.infer<typeof guideSchema>,req: Request) => {
  // Gera UUIDs para trophies e comments se não vierem do frontend
  const trophies = data.trofeus.map(trophy => ({
    ...trophy,
    id: trophy.id || uuidv4()
  }));
const comments = data.comentarios?.map(comment => ({
    ...comment,
    id: comment.id || uuidv4()
  })) || [];
const guide = new GuideModel({
    title: data.title,
    game: data.game,
    roadmap: data.roadmap,
    author: req.body.username || "Anônimo",
    authorId: req.body.id || "sem-id",
    likes: data.likes || 0,
    comments,
    trophies
  });
await guide.save();
  return guide;
};