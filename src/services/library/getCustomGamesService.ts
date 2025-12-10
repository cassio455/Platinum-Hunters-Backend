import { CustomGameModel } from "../../data/documents/customGameDocument.js";

type GetCustomGamesInput = {
  userId: string;
  page?: number;
  limit?: number;
};

export const getCustomGamesService = async (input: GetCustomGamesInput) => {
  const { userId, page = 1 } = input;
  const limit = Math.min(input.limit || 20, 50);

  const skip = (page - 1) * limit;

  const games = await CustomGameModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await CustomGameModel.countDocuments({ userId });

  return {
    items: games,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};
