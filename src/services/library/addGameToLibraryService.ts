import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { BadRequestException } from "../../exceptions/httpException.js";
import { LibraryItemStatus } from "../../models/libraryItemStatus.js";

type AddGameInput = {
  userId: string;
  gameId: string;
  status?: LibraryItemStatus;
}

export const addGameToLibraryService = async (input: AddGameInput) => {
  const { userId, gameId, status = LibraryItemStatus.PLAYING } = input;

  const existingItem = await LibraryItemModel.findOne({ userId, gameId });
  if (existingItem) {
    throw new BadRequestException('Game already in library');
  }

  const libraryItem = new LibraryItemModel({
    userId,
    gameId,
    status,
    progress: 0,
    platinum: false,
    hoursPlayed: 0
  });

  await libraryItem.save();

  return {
    id: libraryItem._id,
    userId: libraryItem.userId,
    gameId: libraryItem.gameId,
    status: libraryItem.status,
    progress: libraryItem.progress,
    platinum: libraryItem.platinum,
    hoursPlayed: libraryItem.hoursPlayed,
    createdAt: libraryItem.createdAt
  };
}
