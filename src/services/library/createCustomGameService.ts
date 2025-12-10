import { CustomGameModel } from "../../data/documents/customGameDocument.js";
import { generateUUID } from "../../utils/uuid.js";
import { ConflictException } from "../../exceptions/httpException.js";

type CreateCustomGameInput = {
  userId: string;
  nome: string;
  backgroundimage?: string;
  plataformas?: string[];
  genres?: string[];
  ano_de_lancamento?: number;
  description?: string;
};

export const createCustomGameService = async (input: CreateCustomGameInput) => {
  const { userId, nome, backgroundimage, plataformas, genres, ano_de_lancamento, description } = input;

  const existingGame = await CustomGameModel.findOne({
    userId,
    nome: { $regex: new RegExp(`^${nome}$`, 'i') }
  });

  if (existingGame) {
    throw new ConflictException('You already have a game with this name');
  }

  const gameId = generateUUID();

  const newGame = await CustomGameModel.create({
    _id: gameId,
    userId,
    nome,
    backgroundimage,
    plataformas: plataformas || [],
    genres: genres || [],
    ano_de_lancamento,
    description
  });

  return newGame.toObject();
};
