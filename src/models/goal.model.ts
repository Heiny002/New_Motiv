import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for a daily action in a goal
 */
export interface IDailyAction {
    title: string;
    description: string;
    scheduledTime?: Date;
    completed: boolean;
    completedAt?: Date;
    requiresCheckIn: boolean;
}

/**
 * Interface for a metric in a goal
 */
export interface IMetric {
    name: string;
    target: number;
    current: number;
    unit: string;
}

/**
 * Interface for a goal document
 */
export interface IGoal extends Document {
    userId: string;
    title: string;
    description: string;
    category: string;
    createdAt: Date;
    targetDate: Date;
    status: 'active' | 'completed' | 'failed';
    metrics: IMetric[];
    dailyActions: IDailyAction[];
    history: {
        type: string;
        description: string;
        timestamp: Date;
    }[];
    progress: {
        percentage: number;
        lastUpdated: Date;
        streak: number;
    };
}

/**
 * Schema for the Goal model
 */
const GoalSchema = new Schema<IGoal>(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        targetDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'failed'],
            default: 'active'
        },
        metrics: [{
            name: {
                type: String,
                required: true
            },
            target: {
                type: Number,
                required: true
            },
            current: {
                type: Number,
                default: 0
            },
            unit: {
                type: String,
                required: true
            }
        }],
        dailyActions: [{
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            scheduledTime: Date,
            completed: {
                type: Boolean,
                default: false
            },
            completedAt: Date,
            requiresCheckIn: {
                type: Boolean,
                default: false
            }
        }],
        history: [{
            type: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
        progress: {
            percentage: {
                type: Number,
                default: 0
            },
            lastUpdated: {
                type: Date,
                default: Date.now
            },
            streak: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

// Create indexes for efficient querying
GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ userId: 1, targetDate: 1 });
GoalSchema.index({ category: 1 });

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema); 