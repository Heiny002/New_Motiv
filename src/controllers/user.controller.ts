import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class UserController {
    /**
     * Register a new user
     * @route POST /api/auth/register
     */
    static async register(req: Request, res: Response) {
        try {
            const { email, password, displayName } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            // Create user in Firebase
            const userRecord = await AuthService.createUser(email, password, displayName);

            // Send verification email
            await AuthService.sendEmailVerification(email);

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    displayName: userRecord.displayName
                }
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            res.status(400).json({
                message: error.message || 'Error registering user'
            });
        }
    }

    /**
     * Get current user profile
     * @route GET /api/users/profile
     */
    static async getProfile(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const userRecord = await AuthService.getUserByEmail(user.email);
            res.json({
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                emailVerified: userRecord.emailVerified
            });
        } catch (error: any) {
            console.error('Get profile error:', error);
            res.status(400).json({
                message: error.message || 'Error getting user profile'
            });
        }
    }

    /**
     * Update user profile
     * @route PUT /api/users/profile
     */
    static async updateProfile(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const { displayName, email } = req.body;
            const updates: any = {};

            if (displayName) updates.displayName = displayName;
            if (email) updates.email = email;

            const updatedUser = await AuthService.updateUser(user.uid, updates);
            res.json({
                message: 'Profile updated successfully',
                user: {
                    uid: updatedUser.uid,
                    email: updatedUser.email,
                    displayName: updatedUser.displayName
                }
            });
        } catch (error: any) {
            console.error('Update profile error:', error);
            res.status(400).json({
                message: error.message || 'Error updating profile'
            });
        }
    }

    /**
     * Request password reset
     * @route POST /api/auth/reset-password
     */
    static async requestPasswordReset(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            await AuthService.sendPasswordResetEmail(email);
            res.json({ message: 'Password reset email sent' });
        } catch (error: any) {
            console.error('Password reset request error:', error);
            res.status(400).json({
                message: error.message || 'Error sending password reset email'
            });
        }
    }

    /**
     * Delete user account
     * @route DELETE /api/users/profile
     */
    static async deleteAccount(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            await AuthService.deleteUser(user.uid);
            res.json({ message: 'Account deleted successfully' });
        } catch (error: any) {
            console.error('Delete account error:', error);
            res.status(400).json({
                message: error.message || 'Error deleting account'
            });
        }
    }
} 