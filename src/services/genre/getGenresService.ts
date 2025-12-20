// src/services/genre/getGenresService.ts
import { GenreModel } from '../../data/documents/genreDocument.js';

type GetGenresInput = {
  search?: string;
  page?: number;
  limit?: number;
};

export const getGenresService = async (input: GetGenresInput) => {
  const { search, page = 1, limit = 50 } = input;
  
  const filterQuery: any = {};
  
  // Se houver uma busca, filtra pelo nameLower usando regex case-insensitive
  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    filterQuery.nameLower = { $regex: searchLower, $options: 'i' };
  }

  const skip = (page - 1) * limit;

  // Busca os gêneros ordenados alfabeticamente
  const items = await GenreModel
    .find(filterQuery)
    .sort({ nameLower: 1 })
    .skip(skip)
    .limit(limit)
    .select('_id name')
    .lean();

  const total = await GenreModel.countDocuments(filterQuery);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
