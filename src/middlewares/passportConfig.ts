import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// MUDANÇA AQUI: Apontando para o arquivo de documento correto
import { UserModel } from '../data/documents/userDocument.js'; 
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    // Agora o ID do token vai bater com o ID deste modelo
    const user = await UserModel.findById(payload.userId);
    
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(strategy);
export default passport;