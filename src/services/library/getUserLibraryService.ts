import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { LibraryItemStatus } from "../../models/libraryItemStatus.js";

type GetLibraryInput = {
  userId: string;
  status?: LibraryItemStatus;
  page?: number;
  limit?: number;
}

export const getUserLibraryService = async (input: GetLibraryInput) => {
  const { userId, status, page = 1, limit = 20 } = input;

  const filter: any = { userId };
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const items = await LibraryItemModel
    .find(filter)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await LibraryItemModel.countDocuments(filter);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
