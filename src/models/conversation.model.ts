import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for a message in a conversation
 */
export interface IMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

/**
 * Interface for a conversation document
 */
export interface IConversation extends Document {
    userId: string;
    goalId?: string;
    checkInId?: string;
    messages: IMessage[];
    context: {
        currentGoal?: string;
        recentChallenges?: string[];
        previousExcuses?: string[];
    };
    lastActivity: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema for the Conversation model
 */
const ConversationSchema = new Schema<IConversation>(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        goalId: {
            type: String,
            index: true
        },
        checkInId: {
            type: String,
            index: true
        },
        messages: [{
            role: {
                type: String,
                enum: ['user', 'assistant'],
                required: true
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
        context: {
            currentGoal: String,
            recentChallenges: [String],
            previousExcuses: [String]
        },
        lastActivity: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Create indexes for efficient querying
ConversationSchema.index({ userId: 1, lastActivity: -1 });
ConversationSchema.index({ goalId: 1, lastActivity: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema); 