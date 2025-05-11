import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
                email?: string;
                emailVerified: boolean;
            };
        }
    }
}

/**
 * Middleware to authenticate requests using Firebase ID token
 * Verifies the token from the Authorization header and attaches the user to the request
 */
export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get the ID token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            });
        }

        const idToken = authHeader.split('Bearer ')[1];
        
        // Verify the ID token
        const decodedToken = await getAuth().verifyIdToken(idToken);
        
        // Attach the user to the request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified || false
        };

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token'
        });
    }
};

/**
 * Optional authentication middleware
 * Similar to authenticateUser but doesn't return 401 if no token is provided
 * Useful for routes that can work with or without authentication
 */
export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return next();
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified || false
        };

        next();
    } catch (error) {
        // If token is invalid, continue without user
        next();
    }
}; 