import { Request, Response, NextFunction } from 'express';

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: 'Valid email is required' });
    }

    // Password validation
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    next();
};

export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
    const { email, displayName } = req.body;

    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Valid email is required' });
        }
    }

    if (displayName && displayName.length < 2) {
        return res.status(400).json({ message: 'Display name must be at least 2 characters long' });
    }

    next();
}; 