import mongoose from 'mongoose';
import ChallengeModel from '../models/ChallengeModel.js';
import dotenv from 'dotenv';

dotenv.config();

const INITIAL_CHALLENGES = [
    { 
        day: 1, 
        title: "Consiga qualquer troféu em Elden Ring", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "elden-ring",
            trophyName: "Qualquer Troféu de Elden Ring",
            anyTrophy: true
        }
    },
    { 
        day: 2, 
        title: "Adquira 1 Troféu", 
        points: 50,
        type: 'COUNT',
        targetCount: 1
    },
    { 
        day: 3, 
        title: "Consiga qualquer troféu em Grand Theft Auto V", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "grand-theft-auto-v",
            trophyName: "Qualquer Troféu de Grand Theft Auto V",
            anyTrophy: true
        }
    },
    { 
        day: 4, 
        title: "Adquira 2 Troféus", 
        points: 75,
        type: 'COUNT',
        targetCount: 2
    },
    { 
        day: 5, 
        title: "Consiga qualquer troféu em Hollow Knight", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "hollow-knight",
            trophyName: "Qualquer Troféu de Hollow Knight",
            anyTrophy: true
        }
    },
    { 
        day: 6, 
        title: "Adquira 3 Troféus", 
        points: 90, 
        type: 'COUNT',
        targetCount: 3
    },
    { 
        day: 7, 
        title: "Consiga qualquer troféu em Little Nightmares", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "little-nightmares",
            trophyName: "Qualquer Troféu de Little Nightmares",
            anyTrophy: true
        }
    },
    { 
        day: 8, 
        title: "Adquira 4 Troféus", 
        points: 105, 
        type: 'COUNT',
        targetCount: 4
    },
        { 
        day: 9, 
        title: "Consiga qualquer troféu em BioShock 2", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "bioshock-2",
            trophyName: "Qualquer Troféu de BioShock 2",
            anyTrophy: true
        }
    },
    { 
        day: 10, 
        title: "Adquira 5 Troféus", 
        points: 120, 
        type: 'COUNT',
        targetCount: 5
    },
        { 
        day: 11, 
        title: "Consiga qualquer troféu em Half-Life", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "half-life",
            trophyName: "Qualquer Troféu de Half-Life",
            anyTrophy: true
        }
    },
    { 
        day: 12, 
        title: "Adquira 6 Troféus", 
        points: 135, 
        type: 'COUNT',
        targetCount: 6
    },
        { 
        day: 13, 
        title: "Consiga qualquer troféu em Dark Souls III", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "dark-souls-iii",
            trophyName: "Qualquer Troféu de Dark Souls III",
            anyTrophy: true
        }
    },
        { 
        day: 14, 
        title: "Adquira 7 Troféus", 
        points: 150, 
        type: 'COUNT',
        targetCount: 7
    },
        { 
        day: 15, 
        title: "Consiga qualquer troféu em Stardew Valley", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "stardew-valley",
            trophyName: "Qualquer Troféu de Stardew Valley",
            anyTrophy: true
        }
    },
        { 
        day: 16, 
        title: "Adquira 8 Troféus", 
        points: 165, 
        type: 'COUNT',
        targetCount: 8
    },
        { 
        day: 17, 
        title: "Consiga qualquer troféu em Hotline Miami", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "hotline-miami",
            trophyName: "Qualquer Troféu de Hotline Miami",
            anyTrophy: true
        }
    },
        { 
        day: 18, 
        title: "Adquira 9 Troféus", 
        points: 190, 
        type: 'COUNT',
        targetCount: 9
    },
        { 
        day: 19, 
        title: "Consiga qualquer troféu em Hitman", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "hitman",
            trophyName: "Qualquer Troféu de Hitman",
            anyTrophy: true
        }
    },
        { 
        day: 20, 
        title: "Adquira 10 Troféus", 
        points: 205, 
        type: 'COUNT',
        targetCount: 10
    },
        { 
        day: 21, 
        title: "Consiga qualquer troféu em Far Cry 3", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "far-cry-3",
            trophyName: "Qualquer Troféu de Far Cry 3",
            anyTrophy: true
        }
    },
        { 
        day: 22, 
        title: "Adquira 11 Troféus", 
        points: 220, 
        type: 'COUNT',
        targetCount: 11
    },
        { 
        day: 23, 
        title: "Consiga qualquer troféu em Path of Exile", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "path-of-exile",
            trophyName: "Qualquer Troféu de Path of Exile",
            anyTrophy: true
        }
    },
        { 
        day: 24, 
        title: "Adquira 12 Troféus", 
        points: 235, 
        type: 'COUNT',
        targetCount: 12
    },
        { 
        day: 25, 
        title: "Consiga qualquer troféu em Alan Wake", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "alan-wake",
            trophyName: "Qualquer Troféu de Alan Wake",
            anyTrophy: true
        }
    },
        { 
        day: 26, 
        title: "Adquira 13 Troféus", 
        points: 250, 
        type: 'COUNT',
        targetCount: 13
    },
        { 
        day: 27, 
        title: "Consiga qualquer troféu em Borderlands", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "borderlands",
            trophyName: "Qualquer Troféu de Borderlands",
            anyTrophy: true
        }
    },
        { 
        day: 28, 
        title: "Adquira 14 Troféus", 
        points: 265, 
        type: 'COUNT',
        targetCount: 14
    },
        { 
        day: 29, 
        title: "Consiga qualquer troféu em Dishonored 2", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "dishonored-2",
            trophyName: "Qualquer Troféu de Dishonored 2",
            anyTrophy: true
        }
    },
        { 
        day: 30, 
        title: "Adquira 15 Troféus", 
        points: 290, 
        type: 'COUNT',
        targetCount: 15
    },
        { 
        day: 31, 
        title: "Consiga qualquer troféu em Celeste", 
        points: 100,
        type: 'SPECIFIC',
        requiredTrophy: {
            gameId: "celeste",
            trophyName: "Qualquer Troféu de Celeste",
            anyTrophy: true
        }
    }
];

export const seedChallenges = async () => {
    try {
        console.log('🌱 Starting challenges seed...');
        let updatedCount = 0;

        for (const challenge of INITIAL_CHALLENGES) {
            await ChallengeModel.findOneAndUpdate(
                { day: challenge.day }, 
                challenge, 
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            updatedCount++;
        }
        console.log(`✅ Challenges processed: ${updatedCount}`);
        return updatedCount;
    } catch (error: any) {
        console.error('❌ Error seeding challenges:', error.message);
        throw error;
    }
};

const runSeed = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI;
        if (!mongoUri) {
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        await seedChallenges();
        console.log('🎉 Seed completed successfully!');
    } catch (error) {
        console.error('💥 Seed failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

runSeed();