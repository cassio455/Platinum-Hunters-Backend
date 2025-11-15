import { TokenExpiredError, verify} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserPayload, UserPayloadSchema } from '../auth/token.js';

export interface AuthRequest extends Request {
    user: UserPayload;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    try {
        verify(token, secretKey, (err, decoded) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    return res.status(401).json({ message: 'Token expired' });
                }
                return res.status(401).json({ message: 'Invalid token' });
            }
            try {
                (req as AuthRequest).user = UserPayloadSchema.parse(decoded);
                next();
            } catch (validationError) {
                return res.status(401).json({ message: 'Invalid token payload' });
            }
        });
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
}