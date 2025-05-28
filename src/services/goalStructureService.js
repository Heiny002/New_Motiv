const Goal = require('../models/Goal');

/**
 * GoalStructureService
 * 
 * Service for managing goal structure components including:
 * - High-level goal management
 * - Specific metrics tracking
 * - Daily action planning
 * - Goal modification process
 */
class GoalStructureService {
  /**
   * Create a new high-level goal
   * @param {Object} goalData - The goal data
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The created goal
   */
  async createHighLevelGoal(goalData, userId) {
    const goal = new Goal({
      ...goalData,
      userId,
      metrics: [],
      dailyActions: []
    });

    await goal.addHistoryEntry('created', 'High-level goal created');
    await goal.save();
    return goal;
  }

  /**
   * Add a metric to a goal
   * @param {string} goalId - The goal ID
   * @param {Object} metricData - The metric data
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The updated goal
   */
  async addMetric(goalId, metricData, userId) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    goal.metrics.push(metricData);
    await goal.addHistoryEntry('modified', 'New metric added', { metric: metricData });
    await goal.updateProgress();
    await goal.save();

    return goal;
  }

  /**
   * Update a metric's progress
   * @param {string} goalId - The goal ID
   * @param {string} metricId - The metric ID
   * @param {number} newValue - The new metric value
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The updated goal
   */
  async updateMetricProgress(goalId, metricId, newValue, userId) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    const metric = goal.metrics.id(metricId);
    if (!metric) {
      throw new Error('Metric not found');
    }

    metric.currentValue = newValue;
    metric.progress = Math.min(100, (newValue / metric.target) * 100);

    await goal.addHistoryEntry('modified', 'Metric progress updated', {
      metricId,
      newValue,
      progress: metric.progress
    });

    await goal.updateProgress();
    await goal.save();

    return goal;
  }

  /**
   * Add a daily action to a goal
   * @param {string} goalId - The goal ID
   * @param {Object} actionData - The action data
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The updated goal
   */
  async addDailyAction(goalId, actionData, userId) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    goal.dailyActions.push(actionData);
    await goal.addHistoryEntry('modified', 'New daily action added', { action: actionData });
    await goal.save();

    return goal;
  }

  /**
   * Update a daily action's completion status
   * @param {string} goalId - The goal ID
   * @param {string} actionId - The action ID
   * @param {boolean} completed - Whether the action is completed
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The updated goal
   */
  async updateActionStatus(goalId, actionId, completed, userId) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    const action = goal.dailyActions.id(actionId);
    if (!action) {
      throw new Error('Action not found');
    }

    action.completed = completed;
    action.completedAt = completed ? new Date() : null;

    if (completed) {
      goal.progress.lastActionCompleted = new Date();
    }

    await goal.addHistoryEntry('modified', 'Daily action status updated', {
      actionId,
      completed
    });

    await goal.updateProgress();
    await goal.save();

    return goal;
  }

  /**
   * Modify a goal through discussion with coach
   * @param {string} goalId - The goal ID
   * @param {Object} modifications - The modifications to apply
   * @param {string} userId - The user ID
   * @param {string} coachNotes - Notes from the coach about the modification
   * @returns {Promise<Object>} The updated goal
   */
  async modifyGoal(goalId, modifications, userId, coachNotes) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    // Apply modifications
    Object.assign(goal, modifications);

    // Update coach notes
    if (coachNotes) {
      goal.coachData.notes = coachNotes;
      goal.coachData.lastInteraction = new Date();
    }

    await goal.addHistoryEntry('modified', 'Goal modified through coach discussion', {
      modifications,
      coachNotes
    });

    await goal.updateProgress();
    await goal.save();

    return goal;
  }

  /**
   * Get goal structure summary
   * @param {string} goalId - The goal ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The goal structure summary
   */
  async getGoalStructure(goalId, userId) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    return {
      highLevel: {
        title: goal.title,
        description: goal.description,
        category: goal.category,
        targetDate: goal.targetDate,
        status: goal.status
      },
      metrics: goal.metrics.map(metric => ({
        id: metric._id,
        name: metric.name,
        target: metric.target,
        currentValue: metric.currentValue,
        progress: metric.progress,
        unit: metric.unit
      })),
      dailyActions: goal.dailyActions.map(action => ({
        id: action._id,
        title: action.title,
        description: action.description,
        frequency: action.frequency,
        scheduledTime: action.scheduledTime,
        scheduledDays: action.scheduledDays,
        requiresCheckIn: action.requiresCheckIn,
        completed: action.completed,
        completedAt: action.completedAt
      })),
      progress: {
        overallProgress: goal.progress.overallProgress,
        streak: goal.progress.streak,
        lastActionCompleted: goal.progress.lastActionCompleted,
        milestones: goal.progress.milestones
      }
    };
  }
}

module.exports = new GoalStructureService(); 