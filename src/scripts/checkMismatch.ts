import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CORREÇÃO DO ERRO __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ----------------------------------

interface DataJson {
  games: { id: string | number; nome: string }[];
}

interface Achievement {
  name: string;
}

interface AchievementsJson {
  [key: string]: Achievement[];
}

const checkMismatch = () => {
  try {
    // Ajuste de caminho: sai de src/scripts (..) e sai de src (..) para ir à raiz
    const achievementsPath = path.join(__dirname, '../../achievements.json');
    const dataPath = path.join(__dirname, '../../data.json');

    if (!fs.existsSync(achievementsPath) || !fs.existsSync(dataPath)) {
      console.error("❌ Arquivos JSON não encontrados.");
      console.error(`   Caminho tentado: ${achievementsPath}`);
      // Fallback: Tenta buscar usando o diretório atual de execução se a navegação relativa falhar
      console.log("   Tentando caminho absoluto via process.cwd()...");
      return;
    }

    console.log("📂 Lendo arquivos...");
    const achievementsData: AchievementsJson = JSON.parse(fs.readFileSync(achievementsPath, 'utf-8'));
    const dataJson: DataJson = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Cria um Set com todos os IDs válidos do data.json (convertendo para string)
    const validGameIds = new Set(dataJson.games.map(g => g.id.toString()));

    console.log(`📊 Jogos no data.json: ${validGameIds.size}`);
    console.log(`📊 Jogos no achievements.json: ${Object.keys(achievementsData).length}`);
    console.log("---------------------------------------------------");
    console.log("🔍 DIAGNÓSTICO DE DIVERGÊNCIA:");

    let errorCount = 0;

    for (const [achievementGameId, trophies] of Object.entries(achievementsData)) {
      // Se o ID do achievements.json NÃO existe no data.json
      if (!validGameIds.has(achievementGameId)) {
        errorCount++;
        const firstTrophyName = trophies.length > 0 ? trophies[0].name : "Sem troféus";
        
        console.log(`❌ ID ERRADO: [${achievementGameId}]`);
        console.log(`   🏆 Exemplo de Troféu: "${firstTrophyName}"`);
        console.log(`   👉 AÇÃO: Pesquise esse troféu no Google para saber o jogo, depois pegue o ID correto no data.json.`);
        console.log("-");
      }
    }

    if (errorCount === 0) {
      console.log("✅ Sucesso! Todos os IDs batem.");
    } else {
      console.log(`\n⚠️ Encontrados ${errorCount} jogos com IDs errados no achievements.json.`);
    }

  } catch (error) {
    console.error("Erro ao rodar diagnóstico:", error);
  }
};

checkMismatch();