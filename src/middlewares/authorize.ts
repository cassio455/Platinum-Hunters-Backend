import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';
import { UserRole } from '../models/user.js';
/**
* Middleware to authorize users based on their roles
* @param allowedRoles - Array of roles that are allowed to access the route
*/
export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        
        if (!authReq.user) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }

        const hasRole = authReq.user.roles.some(role => allowedRoles.includes(role));
        
        if (!hasRole) {
            return res.status(403).json({ 
                message: 'Forbidden: Insufficient permissions'
            });
        }

        next();
    };
};
