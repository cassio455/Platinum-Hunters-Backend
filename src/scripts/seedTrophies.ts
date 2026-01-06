import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; // <--- Importação necessária
import { TrophyDataModel } from '../models/schemas/trophyData.js'; // Verifique se o caminho está certo para o seu projeto

dotenv.config();

// --- CORREÇÃO DO ERRO __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ----------------------------------

interface GameEntry {
  id: string; 
  nome: string; 
}

interface DataJson {
  games: GameEntry[];
}

interface AchievementRaw {
  id: number;
  name: string;
  description: string;
  image: string;
  percent: string;
}

interface AchievementsJson {
  [gameId: string]: AchievementRaw[];
}

const createSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/:/g, '')
    .replace(/'/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!mongoUri) {
      console.error("❌ Erro: URI do MongoDB não encontrada no .env");
      process.exit(1);
    }

    console.log("🔌 Conectando ao MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Conectado!");

    // Ajuste de caminho: sai de src/scripts (..) e sai de src (..) para a raiz
    const achievementsPath = path.join(__dirname, '../../achievements.json');
    const dataPath = path.join(__dirname, '../../data.json');

    if (!fs.existsSync(achievementsPath) || !fs.existsSync(dataPath)) {
      throw new Error("❌ Arquivos achievements.json ou data.json não encontrados na raiz.");
    }

    const achievementsData: AchievementsJson = JSON.parse(fs.readFileSync(achievementsPath, 'utf-8'));
    const dataJson: DataJson = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const idToSlugMap = new Map<string, string>();
    dataJson.games.forEach(game => {
        const slug = createSlug(game.nome);
        idToSlugMap.set(game.id.toString(), slug);
    });

    let totalInserted = 0;

    console.log("🚀 Iniciando a importação...");

    for (const [numericId, list] of Object.entries(achievementsData)) {
        const gameSlug = idToSlugMap.get(numericId);

        if (!gameSlug) {
            console.warn(`⚠️ Jogo ID ${numericId} não encontrado no data.json. Pulando.`);
            continue;
        }

        // Limpa troféus antigos desse jogo (apenas os do sistema)
        await TrophyDataModel.deleteMany({ gameId: gameSlug, isCustom: false });

        const trophiesToInsert = list.map(ach => ({
            _id: ach.id.toString(),
            gameId: gameSlug,
            name: ach.name,
            description: ach.description || "Sem descrição",
            image: ach.image,
            isCustom: false,
            createdAt: new Date()
        }));

        if (trophiesToInsert.length > 0) {
            await TrophyDataModel.insertMany(trophiesToInsert, { ordered: false });
            totalInserted += trophiesToInsert.length;
            console.log(`   > [${gameSlug}] Importados: ${trophiesToInsert.length} troféus.`);
        }
    }

    console.log(`\n🏁 Sucesso! Total de ${totalInserted} troféus inseridos.`);

  } catch (error) {
    console.error("❌ Erro fatal na seed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedDatabase();