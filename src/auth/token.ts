import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user.js';
import { z } from 'zod';

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = '2h';

if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export const UserPayloadSchema = z.object({
    userId: z.string(),
    email: z.string().email(),
    roles: z.array(z.enum([UserRole.ADMIN, UserRole.USER, UserRole.MOD])),
    username: z.string(),
});
export type UserPayload = z.infer<typeof UserPayloadSchema>;

export const generateToken = (payload: UserPayload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
}
