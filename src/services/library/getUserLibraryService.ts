import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { GameModel } from "../../data/documents/gameDocument.js";
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

  const libraryItems = await LibraryItemModel
    .find(filter)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Busca os detalhes dos jogos
  const gameIds = libraryItems.map(item => item.gameId);
  const games = await GameModel.find({ _id: { $in: gameIds } }).lean();
  
  // Cria um mapa de jogos por ID para acesso rápido
  const gamesMap = new Map(games.map(game => [game._id, game]));

  // Combina dados da biblioteca com detalhes do jogo
  const items = libraryItems.map(item => {
    const game = gamesMap.get(item.gameId);
    return {
      ...item,
      gameDetails: game ? {
        nome: game.nome,
        plataformas: game.plataformas,
        genres: game.genres,
        rating: game.rating,
        playtime: game.playtime,
        ratings_count: game.ratings_count,
        backgroundimage: game.backgroundimage,
        ano_de_lancamento: game.ano_de_lancamento
      } : null
    };
  });

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
