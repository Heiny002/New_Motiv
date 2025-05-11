import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Interface for Firebase error
 */
interface FirebaseError extends Error {
    code: string;
}

/**
 * Error handling middleware
 */
export const errorHandler = (
    err: Error | AppError | FirebaseError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    // Handle Firebase errors
    if ('code' in err) {
        const statusCode = err.code === 'auth/user-not-found' ? 404 :
            err.code === 'auth/wrong-password' ? 401 :
            err.code === 'auth/email-already-in-use' ? 409 :
            err.code === 'auth/invalid-email' ? 400 :
            err.code === 'auth/weak-password' ? 400 : 500;

        res.status(statusCode).json({
            error: 'Firebase Error',
            message: err.message,
            code: err.code
        });
        return;
    }

    // Handle application errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.name,
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
        return;
    }

    // Handle unknown errors
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}; 