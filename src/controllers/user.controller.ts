import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { UserService } from '../services/user.service';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        // Create user in Firebase
        const userRecord = await getAuth().createUser({
            email,
            password,
            displayName: name,
            emailVerified: false
        });

        // Create user profile in MongoDB
        const userProfile = await UserService.createUserProfile(userRecord);

        // Send verification email
        await getAuth().generateEmailVerificationLink(email);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                name: userProfile.name,
                emailVerified: userRecord.emailVerified,
                coachPersonality: userProfile.coachPersonality
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.uid) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'User not authenticated'
            });
            return;
        }

        const userProfile = await UserService.getUserProfile(req.user.uid);
        if (!userProfile) {
            res.status(404).json({
                error: 'Not Found',
                message: 'User profile not found'
            });
            return;
        }

        res.json({
            user: {
                uid: userProfile.userId,
                email: userProfile.email,
                name: userProfile.name,
                emailVerified: req.user.emailVerified,
                coachPersonality: userProfile.coachPersonality,
                preferences: userProfile.preferences,
                dashboardConfig: userProfile.dashboardConfig,
                lastActive: userProfile.lastActive
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.uid) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'User not authenticated'
            });
            return;
        }

        const { name, coachPersonality } = req.body;
        
        // Update Firebase profile
        await getAuth().updateUser(req.user.uid, {
            displayName: name
        });

        // Update MongoDB profile
        const updatedProfile = await UserService.updateUserProfile(req.user.uid, {
            name,
            coachPersonality
        });

        res.json({
            message: 'Profile updated successfully',
            user: {
                uid: updatedProfile?.userId,
                email: updatedProfile?.email,
                name: updatedProfile?.name,
                emailVerified: req.user.emailVerified,
                coachPersonality: updatedProfile?.coachPersonality
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user preferences
 */
export const updatePreferences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.uid) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'User not authenticated'
            });
            return;
        }

        const { preferences } = req.body;
        const updatedProfile = await UserService.updatePreferences(req.user.uid, preferences);

        res.json({
            message: 'Preferences updated successfully',
            preferences: updatedProfile?.preferences
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update dashboard configuration
 */
export const updateDashboardConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.uid) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'User not authenticated'
            });
            return;
        }

        const { dashboardConfig } = req.body;
        const updatedProfile = await UserService.updateDashboardConfig(req.user.uid, dashboardConfig);

        res.json({
            message: 'Dashboard configuration updated successfully',
            dashboardConfig: updatedProfile?.dashboardConfig
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        await getAuth().generatePasswordResetLink(email);
        
        res.json({
            message: 'Password reset email sent'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user account
 */
export const deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.uid) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'User not authenticated'
            });
            return;
        }

        await UserService.deleteUser(req.user.uid);
        res.json({
            message: 'Account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}; 