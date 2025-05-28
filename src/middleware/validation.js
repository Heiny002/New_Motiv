const { body, validationResult } = require('express-validator');

/**
 * Validates goal data
 */
const validateGoal = [
  // Title validation
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  
  // Description validation
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  // Category validation
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['fitness', 'career', 'personal', 'health', 'other'])
    .withMessage('Invalid category'),
  
  // Target date validation
  body('targetDate')
    .notEmpty()
    .withMessage('Target date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const targetDate = new Date(value);
      const now = new Date();
      if (targetDate <= now) {
        throw new Error('Target date must be in the future');
      }
      return true;
    }),
  
  // Metrics validation
  body('metrics')
    .optional()
    .isArray()
    .withMessage('Metrics must be an array')
    .custom((metrics) => {
      if (!metrics) return true;
      
      for (const metric of metrics) {
        if (!metric.name || !metric.target || !metric.unit) {
          throw new Error('Each metric must have a name, target, and unit');
        }
        
        if (typeof metric.target !== 'number' || metric.target <= 0) {
          throw new Error('Metric target must be a positive number');
        }
        
        if (metric.progress && (metric.progress < 0 || metric.progress > 100)) {
          throw new Error('Metric progress must be between 0 and 100');
        }
      }
      return true;
    }),
  
  // Daily actions validation
  body('dailyActions')
    .optional()
    .isArray()
    .withMessage('Daily actions must be an array')
    .custom((actions) => {
      if (!actions) return true;
      
      for (const action of actions) {
        if (!action.title) {
          throw new Error('Each action must have a title');
        }
        
        if (action.frequency && !['daily', 'weekly', 'custom'].includes(action.frequency)) {
          throw new Error('Invalid action frequency');
        }
        
        if (action.scheduledTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(action.scheduledTime)) {
          throw new Error('Invalid time format (use HH:MM)');
        }
        
        if (action.scheduledDays) {
          if (!Array.isArray(action.scheduledDays)) {
            throw new Error('Scheduled days must be an array');
          }
          
          for (const day of action.scheduledDays) {
            if (typeof day !== 'number' || day < 0 || day > 6) {
              throw new Error('Invalid day number (0-6)');
            }
          }
        }
      }
      return true;
    }),
  
  // Status validation
  body('status')
    .optional()
    .isIn(['active', 'completed', 'failed', 'paused'])
    .withMessage('Invalid status'),
  
  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validates metric data
 */
const validateMetric = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Metric name is required')
    .isLength({ max: 50 })
    .withMessage('Metric name must be less than 50 characters'),
  
  body('target')
    .notEmpty()
    .withMessage('Target value is required')
    .isNumeric()
    .withMessage('Target must be a number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Target must be greater than 0');
      }
      return true;
    }),
  
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit is required')
    .isLength({ max: 20 })
    .withMessage('Unit must be less than 20 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Validates daily action data
 */
const validateDailyAction = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Action title is required')
    .isLength({ max: 100 })
    .withMessage('Action title must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'custom'])
    .withMessage('Invalid frequency'),
  
  body('scheduledTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (use HH:MM)'),
  
  body('scheduledDays')
    .optional()
    .isArray()
    .withMessage('Scheduled days must be an array')
    .custom((days) => {
      if (!days) return true;
      
      for (const day of days) {
        if (typeof day !== 'number' || day < 0 || day > 6) {
          throw new Error('Invalid day number (0-6)');
        }
      }
      return true;
    }),
  
  body('requiresCheckIn')
    .optional()
    .isBoolean()
    .withMessage('requiresCheckIn must be a boolean'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateGoal,
  validateMetric,
  validateDailyAction
}; 