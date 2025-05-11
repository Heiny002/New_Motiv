import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin if it hasn't been initialized
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
    });
}

// Test function to verify authentication flow
async function testAuthFlow() {
    try {
        // 1. Create a test user
        console.log('1. Creating test user...');
        const testEmail = `test-${Date.now()}@example.com`;
        const testPassword = 'Test123!';
        
        const userRecord = await getAuth().createUser({
            email: testEmail,
            password: testPassword,
            emailVerified: false
        });
        console.log('✅ Test user created:', userRecord.uid);

        // 2. Get user by ID
        console.log('\n2. Getting user by ID...');
        const retrievedUser = await getAuth().getUser(userRecord.uid);
        console.log('✅ User retrieved:', retrievedUser.email);

        // 3. Update user profile
        console.log('\n3. Updating user profile...');
        const updatedUser = await getAuth().updateUser(userRecord.uid, {
            displayName: 'Test User',
            photoURL: 'https://example.com/photo.jpg'
        });
        console.log('✅ Profile updated:', updatedUser.displayName);

        // 4. Delete test user
        console.log('\n4. Cleaning up - deleting test user...');
        await getAuth().deleteUser(userRecord.uid);
        console.log('✅ Test user deleted');

        console.log('\n🎉 All authentication tests passed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run the test
testAuthFlow()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }); 