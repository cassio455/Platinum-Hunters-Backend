import { CustomGameModel } from "../../data/documents/customGameDocument.js";
import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { NotFoundException, ForbiddenException } from "../../exceptions/httpException.js";

type DeleteCustomGameInput = {
  userId: string;
  gameId: string;
};

export const deleteCustomGameService = async (input: DeleteCustomGameInput) => {
  const { userId, gameId } = input;

  const game = await CustomGameModel.findOne({ _id: gameId });

  if (!game) {
    throw new NotFoundException('Custom game not found');
  }

  if (game.userId !== userId) {
    throw new ForbiddenException('You can only delete your own custom games');
  }

  await LibraryItemModel.deleteMany({
    userId,
    gameId
  });

  await CustomGameModel.deleteOne({ _id: gameId });

  return {
    message: 'Custom game deleted successfully',
    gameId
  };
};
