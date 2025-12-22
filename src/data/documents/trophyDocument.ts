import mongoose from 'mongoose';
import { TrophyProgressSchema } from '../../models/schemas/trophyProgress.js';

export const TrophyProgressModel = mongoose.model('TrophyProgress', TrophyProgressSchema);
