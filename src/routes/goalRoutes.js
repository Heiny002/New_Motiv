const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { authenticateUser } = require('../middleware/auth');
const { validateGoal } = require('../middleware/validation');

/**
 * @route   POST /api/goals
 * @desc    Create a new goal
 * @access  Private
 */
router.post('/', authenticateUser, validateGoal, async (req, res) => {
  try {
    const goalData = {
      ...req.body,
      userId: req.user.id
    };

    const goal = new Goal(goalData);
    
    // Add initial history entry
    await goal.addHistoryEntry('created', 'Goal created');
    
    // Save the goal
    await goal.save();

    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ 
      message: 'Error creating goal',
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/goals
 * @desc    Get all goals for the authenticated user
 * @access  Private
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ 
      message: 'Error fetching goals',
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/goals/:id
 * @desc    Get a specific goal by ID
 * @access  Private
 */
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ 
      message: 'Error fetching goal',
      error: error.message 
    });
  }
});

/**
 * @route   PUT /api/goals/:id
 * @desc    Update a goal
 * @access  Private
 */
router.put('/:id', authenticateUser, validateGoal, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Update goal fields
    Object.assign(goal, req.body);
    
    // Add history entry for modification
    await goal.addHistoryEntry('modified', 'Goal updated', {
      changes: req.body
    });
    
    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ 
      message: 'Error updating goal',
      error: error.message 
    });
  }
});

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a goal
 * @access  Private
 */
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await goal.remove();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ 
      message: 'Error deleting goal',
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/goals/:id/metrics
 * @desc    Add a new metric to a goal
 * @access  Private
 */
router.post('/:id/metrics', authenticateUser, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.metrics.push(req.body);
    await goal.addHistoryEntry('modified', 'New metric added', {
      metric: req.body
    });
    
    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error('Error adding metric:', error);
    res.status(500).json({ 
      message: 'Error adding metric',
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/goals/:id/actions
 * @desc    Add a new daily action to a goal
 * @access  Private
 */
router.post('/:id/actions', authenticateUser, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.dailyActions.push(req.body);
    await goal.addHistoryEntry('modified', 'New daily action added', {
      action: req.body
    });
    
    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error('Error adding daily action:', error);
    res.status(500).json({ 
      message: 'Error adding daily action',
      error: error.message 
    });
  }
});

/**
 * @route   PUT /api/goals/:id/actions/:actionId
 * @desc    Update a daily action's completion status
 * @access  Private
 */
router.put('/:id/actions/:actionId', authenticateUser, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const action = goal.dailyActions.id(req.params.actionId);
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    action.completed = req.body.completed;
    action.completedAt = req.body.completed ? new Date() : null;

    if (req.body.completed) {
      goal.progress.lastActionCompleted = new Date();
    }

    await goal.addHistoryEntry('modified', 'Daily action status updated', {
      actionId: req.params.actionId,
      completed: req.body.completed
    });
    
    await goal.updateProgress();
    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error('Error updating action:', error);
    res.status(500).json({ 
      message: 'Error updating action',
      error: error.message 
    });
  }
});

module.exports = router; 