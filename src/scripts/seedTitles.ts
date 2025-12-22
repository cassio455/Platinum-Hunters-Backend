import mongoose from 'mongoose';
import TitleModel from '../models/TitleModel.js';
import dotenv from 'dotenv';

dotenv.config();

const INITIAL_TITLES = [
    { name: "🌸 Explorador de Sakura 🌸", cost: 100 },
    { name: "⚔️ Caçador de Elite ⚔️", cost: 200 },
    { name: "🧩 Complecionista de Puzzles 🧩", cost: 150 },
    { name: "📝 Mestre das Reviews 📝", cost: 250 },
    { name: "✨ Colecionador de Estrelas ✨", cost: 300 },
    { name: "🛡️ Defensor Lendário 🛡️", cost: 450 },
    { name: "🌌 Viajante Interdimensional 🌌", cost: 500 },
    { name: "👑 Soberano do Reino 👑", cost: 1000 },
    { name: "🔮 Oráculo Misterioso 🔮", cost: 750 },
    { name: "🚀 Piloto Estelar 🚀", cost: 600 },
    { name: "💖 Coração de Ouro 💖", cost: 200 },
    { name: "⚙️ Engenheiro Mestre ⚙️", cost: 350 },
    { name: "🖋️ Cronista da História 🖋️", cost: 250 },
    { name: "💎 Tesouro Perdido 💎", cost: 850 },
    { name: "🌙 Sentinela Noturno 🌙", cost: 400 },
];

export const seedTitles = async () => {
    try {
        console.log('🌱 Starting titles seed...');

        let newTitlesCount = 0;
        let skippedTitlesCount = 0;

        for (const title of INITIAL_TITLES) {
            const exists = await TitleModel.findOne({ name: title.name });
            if (!exists) {
                await TitleModel.create(title);
                newTitlesCount++;
            } else {
                skippedTitlesCount++;
            }
        }

        console.log(`✅ Titles created: ${newTitlesCount}`);
        console.log(`⏭️  Titles skipped (already exist): ${skippedTitlesCount}`);

        return newTitlesCount;
    } catch (error: any) {
        console.error('❌ Error seeding titles:', error.message);
        throw error;
    }
};

const runSeed = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            console.error('❌ MONGODB_URI not found in environment variables');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        await seedTitles();

        console.log('🎉 Seed completed successfully!');
    } catch (error) {
        console.error('💥 Seed failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
};

runSeed();
