import mongoose, { Schema, Document } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
    userId: string;  // Firebase UID
    email: string;
    name: string;
    coachPersonality: string;
    created: Date;
    lastActive: Date;
    preferences: {
        notifications: {
            morningCheckIn: boolean;
            eveningCheckIn: boolean;
            goalReminders: boolean;
            communityUpdates: boolean;
        };
        theme: string;
        language: string;
    };
    dashboardConfig: {
        widgets: Array<{
            type: string;
            position: number;
            config: Record<string, any>;
        }>;
        layout: string;
    };
}

// User Schema
const userSchema = new Schema<IUser>({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    coachPersonality: {
        type: String,
        enum: ['sarge', 'dr_joy', 'vector'],
        default: 'sarge'
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    preferences: {
        notifications: {
            morningCheckIn: {
                type: Boolean,
                default: true
            },
            eveningCheckIn: {
                type: Boolean,
                default: true
            },
            goalReminders: {
                type: Boolean,
                default: true
            },
            communityUpdates: {
                type: Boolean,
                default: true
            }
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        language: {
            type: String,
            default: 'en'
        }
    },
    dashboardConfig: {
        widgets: [{
            type: {
                type: String,
                required: true
            },
            position: {
                type: Number,
                required: true
            },
            config: {
                type: Schema.Types.Mixed,
                default: {}
            }
        }],
        layout: {
            type: String,
            enum: ['default', 'compact', 'detailed'],
            default: 'default'
        }
    }
}, {
    timestamps: true
});

// Index for efficient queries
userSchema.index({ lastActive: -1 });
userSchema.index({ 'preferences.notifications.morningCheckIn': 1 });

// Create and export the model
export const User = mongoose.model<IUser>('User', userSchema); 