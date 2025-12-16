import passport from './passportConfig.js'; // Importa aquele config que criamos antes

// Exporta apenas o middleware do passport
export const requireAuth = passport.authenticate('jwt', { session: false });