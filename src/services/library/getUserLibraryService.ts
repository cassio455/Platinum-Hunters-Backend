import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { GameModel } from "../../data/documents/gameDocument.js";
import { TrophyProgressModel } from "../../data/documents/trophyDocument.js";
import { TrophyDataModel } from "../../models/schemas/trophyData.js";
import { LibraryItemStatus } from "../../models/libraryItemStatus.js";

type GetLibraryInput = {
  userId: string;
  status?: LibraryItemStatus;
  name?: string;
  page?: number;
  limit?: number;
}

export const getUserLibraryService = async (input: GetLibraryInput) => {
  const { userId, status, name, page = 1, limit = 20 } = input;

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

  const gameIds = libraryItems.map(item => item.gameId);
  const games = await GameModel.find({ _id: { $in: gameIds } }).lean();
  
  // Busca o progresso de troféus para os jogos
  const trophyProgress = await TrophyProgressModel.find({ 
    userId, 
    gameId: { $in: gameIds } 
  }).lean();
  
  // Busca o total de troféus de cada jogo
  const trophyCounts = await TrophyDataModel.aggregate([
    { $match: { gameId: { $in: gameIds } } },
    { $group: { _id: "$gameId", count: { $sum: 1 } } }
  ]);
  
  const gamesMap = new Map(games.map(game => [game._id, game]));
  const progressMap = new Map(trophyProgress.map(progress => [progress.gameId, progress]));
  const trophyCountMap = new Map(trophyCounts.map(item => [item._id, item.count]));

  // Normaliza o filtro de nome para lowercase
  const normalizedName = name ? name.toLowerCase().trim() : null;

  const items = libraryItems
    .filter(item => {
      if (!normalizedName) return true;
      const game = gamesMap.get(item.gameId);
      return game && game.nome.toLowerCase().includes(normalizedName);
    })
    .map(item => {
      const game = gamesMap.get(item.gameId);
      const progress = progressMap.get(item.gameId);
      const totalTrophies = trophyCountMap.get(item.gameId) || 0;
      const completedCount = progress?.completedTrophies?.length || 0;
      const progressPercentage = totalTrophies > 0 ? Math.round((completedCount / totalTrophies) * 100) : 0;
      
      return {
        ...item,
        status: item.status,
        gameDetails: game ? {
          nome: game.nome,
          plataformas: game.plataformas,
          genres: game.genres,
          rating: game.rating,
          playtime: game.playtime,
          ratings_count: game.ratings_count,
          backgroundimage: game.backgroundimage,
          ano_de_lancamento: game.ano_de_lancamento
        } : null,
        trophyProgress: {
          totalCompleted: completedCount,
          totalTrophies: totalTrophies,
          progressPercentage: progressPercentage
        }
      };
    });

  // Conta total considerando o filtro de nome
  let total: number;
  if (name) {
    total = items.length;
  } else {
    total = await LibraryItemModel.countDocuments(filter);
  }

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
