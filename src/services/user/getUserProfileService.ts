import { UserModel } from "../../data/documents/userDocument.js";
import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { CustomGameModel } from "../../data/documents/customGameDocument.js";
import { UserRankingDataModel } from "../../data/documents/userRankingDataDocument.js";
// IMPORTANTE: Importar o modelo de Progresso de Troféus
import { TrophyProgressModel } from "../../data/documents/trophyDocument.js"; 
import { LibraryItemStatus } from "../../models/libraryItemStatus.js";
import { HttpException } from "../../exceptions/httpException.js";

interface GetUserProfileInput {
  userId: string;
}

export const getUserProfileService = async ({ userId }: GetUserProfileInput) => {
  const user = await UserModel.findById(userId).select('-passwordHash');
  
  if (!user) {
    throw new HttpException('User not found', 404);
  }

  const rankingData = await UserRankingDataModel.findOne({ userId });

  // 1. Estatísticas da Biblioteca Manual (Mantemos para jogos, horas, playing, etc)
  const libraryStats = await LibraryItemModel.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalGames: { $sum: 1 },
        // totalPlatinum: Vamos substituir pelo cálculo automático abaixo
        totalCompleted: {
          $sum: {
            $cond: [{ $eq: ['$status', LibraryItemStatus.COMPLETED] }, 1, 0]
          }
        },
        totalPlaying: {
          $sum: {
            $cond: [{ $eq: ['$status', LibraryItemStatus.PLAYING] }, 1, 0]
          }
        },
        totalWishlist: {
          $sum: {
            $cond: [{ $eq: ['$status', LibraryItemStatus.WISHLIST] }, 1, 0]
          }
        },
        totalAbandoned: {
          $sum: {
            $cond: [{ $eq: ['$status', LibraryItemStatus.ABANDONED] }, 1, 0]
          }
        },
        totalHoursPlayed: { $sum: '$hoursPlayed' },
        averageProgress: { $avg: '$progress' }
      }
    }
  ]);

  // 2. CÁLCULO AUTOMÁTICO DE PLATINAS (Baseado nos troféus reais)
  // Verifica: Se (Troféus do Usuario == Total de Troféus do Jogo) -> É Platina
  const realPlatinumCount = await TrophyProgressModel.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: 'trophydatas', // Nome da coleção do TrophyDataModel no Mongo
        localField: 'gameId',
        foreignField: 'gameId',
        as: 'allGameTrophies'
      }
    },
    {
      $project: {
        gameId: 1,
        userTrophiesCount: { 
            $cond: { 
                if: { $isArray: "$completedTrophies" }, 
                then: { $size: "$completedTrophies" }, 
                else: 0 
            } 
        },
        totalGameTrophies: { $size: "$allGameTrophies" }
      }
    },
    {
      // Filtra apenas onde o usuário tem TODOS os troféus (e o jogo tem pelo menos 1 troféu)
      $match: {
        $expr: {
          $and: [
            { $gt: ["$totalGameTrophies", 0] },
            { $gte: ["$userTrophiesCount", "$totalGameTrophies"] }
          ]
        }
      }
    },
    {
      $count: "totalPlatinums"
    }
  ]);

  const autoPlatinumValue = realPlatinumCount.length > 0 ? realPlatinumCount[0].totalPlatinums : 0;

  const customGamesCount = await CustomGameModel.countDocuments({ userId });

  const stats = libraryStats.length > 0 ? libraryStats[0] : {
    totalGames: 0,
    totalCompleted: 0,
    totalPlaying: 0,
    totalWishlist: 0,
    totalAbandoned: 0,
    totalHoursPlayed: 0,
    averageProgress: 0
  };

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      equippedTitle: rankingData?.equippedTitle || null
    },
    statistics: {
      totalGamesInLibrary: stats.totalGames,
      // AQUI ESTÁ A MUDANÇA: Usamos o valor calculado automaticamente
      totalPlatinum: autoPlatinumValue, 
      totalCompleted: stats.totalCompleted,
      totalPlaying: stats.totalPlaying,
      totalWishlist: stats.totalWishlist,
      totalAbandoned: stats.totalAbandoned,
      totalCustomGames: customGamesCount,
      totalHoursPlayed: Math.round(stats.totalHoursPlayed * 100) / 100,
      averageProgress: Math.round(stats.averageProgress * 100) / 100
    }
  };
};