import mongoose from 'mongoose';
import { GenreModel } from '../data/documents/genreDocument.js';
import { PlatformModel } from '../data/documents/platformDocument.js';
import { generateUUID } from '../utils/uuid.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface RawGameData {
  plataformas?: string[];
  genres?: string[];
}

interface DataFile {
  games: RawGameData[];
}

export const seedGenresAndPlatforms = async () => {
  try {
    console.log('🌱 Starting genres and platforms seed...');

    const dataPath = join(__dirname, '../../data.json');
    const rawData = readFileSync(dataPath, 'utf-8');
    const data: DataFile = JSON.parse(rawData);

    if (!data.games || data.games.length === 0) {
      console.log('⚠️  No games found in data.json');
      return;
    }

    const genresSet = new Set<string>();
    data.games.forEach(game => {
      if (game.genres && Array.isArray(game.genres)) {
        game.genres.forEach(genre => {
          if (genre && typeof genre === 'string') {
            genresSet.add(genre.trim());
          }
        });
      }
    });

    const platformsSet = new Set<string>();
    data.games.forEach(game => {
      if (game.plataformas && Array.isArray(game.plataformas)) {
        game.plataformas.forEach(platform => {
          if (platform && typeof platform === 'string') {
            platformsSet.add(platform.trim());
          }
        });
      }
    });

    console.log(`📦 Found ${genresSet.size} unique genres`);
    console.log(`📦 Found ${platformsSet.size} unique platforms`);

    // Seed genres
    let genresCreated = 0;
    let genresSkipped = 0;

    for (const genreName of genresSet) {
      const genreLower = genreName.toLowerCase();
      
      // Verifica se já existe
      const exists = await GenreModel.findOne({ nameLower: genreLower });
      
      if (!exists) {
        await GenreModel.create({
          _id: generateUUID(),
          name: genreName,
          nameLower: genreLower
        });
        genresCreated++;
      } else {
        genresSkipped++;
      }
    }

    console.log(`✅ Genres created: ${genresCreated}`);
    console.log(`⏭️  Genres skipped (already exist): ${genresSkipped}`);

    let platformsCreated = 0;
    let platformsSkipped = 0;

    for (const platformName of platformsSet) {
      const platformLower = platformName.toLowerCase();
      
      const exists = await PlatformModel.findOne({ nameLower: platformLower });
      
      if (!exists) {
        await PlatformModel.create({
          _id: generateUUID(),
          name: platformName,
          nameLower: platformLower
        });
        platformsCreated++;
      } else {
        platformsSkipped++;
      }
    }

    console.log(`✅ Platforms created: ${platformsCreated}`);
    console.log(`⏭️  Platforms skipped (already exist): ${platformsSkipped}`);

    console.log('🎉 Genres and platforms seed completed!');
  } catch (error) {
    console.error('❌ Error seeding genres and platforms:', error);
    throw error;
  }
};

// Executar o script
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedGenresAndPlatforms();
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
