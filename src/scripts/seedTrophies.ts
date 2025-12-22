import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TrophyDataModel } from '../models/schemas/trophyData.js'; 
import { INITIAL_TROPHIES } from './initialTrophies.js'; 

dotenv.config(); 

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL; 
    
    if (!mongoUri) {
      console.error("❌ Erro: Não encontrei a MONGO_URI no seu .env");
      process.exit(1);
    }

    console.log("🔌 Conectando ao MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Conectado!");

    let totalInserted = 0;

    console.log("🚀 Iniciando a seed (Modo: Limpar e Recriar)...");

    for (const [gameId, list] of Object.entries(INITIAL_TROPHIES)) {
        await TrophyDataModel.deleteMany({ gameId, isCustom: false });
        const trophiesToInsert = list.map((t: any) => ({
            gameId,
            name: t.name,
            description: t.description,
            difficulty: 'bronze',
            isCustom: false
        }));

        if (trophiesToInsert.length > 0) {
            await TrophyDataModel.insertMany(trophiesToInsert);
            totalInserted += trophiesToInsert.length;
            console.log(`   > [${gameId}] Atualizado: ${trophiesToInsert.length} troféus inseridos.`);
        }
    }

    console.log(`\n🏁 Concluído! Total de ${totalInserted} troféus oficiais restaurados no banco.`);

  } catch (error) {
    console.error("❌ Erro ao rodar a seed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedDatabase();
