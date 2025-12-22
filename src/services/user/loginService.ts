import { UserModel } from "../../data/documents/userDocument.js";
import { UserRankingDataModel } from "../../data/documents/userRankingDataDocument.js";
import { CompletedChallengeModel } from "../../data/documents/completedChallengeDocument.js";
import { generateToken } from "../../auth/token.js";
import { BadRequestException } from "../../exceptions/httpException.js";
import { comparePassword } from "../passwordHasher.js";

interface LoginUserDto {
  email: string;
  password: string;
}

export const loginUserService = async (credentials: LoginUserDto) => {
  const { email, password } = credentials;
  const userDocument = await UserModel.findOne({ email: email.toLowerCase() });

  if (!userDocument) {
    throw new BadRequestException("Invalid email or password");
  }

  const passwordIsValid = await comparePassword(password, userDocument.passwordHash);

  if (!passwordIsValid) {
    throw new BadRequestException("Invalid email or password");
  }

  const token = generateToken({
    userId: userDocument._id.toString(), 
    email: userDocument.email,
    username: userDocument.username,
    roles: userDocument.roles as any
  });

  // Buscar dados de ranking (podem não existir ainda)
  const rankingData = await UserRankingDataModel.findOne({ userId: userDocument._id });
  const completedChallenges = await CompletedChallengeModel.find({ userId: userDocument._id }).select('challengeDay');

  return {
    id: userDocument._id.toString(),
    username: userDocument.username,
    email: userDocument.email,
    profileImageUrl: userDocument.profileImageUrl,
    coins: rankingData?.coins || 0,
    rankingPoints: rankingData?.rankingPoints || 0,
    completedChallenges: completedChallenges.map(c => c.challengeDay),
    ownedTitles: rankingData?.ownedTitles || [],
    equippedTitle: rankingData?.equippedTitle || null,
    token,
  };
};