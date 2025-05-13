import { Request, Response, NextFunction } from 'express';
import { SargeService } from '../services/coach/sarge.service';
import { Conversation } from '../models/conversation.model';
import { Goal } from '../models/goal.model';
import { User } from '../models/user.model';

const sargeService = new SargeService();

/**
 * Send a message to the coach and get a response
 */
export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { message } = req.body;
        const userId = req.user?.uid;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Get user's active goal
        const currentGoal = await Goal.findOne({ userId, status: 'active' });

        // Get recent conversation history
        const conversationHistory = await Conversation.find({ userId })
            .sort({ lastActivity: -1 })
            .limit(5);

        // Get user profile
        const user = await User.findOne({ userId });
        if (!user) {
            res.status(404).json({ error: 'User profile not found' });
            return;
        }

        // Generate coach response
        const response = await sargeService.generateResponse(
            user,
            message,
            currentGoal,
            conversationHistory
        );

        // Create new conversation entry
        const conversation = new Conversation({
            userId,
            goalId: currentGoal?._id,
            messages: [
                {
                    role: 'user',
                    content: message,
                    timestamp: new Date()
                },
                {
                    role: 'assistant',
                    content: response,
                    timestamp: new Date()
                }
            ],
            context: {
                currentGoal: currentGoal?.title,
                recentChallenges: [],
                previousExcuses: sargeService.analyzeExcusePatterns(message)
            }
        });

        await conversation.save();

        res.json({
            response,
            conversationId: conversation._id
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get conversation history
 */
export const getConversationHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.uid;
        const { limit = 10, before } = req.query;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const query: any = { userId };
        if (before) {
            query.lastActivity = { $lt: new Date(before as string) };
        }

        const conversations = await Conversation.find(query)
            .sort({ lastActivity: -1 })
            .limit(Number(limit));

        res.json(conversations);
    } catch (error) {
        next(error);
    }
};

/**
 * Get a specific conversation
 */
export const getConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.uid;
        const { conversationId } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            userId
        });

        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
            return;
        }

        res.json(conversation);
    } catch (error) {
        next(error);
    }
}; 