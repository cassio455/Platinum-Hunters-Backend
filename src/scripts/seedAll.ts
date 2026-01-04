import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const seeds = [
  { name: 'Genres and Platforms', script: 'seed:genres-and-platforms' },
  { name: 'Games & Achievements', script: 'seed:games' },
  { name: 'Titles', script: 'seed:titles' },
  { name: 'Challenges', script: 'seed:challenges' },
  { name: 'Users', script: 'seed:users' },
  { name: 'Admin', script: 'seed:admin' }
];

async function runSeed(name: string, script: string): Promise<void> {
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`🌱 Seeding: ${name}`);
  console.log('━'.repeat(60));
  
  try {
    const { stdout, stderr } = await execAsync(`npm run ${script}`, {
      cwd: process.cwd(),
      env: process.env
    });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log(`✅ ${name} - Completed`);
  } catch (error: any) {
    console.error(`❌ ${name} - Failed`);
    console.error(error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting complete database seeding...\n');
  const startTime = Date.now();
  
  try {
    for (const seed of seeds) {
      await runSeed(seed.name, seed.script);
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 All seeds completed successfully!');
    console.log(`⏱️  Total time: ${duration}s`);
    console.log('═'.repeat(60));
  } catch (error) {
    console.error('\n❌ Seeding process failed');
    process.exit(1);
  }
}

main();
