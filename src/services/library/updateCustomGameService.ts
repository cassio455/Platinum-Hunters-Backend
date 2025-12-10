import { CustomGameModel } from "../../data/documents/customGameDocument.js";
import { NotFoundException, ForbiddenException } from "../../exceptions/httpException.js";

type UpdateCustomGameInput = {
  userId: string;
  gameId: string;
  nome?: string;
  backgroundimage?: string;
  plataformas?: string[];
  genres?: string[];
  ano_de_lancamento?: number;
  description?: string;
};

export const updateCustomGameService = async (input: UpdateCustomGameInput) => {
  const { userId, gameId, ...updateData } = input;

  const game = await CustomGameModel.findOne({ _id: gameId });

  if (!game) {
    throw new NotFoundException('Custom game not found');
  }

  if (game.userId !== userId) {
    throw new ForbiddenException('You can only update your own custom games');
  }

  if (updateData.nome && updateData.nome !== game.nome) {
    const existingGame = await CustomGameModel.findOne({
      userId,
      nome: { $regex: new RegExp(`^${updateData.nome}$`, 'i') },
      _id: { $ne: gameId }
    });

    if (existingGame) {
      throw new NotFoundException('You already have a game with this name');
    }
  }

  const updatedGame = await CustomGameModel.findOneAndUpdate(
    { _id: gameId },
    { $set: updateData },
    { new: true, lean: true }
  );

  return updatedGame;
};
