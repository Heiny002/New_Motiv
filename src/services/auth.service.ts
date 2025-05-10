import { getAuth } from 'firebase-admin/auth';
import { UserRecord } from 'firebase-admin/auth';

export class AuthService {
    /**
     * Create a new user in Firebase Authentication
     * @param email User's email address
     * @param password User's password
     * @param displayName User's display name
     * @returns The created user record
     */
    static async createUser(email: string, password: string, displayName?: string): Promise<UserRecord> {
        try {
            const userRecord = await getAuth().createUser({
                email,
                password,
                displayName,
                emailVerified: false
            });
            return userRecord;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Get a user by their email address
     * @param email User's email address
     * @returns The user record if found
     */
    static async getUserByEmail(email: string): Promise<UserRecord> {
        try {
            const userRecord = await getAuth().getUserByEmail(email);
            return userRecord;
        } catch (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }
    }

    /**
     * Update a user's profile information
     * @param uid User's unique identifier
     * @param updates Object containing the fields to update
     * @returns The updated user record
     */
    static async updateUser(uid: string, updates: {
        displayName?: string;
        email?: string;
        password?: string;
        emailVerified?: boolean;
    }): Promise<UserRecord> {
        try {
            const userRecord = await getAuth().updateUser(uid, updates);
            return userRecord;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    /**
     * Delete a user from Firebase Authentication
     * @param uid User's unique identifier
     */
    static async deleteUser(uid: string): Promise<void> {
        try {
            await getAuth().deleteUser(uid);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    /**
     * Send email verification to a user
     * @param email User's email address
     */
    static async sendEmailVerification(email: string): Promise<void> {
        try {
            const user = await this.getUserByEmail(email);
            await getAuth().generateEmailVerificationLink(email);
        } catch (error) {
            console.error('Error sending email verification:', error);
            throw error;
        }
    }

    /**
     * Send password reset email to a user
     * @param email User's email address
     */
    static async sendPasswordResetEmail(email: string): Promise<void> {
        try {
            await getAuth().generatePasswordResetLink(email);
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw error;
        }
    }
} 