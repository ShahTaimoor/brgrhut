const Joi = require('joi');

const createReviewSchema = Joi.object({
  customerName: Joi.string().trim().required().messages({
    'string.empty': 'Customer name is required',
    'any.required': 'Customer name is required'
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number between 1 and 5',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot be more than 5',
    'any.required': 'Rating is required'
  }),
  comment: Joi.string().trim().required().messages({
    'string.empty': 'Review text is required',
    'any.required': 'Review text is required'
  }),
  location: Joi.string().trim().allow('').optional()
});

const updateReviewSchema = Joi.object({
  customerName: Joi.string().trim().required().messages({
    'string.empty': 'Customer name is required',
    'any.required': 'Customer name is required'
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number between 1 and 5',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot be more than 5',
    'any.required': 'Rating is required'
  }),
  comment: Joi.string().trim().required().messages({
    'string.empty': 'Review text is required',
    'any.required': 'Review text is required'
  }),
  location: Joi.string().trim().allow('').optional(),
  active: Joi.boolean().optional()
});

module.exports = {
  createReviewSchema,
  updateReviewSchema
};
