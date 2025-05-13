import { anthropic, DEFAULT_MODEL, DEFAULT_MAX_TOKENS } from '../../config/anthropic';
import { User } from '../../models/user.model';
import { Goal } from '../../models/goal.model';
import { Conversation } from '../../models/conversation.model';

/**
 * Sarge's personality profile and coaching style
 */
const SARGE_PROFILE = {
    name: 'Sarge',
    personality: {
        tone: 'direct, blunt, and challenging',
        communicationStyle: 'strategic use of profanity for emphasis, concise paragraphs, direct call-outs',
        coreValues: [
            'zero tolerance for excuses',
            'unwavering belief in human potential',
            'focus on self-reliance',
            'emphasis on mental toughness',
            'pushing beyond perceived limitations'
        ],
        responsePatterns: {
            excuses: 'direct confrontation with emphasis on personal accountability',
            progress: 'acknowledgment followed by challenge to do more',
            setbacks: 'focus on resilience and learning from failure',
            success: 'brief celebration followed by raising the bar',
            mentalHealth: 'brief acknowledgment, suggestion of professional help, offer to switch coaches'
        }
    }
};

/**
 * Builds the system prompt for Sarge's personality
 */
const buildSargeSystemPrompt = (): string => {
    return `You are Sarge, a tough-love AI coach focused on helping users achieve their goals through:
    
    - Direct, blunt communication with strategic profanity (occasional, for emphasis)
    - Zero tolerance for excuses and victim mentality
    - Unwavering belief in human potential
    - Focus on self-reliance and personal accountability
    - Emphasis on mental toughness and pushing beyond perceived limitations
    
    Respond as Sarge, maintaining your tough-love personality while genuinely helping the user progress toward their goal. 
    Use concise paragraphs, occasional strategic profanity (sparingly), and direct call-outs of any excuse patterns.
    Always reinforce personal accountability and emphasize that the user is capable of more than they believe.
    
    If the user appears to be in a negative mental state (expressing thoughts of self-harm, extreme depression, or hopelessness),
    briefly acknowledge their feelings, suggest professional mental health support, and ask if they'd like to speak with a 
    different coach personality.`;
};

/**
 * Builds the context for Sarge's conversation
 */
const buildConversationContext = (
    user: User,
    currentGoal: Goal | null,
    conversationHistory: Conversation[]
): string => {
    const recentMessages = conversationHistory
        .slice(-5)
        .map(conv => `${conv.messages[conv.messages.length - 1].content}`)
        .join('\n');

    return `USER CONTEXT:
    Name: ${user.name}
    Current Goal: ${currentGoal?.title || 'No active goal'}
    Goal Description: ${currentGoal?.description || 'N/A'}
    Current Progress: ${currentGoal?.progress || 'N/A'}
    Recent Messages: ${recentMessages}`;
};

/**
 * Detects potential mental health concerns in user messages
 */
const detectMentalHealthConcerns = (message: string): boolean => {
    const concerningPatterns = [
        /want to die/i,
        /kill myself/i,
        /no reason to live/i,
        /can't go on/i,
        /hopeless/i,
        /worthless/i,
        /useless/i,
        /no point/i,
        /give up/i
    ];

    return concerningPatterns.some(pattern => pattern.test(message));
};

/**
 * Sarge's coaching service
 */
export class SargeService {
    /**
     * Generates a response from Sarge
     */
    async generateResponse(
        user: User,
        userMessage: string,
        currentGoal: Goal | null,
        conversationHistory: Conversation[]
    ): Promise<string> {
        try {
            // Check for mental health concerns
            if (detectMentalHealthConcerns(userMessage)) {
                return this.generateMentalHealthResponse();
            }

            // Build the conversation context
            const context = buildConversationContext(user, currentGoal, conversationHistory);

            // Generate response using Anthropic API
            const response = await anthropic.messages.create({
                model: DEFAULT_MODEL,
                max_tokens: DEFAULT_MAX_TOKENS,
                messages: [
                    {
                        role: 'system',
                        content: buildSargeSystemPrompt()
                    },
                    {
                        role: 'user',
                        content: `${context}\n\nUSER'S LATEST MESSAGE:\n${userMessage}`
                    }
                ]
            });

            return response.content[0].text;
        } catch (error) {
            console.error('Error generating Sarge response:', error);
            throw new Error('Failed to generate coach response');
        }
    }

    /**
     * Generates a response for mental health concerns
     */
    private generateMentalHealthResponse(): string {
        return `Listen up, soldier. I hear you're going through some heavy shit right now. 
        While I'm here to push you to be your best, I'm not qualified to help with what you're dealing with.
        
        I strongly suggest reaching out to a mental health professional. They're the experts who can give you the support you need.
        
        Would you like to:
        1. Continue talking with me about your goals
        2. Switch to a different coach personality
        3. Get information about mental health resources
        
        Your well-being comes first. Let me know how you want to proceed.`;
    }

    /**
     * Analyzes user's message for excuse patterns
     */
    analyzeExcusePatterns(message: string): string[] {
        const excusePatterns = [
            {
                pattern: /can't|unable to|impossible/i,
                type: 'capability excuse'
            },
            {
                pattern: /too (hard|difficult|challenging)/i,
                type: 'difficulty excuse'
            },
            {
                pattern: /don't have (time|energy|motivation)/i,
                type: 'resource excuse'
            },
            {
                pattern: /but|however|although/i,
                type: 'qualification excuse'
            }
        ];

        return excusePatterns
            .filter(({ pattern }) => pattern.test(message))
            .map(({ type }) => type);
    }
} 