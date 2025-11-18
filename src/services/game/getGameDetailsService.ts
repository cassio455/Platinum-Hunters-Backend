// src/services/game/getGameDetailsService.ts
import { GameModel } from "../../data/documents/gameDocument.js";
import { NotFoundException } from "../../exceptions/httpException.js";

export const getGameDetailsService = async (gameId: string) => {
  // Usamos findById pois nosso _id é o gameId
  const game = await GameModel.findById(gameId).lean();
  
  if (!game) {
    throw new NotFoundException('Game not found');
  }

  return game;
}