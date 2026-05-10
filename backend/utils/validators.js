const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const tripValidators = {
  create: [
    body('title').trim().notEmpty().withMessage('Trip title is required'),
    body('description').optional().trim(),
    body('start_date').optional().isISO8601().withMessage('Invalid start date'),
    body('end_date').optional().isISO8601().withMessage('Invalid end date'),
    handleValidationErrors
  ],
  update: [
    param('id').isInt().withMessage('Invalid trip ID'),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('start_date').optional().isISO8601(),
    body('end_date').optional().isISO8601(),
    handleValidationErrors
  ]
};

const stopValidators = {
  create: [
    body('trip_id').isInt().withMessage('Invalid trip ID'),
    body('city').trim().notEmpty().withMessage('City name is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('start_date').optional().isISO8601(),
    body('end_date').optional().isISO8601(),
    handleValidationErrors
  ]
};

const activityValidators = {
  create: [
    body('stop_id').isInt().withMessage('Invalid stop ID'),
    body('title').trim().notEmpty().withMessage('Activity title is required'),
    body('category').optional().trim(),
    body('estimated_cost').optional().isDecimal().withMessage('Invalid cost'),
    handleValidationErrors
  ]
};

module.exports = {
  tripValidators,
  stopValidators,
  activityValidators,
  handleValidationErrors
};