import { User, IUser } from '../models/user.model';
import { getAuth } from 'firebase-admin/auth';

export class UserService {
    /**
     * Create a new user profile in MongoDB after Firebase registration
     */
    static async createUserProfile(firebaseUser: any): Promise<IUser> {
        try {
            const user = new User({
                userId: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                coachPersonality: 'sarge', // Default to Sarge for MVP
                preferences: {
                    notifications: {
                        morningCheckIn: true,
                        eveningCheckIn: true,
                        goalReminders: true,
                        communityUpdates: true
                    },
                    theme: 'system',
                    language: 'en'
                },
                dashboardConfig: {
                    widgets: [
                        {
                            type: 'dailyProgress',
                            position: 0,
                            config: {}
                        },
                        {
                            type: 'goalList',
                            position: 1,
                            config: {}
                        }
                    ],
                    layout: 'default'
                }
            });

            await user.save();
            return user;
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }

    /**
     * Get user profile by Firebase UID
     */
    static async getUserProfile(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ userId });
            if (user) {
                // Update last active timestamp
                user.lastActive = new Date();
                await user.save();
            }
            return user;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    static async updateUserProfile(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
        try {
            const user = await User.findOneAndUpdate(
                { userId },
                { $set: { ...updates, lastActive: new Date() } },
                { new: true }
            );
            return user;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    /**
     * Update user preferences
     */
    static async updatePreferences(userId: string, preferences: Partial<IUser['preferences']>): Promise<IUser | null> {
        try {
            const user = await User.findOneAndUpdate(
                { userId },
                { $set: { preferences: preferences, lastActive: new Date() } },
                { new: true }
            );
            return user;
        } catch (error) {
            console.error('Error updating user preferences:', error);
            throw error;
        }
    }

    /**
     * Update dashboard configuration
     */
    static async updateDashboardConfig(userId: string, config: Partial<IUser['dashboardConfig']>): Promise<IUser | null> {
        try {
            const user = await User.findOneAndUpdate(
                { userId },
                { $set: { dashboardConfig: config, lastActive: new Date() } },
                { new: true }
            );
            return user;
        } catch (error) {
            console.error('Error updating dashboard config:', error);
            throw error;
        }
    }

    /**
     * Delete user profile and Firebase account
     */
    static async deleteUser(userId: string): Promise<void> {
        try {
            // Delete from MongoDB
            await User.deleteOne({ userId });
            
            // Delete from Firebase
            await getAuth().deleteUser(userId);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
} 