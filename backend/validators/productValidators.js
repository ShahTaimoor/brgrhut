const Joi = require('joi');

const createProductSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  description: Joi.string().trim().allow('').optional(),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be positive',
    'any.required': 'Price is required'
  }),
  discountPercent: Joi.number().min(0).max(100).optional().messages({
    'number.base': 'Discount must be a number',
    'number.min': 'Discount cannot be negative',
    'number.max': 'Discount cannot exceed 100%'
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required',
    'any.required': 'Category is required'
  }),
  prepTime: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Preparation time must be a number',
    'number.integer': 'Preparation time must be an integer'
  }),
  isSpicy: Joi.boolean().optional(),
  isVegetarian: Joi.boolean().optional(),
  isAvailable: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional()
});

const updateProductSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().allow('').optional(),
  price: Joi.number().positive().optional().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be positive'
  }),
  discountPercent: Joi.number().min(0).max(100).optional().messages({
    'number.base': 'Discount must be a number',
    'number.min': 'Discount cannot be negative',
    'number.max': 'Discount cannot exceed 100%'
  }),
  category: Joi.string().optional(),
  prepTime: Joi.number().integer().min(0).optional(),
  isSpicy: Joi.boolean().optional(),
  isVegetarian: Joi.boolean().optional(),
  isAvailable: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional()
});

// Swapped out from stock count validation to clean toggle boolean validation
const updateProductAvailabilitySchema = Joi.object({
  isAvailable: Joi.boolean().required().messages({
    'boolean.base': 'Availability must be a boolean value',
    'any.required': 'Availability state toggle is required'
  })
});

const bulkUpdateFeaturedSchema = Joi.object({
  productIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.base': 'Product IDs must be an array',
    'array.min': 'At least one product ID is required',
    'any.required': 'Product IDs array is required'
  }),
  isFeatured: Joi.boolean().required().messages({
    'boolean.base': 'isFeatured must be a boolean',
    'any.required': 'isFeatured value is required'
  })
});

const getProductsQuerySchema = Joi.object({
  category: Joi.string().trim().allow('').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.alternatives().try(
    Joi.number().integer().min(1),
    Joi.string().valid('all')
  ).optional(),
  // Supports all frontend filter values: 'active', 'sold-out', 'all', 'low-stock', 'available'
  availabilityFilter: Joi.string().valid('active', 'available', 'sold-out', 'all', 'low-stock').optional(),
  // Supports all sort options including admin dashboard stock sorts
  sortBy: Joi.string().valid('az', 'za', 'price-low', 'price-high', 'newest', 'oldest', 'prep-fast', 'relevance', 'stock-low', 'stock-high').optional(),
  _t: Joi.number().optional() // Cache-busting timestamp added by axiosInstance interceptor
});

const searchQuerySchema = Joi.object({
  q: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Search query is required',
    'string.min': 'Search query cannot be empty',
    'any.required': 'Search query is required'
  }),
  limit: Joi.number().integer().min(1).max(100).optional(),
  page: Joi.number().integer().min(1).optional(),
  _t: Joi.number().optional()
});

const searchSuggestionsQuerySchema = Joi.object({
  q: Joi.string().trim().min(2).optional(),
  limit: Joi.number().integer().min(1).max(8).optional(),
  _t: Joi.number().optional()
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  updateProductAvailabilitySchema, // Exporting the new schema name
  bulkUpdateFeaturedSchema,
  getProductsQuerySchema,
  searchQuerySchema,
  searchSuggestionsQuerySchema
};