import { Router } from "express";
import { guideSchema } from "../models/schemas/guide.js";
import { createGuideService } from "../services/guide/createGuideService.js";
import { listGuideService } from "../services/guide/listGuideService.js";
import { validate } from "../middlewares/validateSchema.js";
import { GuideModel } from "../data/documents/guideDocument.js";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // ajuste o caminho se necessário

export const guideRouter = Router();

// Rota para criar um novo guide
guideRouter.post(
  "/",
  authMiddleware,
  validate(guideSchema), // Valida o body com Zod
  async (req, res) => {
    try {
      const guide = await createGuideService(req.body, req);
      res.status(201).json({ message: "Guia criado com sucesso!", guide });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: "Erro ao criar guia", error: message });
    }
  }
);

// Rota para listar todos os guides
guideRouter.get("/", async (req, res) => {
  try {
    const guides = await listGuideService();
    res.json(guides);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Erro ao listar guias", error: message });
  }
});

// Curtir/descurtir guia
guideRouter.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const guide = await GuideModel.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guia não encontrado" });
  guide.likes = (guide.likes || 0) + 1;
    await guide.save();
    res.json({ message: "Like registrado", likes: guide.likes });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Erro ao curtir guia", error: message });
  }
});

// Adicionar comentário
guideRouter.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const guide = await GuideModel.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guia não encontrado" });
  const { texto } = req.body;
    if (!texto) return res.status(400).json({ message: "Texto do comentário é obrigatório" });
  const novoComentario = {
      id: uuidv4(),
      author: req.body.username || "Anônimo",
      text: texto,
      likes: 0,
      timestamp: new Date().toISOString(),
      replies: []
    };
  guide.comments = guide.comments || [];
    guide.comments.unshift(novoComentario);
    await guide.save();
    res.status(201).json({ message: "Comentário adicionado", comments: guide.comments });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Erro ao comentar", error: message });
  }
});

// Adicionar resposta (reply) a um comentário
guideRouter.post("/:id/comments/:commentId/reply", authMiddleware, async (req, res) => {
  try {
    const guide = await GuideModel.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guia não encontrado" });
  const { texto } = req.body;
    if (!texto) return res.status(400).json({ message: "Texto da resposta é obrigatório" });
  const comentario = (guide.comments || []).find(c => c.id === req.params.commentId);
    if (!comentario) return res.status(404).json({ message: "Comentário não encontrado" });
  const novaReply = {
      id: uuidv4(),
      author: req.body.username || "Anônimo",
      text: texto,
      likes: 0,
      timestamp: new Date().toISOString(),
      replies: []
    };
  comentario.replies = comentario.replies || [];
    comentario.replies.push(novaReply);
    await guide.save();
    res.status(201).json({ message: "Resposta adicionada", replies: comentario.replies });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Erro ao responder comentário", error: message });
  }
});

// Editar guia (PATCH)
guideRouter.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const guide = await GuideModel.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guia não encontrado" });
  if (req.body.id !== guide.authorId) {
      return res.status(403).json({ message: "Você não tem permissão para editar este guia" });
    }
  const { title, game, roadmap, trophies } = req.body;
    if (title) guide.title = title;
    if (game) guide.game = game;
    if (roadmap) guide.roadmap = roadmap;
    if (trophies) guide.trophies = trophies;
  await guide.save();
    res.json({ message: "Guia atualizado", guide });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Erro ao editar guia", error: message });
  }
});

// Deletar guia (DELETE)
guideRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const guide = await GuideModel.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guia não encontrado" });
  if (req.body.id !== guide.authorId) {
      return res.status(403).json({ message: "Você não tem permissão para deletar este guia" });
    }
  await guide.deleteOne();
    res.json({ message: "Guia deletado com sucesso" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Erro ao deletar guia", error: message });
  }
});