import mongoose from 'mongoose';
import { TrophyProgressSchema } from '../../models/schemas/trophyProgress.js';

// Cria o model "TrophyProgress" usando o schema que criamos
export const TrophyProgressModel = mongoose.model('TrophyProgress', TrophyProgressSchema);