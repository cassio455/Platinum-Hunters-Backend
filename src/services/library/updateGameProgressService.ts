import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { NotFoundException } from "../../exceptions/httpException.js";
import { LibraryItemStatus } from "../../models/libraryItemStatus.js";

type UpdateProgressInput = {
  userId: string;
  gameId: string;
  progress?: number;
  platinum?: boolean;
  hoursPlayed?: number;
  status?: LibraryItemStatus;
}

export const updateGameProgressService = async (input: UpdateProgressInput) => {
  const { userId, gameId, progress, platinum, hoursPlayed, status } = input;

  const libraryItem = await LibraryItemModel.findOne({ userId, gameId });
  
  if (!libraryItem) {
    throw new NotFoundException('Game not found in library');
  }

  if (progress !== undefined) libraryItem.progress = progress;
  if (platinum !== undefined) libraryItem.platinum = platinum;
  if (hoursPlayed !== undefined) libraryItem.hoursPlayed = hoursPlayed;
  if (status !== undefined) libraryItem.status = status;

  await libraryItem.save();

  return {
    id: libraryItem._id,
    userId: libraryItem.userId,
    gameId: libraryItem.gameId,
    progress: libraryItem.progress,
    platinum: libraryItem.platinum,
    hoursPlayed: libraryItem.hoursPlayed,
    status: libraryItem.status,
    updatedAt: libraryItem.updatedAt
  };
}
