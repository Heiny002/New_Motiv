const Goal = require('../models/Goal');

/**
 * ProgressTrackingService
 * 
 * Service for tracking and analyzing goal progress, including:
 * - Progress data collection
 * - Milestone detection
 * - Trend analysis
 * - Progress visualization data
 */
class ProgressTrackingService {
  /**
   * Update progress for a goal
   * @param {string} goalId - The goal ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The updated goal
   */
  async updateProgress(goalId, userId) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    await goal.updateProgress();
    await this.checkMilestones(goal);
    await goal.save();

    return goal;
  }

  /**
   * Check for and add new milestones
   * @param {Object} goal - The goal object
   * @returns {Promise<void>}
   */
  async checkMilestones(goal) {
    const progress = goal.progress.overallProgress;
    const existingMilestones = goal.progress.milestones.map(m => m.name);

    // Define milestone thresholds
    const milestones = [
      { threshold: 25, name: 'Quarter Complete' },
      { threshold: 50, name: 'Halfway There' },
      { threshold: 75, name: 'Three Quarters Complete' },
      { threshold: 90, name: 'Almost There' },
      { threshold: 100, name: 'Goal Achieved' }
    ];

    // Check for new milestones
    for (const milestone of milestones) {
      if (progress >= milestone.threshold && !existingMilestones.includes(milestone.name)) {
        goal.progress.milestones.push({
          name: milestone.name,
          description: `Reached ${milestone.threshold}% of goal`,
          achievedAt: new Date()
        });

        await goal.addHistoryEntry('milestone', `Achieved milestone: ${milestone.name}`);
      }
    }
  }

  /**
   * Get progress trends for a goal
   * @param {string} goalId - The goal ID
   * @param {string} userId - The user ID
   * @param {string} timeframe - The timeframe to analyze ('week', 'month', 'all')
   * @returns {Promise<Object>} Progress trend data
   */
  async getProgressTrends(goalId, userId, timeframe = 'week') {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    // Get history entries within timeframe
    const now = new Date();
    let startDate;
    switch (timeframe) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'all':
        startDate = goal.createdAt;
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const relevantHistory = goal.history.filter(entry => 
      entry.timestamp >= startDate && 
      (entry.type === 'modified' || entry.type === 'milestone')
    );

    // Calculate trends
    const trends = {
      progressRate: this.calculateProgressRate(goal, startDate),
      consistencyScore: this.calculateConsistencyScore(goal, startDate),
      actionCompletionRate: this.calculateActionCompletionRate(goal, startDate),
      milestoneFrequency: this.calculateMilestoneFrequency(goal, startDate)
    };

    return {
      trends,
      history: relevantHistory,
      currentProgress: goal.progress.overallProgress,
      isOnTrack: goal.isOnTrack()
    };
  }

  /**
   * Calculate the rate of progress over time
   * @param {Object} goal - The goal object
   * @param {Date} startDate - The start date for calculation
   * @returns {number} Progress rate (percentage per day)
   */
  calculateProgressRate(goal, startDate) {
    const timeElapsed = (new Date() - startDate) / (1000 * 60 * 60 * 24); // days
    const progressMade = goal.progress.overallProgress;
    return progressMade / timeElapsed;
  }

  /**
   * Calculate consistency score based on action completion
   * @param {Object} goal - The goal object
   * @param {Date} startDate - The start date for calculation
   * @returns {number} Consistency score (0-100)
   */
  calculateConsistencyScore(goal, startDate) {
    const actions = goal.dailyActions.filter(action => 
      action.completedAt && action.completedAt >= startDate
    );

    const totalActions = goal.dailyActions.length;
    if (totalActions === 0) return 0;

    const completedActions = actions.length;
    return (completedActions / totalActions) * 100;
  }

  /**
   * Calculate action completion rate
   * @param {Object} goal - The goal object
   * @param {Date} startDate - The start date for calculation
   * @returns {number} Action completion rate (0-100)
   */
  calculateActionCompletionRate(goal, startDate) {
    const actions = goal.dailyActions.filter(action => 
      action.completedAt && action.completedAt >= startDate
    );

    const totalActions = goal.dailyActions.length;
    if (totalActions === 0) return 0;

    const completedActions = actions.length;
    return (completedActions / totalActions) * 100;
  }

  /**
   * Calculate milestone frequency
   * @param {Object} goal - The goal object
   * @param {Date} startDate - The start date for calculation
   * @returns {number} Milestones per week
   */
  calculateMilestoneFrequency(goal, startDate) {
    const milestones = goal.progress.milestones.filter(milestone => 
      milestone.achievedAt >= startDate
    );

    const weeksElapsed = (new Date() - startDate) / (1000 * 60 * 60 * 24 * 7);
    return milestones.length / weeksElapsed;
  }

  /**
   * Get visualization data for progress
   * @param {string} goalId - The goal ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Visualization data
   */
  async getVisualizationData(goalId, userId) {
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new Error('Goal not found');
    }

    // Prepare data for charts
    const metricProgress = goal.metrics.map(metric => ({
      name: metric.name,
      current: metric.currentValue,
      target: metric.target,
      progress: metric.progress
    }));

    const actionCompletion = goal.dailyActions.map(action => ({
      title: action.title,
      completed: action.completed,
      completedAt: action.completedAt
    }));

    const milestoneTimeline = goal.progress.milestones.map(milestone => ({
      name: milestone.name,
      achievedAt: milestone.achievedAt
    }));

    return {
      metricProgress,
      actionCompletion,
      milestoneTimeline,
      overallProgress: goal.progress.overallProgress,
      streak: goal.progress.streak,
      timeRemaining: goal.timeRemaining
    };
  }

  /**
   * Get progress summary for dashboard
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Progress summary
   */
  async getProgressSummary(userId) {
    const goals = await Goal.find({ userId });
    
    const summary = {
      totalGoals: goals.length,
      activeGoals: goals.filter(g => g.status === 'active').length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      averageProgress: 0,
      totalStreak: 0,
      recentMilestones: []
    };

    if (goals.length > 0) {
      // Calculate average progress
      summary.averageProgress = goals.reduce((sum, goal) => 
        sum + goal.progress.overallProgress, 0) / goals.length;

      // Calculate total streak
      summary.totalStreak = goals.reduce((sum, goal) => 
        sum + goal.progress.streak, 0);

      // Get recent milestones
      const allMilestones = goals.flatMap(goal => 
        goal.progress.milestones.map(milestone => ({
          ...milestone,
          goalTitle: goal.title
        }))
      );

      summary.recentMilestones = allMilestones
        .sort((a, b) => b.achievedAt - a.achievedAt)
        .slice(0, 5);
    }

    return summary;
  }
}

module.exports = new ProgressTrackingService(); 