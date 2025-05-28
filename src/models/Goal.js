const mongoose = require('mongoose');

/**
 * Goal Schema
 * 
 * Represents a user's goal in the system. Goals have a hierarchical structure:
 * - High-level goal with title and description
 * - Specific metrics to track progress
 * - Daily actions that contribute to the goal
 * - Progress tracking and history
 */
const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  category: {
    type: String,
    required: true,
    enum: ['fitness', 'career', 'personal', 'health', 'other'],
    index: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  targetDate: {
    type: Date,
    required: true
  },
  
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'paused'],
    default: 'active',
    index: true
  },
  
  // Specific measurable aspects of the goal
  metrics: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    target: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    currentValue: {
      type: Number,
      default: 0
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],
  
  // Detailed daily action steps
  dailyActions: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily'
    },
    scheduledDays: [{
      type: Number,
      min: 0,
      max: 6
    }],
    scheduledTime: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    requiresCheckIn: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  
  // Log of goal modifications and major events
  history: [{
    type: {
      type: String,
      enum: ['created', 'modified', 'milestone', 'status_change'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  
  // Current progress data
  progress: {
    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    streak: {
      type: Number,
      default: 0
    },
    lastActionCompleted: Date,
    milestones: [{
      name: String,
      description: String,
      achievedAt: Date
    }]
  },
  
  // Coach-specific data
  coachData: {
    personality: {
      type: String,
      enum: ['sarge', 'dr_joy', 'vector'],
      default: 'sarge'
    },
    lastInteraction: Date,
    notes: String,
    customPrompts: [String]
  }
}, {
  timestamps: true
});

// Indexes for common queries
goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, category: 1 });
goalSchema.index({ userId: 1, createdAt: -1 });

// Virtual for time remaining
goalSchema.virtual('timeRemaining').get(function() {
  return this.targetDate - new Date();
});

// Method to update progress
goalSchema.methods.updateProgress = async function() {
  // Calculate overall progress based on metrics
  if (this.metrics.length > 0) {
    const totalProgress = this.metrics.reduce((sum, metric) => sum + metric.progress, 0);
    this.progress.overallProgress = Math.round(totalProgress / this.metrics.length);
  }
  
  // Update streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (this.progress.lastActionCompleted) {
    const lastAction = new Date(this.progress.lastActionCompleted);
    lastAction.setHours(0, 0, 0, 0);
    
    const dayDiff = Math.floor((today - lastAction) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      this.progress.streak += 1;
    } else if (dayDiff > 1) {
      this.progress.streak = 0;
    }
  }
  
  this.progress.lastUpdated = new Date();
  return this.save();
};

// Method to add history entry
goalSchema.methods.addHistoryEntry = async function(type, description, metadata = {}) {
  this.history.push({
    type,
    description,
    metadata,
    timestamp: new Date()
  });
  return this.save();
};

// Method to check if goal is on track
goalSchema.methods.isOnTrack = function() {
  const now = new Date();
  const timeElapsed = now - this.createdAt;
  const totalTime = this.targetDate - this.createdAt;
  const expectedProgress = (timeElapsed / totalTime) * 100;
  
  return this.progress.overallProgress >= expectedProgress;
};

// Pre-save middleware to validate data
goalSchema.pre('save', function(next) {
  // Ensure target date is in the future
  if (this.targetDate <= new Date()) {
    next(new Error('Target date must be in the future'));
  }
  
  // Validate metrics progress
  this.metrics.forEach(metric => {
    if (metric.progress < 0 || metric.progress > 100) {
      next(new Error('Metric progress must be between 0 and 100'));
    }
  });
  
  next();
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal; 