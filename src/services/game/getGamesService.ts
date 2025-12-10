import { GameModel } from "../../data/documents/gameDocument.js";

type GetGamesInput = {
  page?: number;
  limit?: number;
  q?: string;
  filters?: {
    genres?: string[];
    plataformas?: string[];
    sort?: string;
  };
}

export const getGamesService = async (input: GetGamesInput) => {
  const { page = 1, q, filters = {} } = input;
  const limit = Math.min(input.limit || 20, 50);

  const filterQuery: any = {};
  
  if (q) {
    filterQuery.$text = { $search: q };
  }

  if (filters.genres && filters.genres.length > 0) {
    filterQuery.genres = { $in: filters.genres };
  }
  if (filters.plataformas && filters.plataformas.length > 0) {
    filterQuery.plataformas = { $in: filters.plataformas };
  }

  const sortQuery: any = {};
  if (filters.sort === 'rating_desc') {
    sortQuery.rating = -1;
  } else if (filters.sort === 'rating_asc') {
    sortQuery.rating = 1; 
  } else {
    sortQuery.nome = 1;
  }

  const skip = (page - 1) * limit;

  const items = await GameModel
    .find(filterQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await GameModel.countDocuments(filterQuery);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}