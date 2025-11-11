import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { NotFoundException } from "../../exceptions/httpException.js";

type RemoveGameInput = {
  userId: string;
  gameId: string;
}

export const removeGameFromLibraryService = async (input: RemoveGameInput) => {
  const { userId, gameId } = input;

  const result = await LibraryItemModel.findOneAndDelete({ userId, gameId });
  
  if (!result) {
    throw new NotFoundException('Game not found in library');
  }

  return {
    message: 'Game removed from library'
  };
}
