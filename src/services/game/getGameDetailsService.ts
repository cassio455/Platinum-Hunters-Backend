import { GameModel } from "../../data/documents/gameDocument.js";
import { NotFoundException } from "../../exceptions/httpException.js";

export const getGameDetailsService = async (gameId: string) => {
  const game = await GameModel.findOne({ _id: gameId }).lean();
  
  if (!game) {
    throw new NotFoundException('Game not found');
  }

  return game;
}