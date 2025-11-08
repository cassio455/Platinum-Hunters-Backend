import mongoose, { ConnectOptions } from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('MONGODB_URI não está definido no arquivo .env');
    process.exit(1); 
  }
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB conectado com sucesso!');

    mongoose.connection.on('error', (err) => {
      console.error(`Erro do Mongoose: ${err.message}`);
    });

  } catch (error) {
    console.error('Falha ao conectar ao MongoDB:', error);
    process.exit(1); 
  }
};