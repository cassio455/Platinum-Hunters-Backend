import { UserModel } from "../../data/documents/userDocument.js";
import { LibraryItemModel } from "../../data/documents/libraryItemDocument.js";
import { CustomGameModel } from "../../data/documents/customGameDocument.js";
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

  const libraryStats = await LibraryItemModel.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalGames: { $sum: 1 },
        totalPlatinum: {
          $sum: {
            $cond: [{ $eq: ['$status', LibraryItemStatus.PLATINUM] }, 1, 0]
          }
        },
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

  const customGamesCount = await CustomGameModel.countDocuments({ userId });

  const stats = libraryStats.length > 0 ? libraryStats[0] : {
    totalGames: 0,
    totalPlatinum: 0,
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
      updatedAt: user.updatedAt
    },
    statistics: {
      totalGamesInLibrary: stats.totalGames,
      totalPlatinum: stats.totalPlatinum,
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