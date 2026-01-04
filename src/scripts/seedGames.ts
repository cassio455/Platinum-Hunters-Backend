import mongoose from 'mongoose';
import { GameModel } from '../data/documents/gameDocument.js';
import { TrophyDataModel } from '../models/schemas/trophyData.js';
import { generateUUID } from '../utils/uuid.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface RawGameData {
  id?: string;
  nome: string;
  ano_de_lancamento?: number;
  playtime?: number;
  plataformas?: string[];
  backgroundimage?: string;
  rating?: number;
  ratings?: Array<{
    id: number;
    title: string;
    count: number;
    percent: number;
  }>;
  ratings_count?: number;
  genres?: string[];
}

interface DataFile {
  games: RawGameData[];
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  image?: string;
  percent?: string;
}

interface AchievementsFile {
  [gameSequentialId: string]: Achievement[];
}

export const seedGames = async () => {
  try {
    console.log('🌱 Starting games seed...');

    const dataPath = join(__dirname, '../../data.json');
    const rawData = readFileSync(dataPath, 'utf-8');
    const data: DataFile = JSON.parse(rawData);

    const achievementsPath = join(__dirname, '../../achievements.json');
    const rawAchievements = readFileSync(achievementsPath, 'utf-8');
    const achievements: AchievementsFile = JSON.parse(rawAchievements);

    if (!data.games || data.games.length === 0) {
      console.log('⚠️  No games found in data.json');
      return;
    }

    console.log(`📦 Found ${data.games.length} games to seed`);
    console.log(`🏆 Found achievements for ${Object.keys(achievements).length} games`);

    const existingGamesCount = await GameModel.countDocuments();
    const existingTrophiesCount = await TrophyDataModel.countDocuments({ isCustom: false });
    
    if (existingGamesCount > 0) {
      console.log(`🗑️  Removing ${existingGamesCount} existing games...`);
      await GameModel.deleteMany({});
    }
    
    if (existingTrophiesCount > 0) {
      console.log(`🗑️  Removing ${existingTrophiesCount} existing official trophies...`);
      await TrophyDataModel.deleteMany({ isCustom: false });
    }

    const gamesToInsert = [];
    const trophiesToInsert = [];
    let gamesWithAchievements = 0;

    for (const game of data.games) {
      const gameGuid = generateUUID();
      const sequentialId = game.id;

      gamesToInsert.push({
        _id: gameGuid,
        nome: game.nome,
        ano_de_lancamento: game.ano_de_lancamento,
        playtime: game.playtime,
        plataformas: game.plataformas || [],
        backgroundimage: game.backgroundimage,
        rating: game.rating,
        ratings: game.ratings || [],
        ratings_count: game.ratings_count,
        genres: game.genres || []
      });

      if (sequentialId && achievements[sequentialId]) {
        const gameAchievements = achievements[sequentialId];
        gamesWithAchievements++;

        for (const achievement of gameAchievements) {
          const trophy: any = {
            _id: generateUUID(),
            gameId: gameGuid, // Usar o GUID gerado, não o ID sequencial!
            name: achievement.name,
            description: achievement.description,
            isCustom: false
          };
          
          if (achievement.image) {
            trophy.image = achievement.image;
          }
          
          trophiesToInsert.push(trophy);
        }

        console.log(`   ✓ [${game.nome}] ${gameAchievements.length} achievements mapeados`);
      }
    }

    console.log('💾 Inserting games in bulk...');
    const insertedGames = await GameModel.insertMany(gamesToInsert, {
      ordered: false,
      lean: true
    });

    if (trophiesToInsert.length > 0) {
      console.log('🏆 Inserting achievements in bulk...');
      await TrophyDataModel.insertMany(trophiesToInsert, {
        ordered: false,
        lean: true
      });
    }

    console.log(`\n✅ Successfully seeded ${insertedGames.length} games!`);
    console.log(`🏆 Successfully seeded ${trophiesToInsert.length} achievements for ${gamesWithAchievements} games!`);
    console.log(`\n📊 Sample games:`);
    console.log(`   - ${gamesToInsert[0]?.nome}`);
    console.log(`   - ${gamesToInsert[1]?.nome}`);
    console.log(`   - ${gamesToInsert[2]?.nome}`);

    return insertedGames.length;
  } catch (error: any) {
    console.error('❌ Error seeding games:', error.message);
    
    if (error.insertedDocs) {
      console.log(`⚠️  Partially succeeded: ${error.insertedDocs.length} games inserted`);
      return error.insertedDocs.length;
    }
    
    throw error;
  }
};

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI_LOCAL ou MONGODB_URI not found in environment variables');
      console.error('Please create a .env file with MONGODB_URI_LOCAL or MONGODB_URI variable');
      process.exit(1);
    }
    
    const isLocal = mongoUri === process.env.MONGODB_URI_LOCAL;
    console.log(`🔌 Connecting to MongoDB ${isLocal ? 'LOCAL' : 'ATLAS'}...`);
    await mongoose.connect(mongoUri);
    console.log(`✅ Connected to MongoDB ${isLocal ? 'LOCAL' : 'ATLAS'}!`);

    await seedGames();

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
};

runSeed();
