import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';
import { UserRole } from '../models/user.js';

export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }

        const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
        
        if (!hasRole) {
            return res.status(403).json({ 
                message: 'Forbidden',
                requiredRoles: allowedRoles,
                userRoles: req.user.roles
            });
        }

        next();
    };
};
