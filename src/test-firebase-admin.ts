import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin if it hasn't been initialized
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            })
        });
        console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin SDK:', error);
        process.exit(1);
    }
}

// Get Auth instance
const adminAuth = getAuth();

// Test function to verify Firebase Admin SDK connection
async function testFirebaseAdminConnection() {
    try {
        // Try to list users (limited to 1 to test connection)
        const listUsersResult = await adminAuth.listUsers(1);
        console.log('✅ Successfully connected to Firebase Admin SDK');
        console.log('📊 First user in system:', listUsersResult.users[0]?.email || 'No users found');
        return true;
    } catch (error) {
        console.error('❌ Error testing Firebase Admin connection:', error);
        return false;
    }
}

// Run the test
testFirebaseAdminConnection()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }); 