import mongoose from 'mongoose';
import { GameModel } from '../data/documents/gameDocument.js';
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

export const seedGames = async () => {
  try {
    console.log('🌱 Starting games seed...');

    const dataPath = join(__dirname, '../../data.json');
    const rawData = readFileSync(dataPath, 'utf-8');
    const data: DataFile = JSON.parse(rawData);

    if (!data.games || data.games.length === 0) {
      console.log('⚠️  No games found in data.json');
      return;
    }

    console.log(`📦 Found ${data.games.length} games to seed`);

    const existingCount = await GameModel.countDocuments();
    if (existingCount > 0) {
      console.log(`🗑️  Removing ${existingCount} existing games...`);
      await GameModel.deleteMany({});
    }

    const gamesToInsert = data.games.map((game) => ({
      _id: generateUUID(),
      nome: game.nome,
      ano_de_lancamento: game.ano_de_lancamento,
      playtime: game.playtime,
      plataformas: game.plataformas || [],
      backgroundimage: game.backgroundimage,
      rating: game.rating,
      ratings: game.ratings || [],
      ratings_count: game.ratings_count,
      genres: game.genres || []
    }));

    console.log('💾 Inserting games in bulk...');
    const result = await GameModel.insertMany(gamesToInsert, {
      ordered: false,
      lean: true
    });

    console.log(`✅ Successfully seeded ${result.length} games!`);
    console.log(`📊 Sample games:`);
    console.log(`   - ${gamesToInsert[0]?.nome}`);
    console.log(`   - ${gamesToInsert[1]?.nome}`);
    console.log(`   - ${gamesToInsert[2]?.nome}`);

    return result.length;
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
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.error('Please create a .env file with MONGODB_URI variable');
      process.exit(1);
    }
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

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
