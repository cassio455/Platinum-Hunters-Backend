import 'dotenv/config'; 

import mongoose from 'mongoose';
import { createUserService } from '../services/user/createUserService.js';
import { UserModel } from '../data/documents/userDocument.js';
import { UserRankingDataModel } from '../data/documents/userRankingDataDocument.js';
import { CompletedChallengeModel } from '../data/documents/completedChallengeDocument.js';

const PLACEHOLDER_USERS = [
    {
        username: "kaori",
        email: "kaori@fake.com",
        password: "TestPass123",
        profileImageUrl: "https://i.pravatar.cc/150?img=5",
        rankingData: {
            rankingPoints: 15300,
            coins: 1200,
            ownedTitles: ["👑 Soberano do Reino 👑", "🌸 Explorador de Sakura 🌸"],
            equippedTitle: "🌸 Explorador de Sakura 🌸"
        },
        completedChallenges: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    {
        username: "nineko",
        email: "nineko@fake.com",
        password: "TestPass123",
        profileImageUrl: "https://i.pravatar.cc/150?img=11",
        rankingData: {
            rankingPoints: 12000,
            coins: 500,
            ownedTitles: ["⚔️ Caçador de Elite ⚔️"],
            equippedTitle: "⚔️ Caçador de Elite ⚔️"
        },
        completedChallenges: [1, 2, 3, 4, 5, 10, 11, 12]
    },
    {
        username: "player_three",
        email: "p3@fake.com",
        password: "TestPass123",
        profileImageUrl: "https://i.pravatar.cc/150?img=14",
        rankingData: {
            rankingPoints: 9800,
            coins: 100,
            ownedTitles: [],
            equippedTitle: null
        },
        completedChallenges: [1, 2, 3]
    },
    {
        username: "gamer_legend",
        email: "legend@fake.com",
        password: "TestPass123",
        profileImageUrl: "https://i.pravatar.cc/150?img=13",
        rankingData: {
            rankingPoints: 4300,
            coins: 50,
            ownedTitles: ["🚀 Piloto Estelar 🚀"],
            equippedTitle: "🚀 Piloto Estelar 🚀"
        },
        completedChallenges: [1]
    }
];

export const seedUsers = async () => {
  try {
    console.log('🌱 Starting smart users seed...');
    
    let usersProcessed = 0;

    for (const userData of PLACEHOLDER_USERS) {
      let userId: string;

      const existingUser = await UserModel.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`   🔄 User ${userData.username} already exists. Updating ranking data...`);
        userId = existingUser._id.toString();
      } else {
        console.log(`   ✨ Creating new user: ${userData.username}`);
        const newUser = await createUserService({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            profileImageUrl: userData.profileImageUrl
        });
        userId = newUser.id;
      }

      await UserRankingDataModel.findOneAndUpdate(
        { userId: userId },
        {
            userId: userId,
            rankingPoints: userData.rankingData.rankingPoints,
            coins: userData.rankingData.coins,
            ownedTitles: userData.rankingData.ownedTitles,
            equippedTitle: userData.rankingData.equippedTitle
        },
        { upsert: true, new: true }
      );

      for (const challengeDay of userData.completedChallenges) {
        await CompletedChallengeModel.updateOne(
            { userId: userId, challengeDay: challengeDay },
            { 
                userId: userId, 
                challengeDay: challengeDay,
                pointsEarned: 50 
            },
            { upsert: true }
        );
      }

      usersProcessed++;
    }

    console.log(`\n✅ Processed ${usersProcessed} users successfully!`);
  } catch (error: any) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI;
    
    if (!mongoUri) {
        console.error('❌ MongoDB URI not found!');
        process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log(`✅ Connected to DB to run seed.`);

    await seedUsers();

    console.log('🎉 Seed finished!');
  } catch (error) {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

runSeed();