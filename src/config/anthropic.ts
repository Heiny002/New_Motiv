import { Anthropic } from '@anthropic-ai/sdk';
import { config } from 'dotenv';

// Load environment variables
config();

// Validate required environment variables
if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is required in environment variables');
}

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Default model configuration
const DEFAULT_MODEL = 'claude-3-sonnet-20240229';
const DEFAULT_MAX_TOKENS = 1000;

/**
 * Test the Anthropic API connection
 * @returns {Promise<boolean>} True if connection is successful
 */
export const testAnthropicConnection = async (): Promise<boolean> => {
    try {
        const response = await anthropic.messages.create({
            model: DEFAULT_MODEL,
            max_tokens: 100,
            messages: [
                {
                    role: 'user',
                    content: 'Hello, this is a test message to verify the API connection.'
                }
            ]
        });
        
        return response.content.length > 0;
    } catch (error) {
        console.error('Anthropic API connection test failed:', error);
        return false;
    }
};

export { anthropic, DEFAULT_MODEL, DEFAULT_MAX_TOKENS }; 