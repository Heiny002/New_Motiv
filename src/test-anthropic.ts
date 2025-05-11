import { testAnthropicConnection } from './config/anthropic';

/**
 * Test the Anthropic API integration
 */
async function testIntegration() {
    console.log('Testing Anthropic API integration...');
    
    try {
        const isConnected = await testAnthropicConnection();
        
        if (isConnected) {
            console.log('✅ Anthropic API integration successful!');
        } else {
            console.error('❌ Anthropic API integration failed!');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error testing Anthropic API integration:', error);
        process.exit(1);
    }
}

// Run the test
testIntegration(); 