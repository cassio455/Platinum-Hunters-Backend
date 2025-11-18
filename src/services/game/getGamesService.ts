// src/services/game/getGamesService.ts
import { GameModel } from "../../data/documents/gameDocument.js";

// Tipos para os filtros e paginação
type GetGamesInput = {
  page?: number;
  limit?: number;
  q?: string; // Para busca textual
  filters?: {
    genres?: string[];
    plataformas?: string[];
    sort?: string;
  };
}

export const getGamesService = async (input: GetGamesInput) => {
  const { page = 1, limit = 20, q, filters = {} } = input;

  const filterQuery: any = {};
  
  // 1. Filtro de Busca Textual (do GET /games)
  if (q) {
    // '$search' utiliza o índice de texto que criamos no Model
    filterQuery.$text = { $search: q };
  }

  // 2. Filtros do Body (do POST /games/filters)
  if (filters.genres && filters.genres.length > 0) {
    // $all garante que o jogo tenha TODOS os gêneros da lista
    filterQuery.genres = { $all: filters.genres };
  }
  if (filters.plataformas && filters.plataformas.length > 0) {
    // $in garante que o jogo esteja em QUALQUER uma das plataformas
    filterQuery.plataformas = { $in: filters.plataformas };
  }

  // 3. Lógica de Ordenação
  const sortQuery: any = {};
  if (filters.sort === 'rating_desc') {
    sortQuery.rating = -1; // -1 para descendente
  } else if (filters.sort === 'rating_asc') {
    sortQuery.rating = 1; // 1 para ascendente
  } else {
    sortQuery.nome = 1; // Ordem alfabética padrão
  }

  // 4. Lógica de Paginação (similar ao seu getUserLibraryService)
  const skip = (page - 1) * limit;

  const items = await GameModel
    .find(filterQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .lean(); // .lean() para performance (retorna JSON puro)

  const total = await GameModel.countDocuments(filterQuery);

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