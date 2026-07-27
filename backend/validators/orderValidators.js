const Joi = require('joi');

const createOrderSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      id: Joi.string().required().messages({
        'string.empty': 'Menu item ID is required',
        'any.required': 'Menu item ID is required'
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required'
      })
    })
  ).min(1).required().messages({
    'array.base': 'Products must be an array',
    'array.min': 'At least one menu item is required',
    'any.required': 'Products are required'
  }),
  orderType: Joi.string().valid('Dine-In', 'Takeaway', 'Delivery').default('Takeaway').messages({
    'any.only': 'Order type must be Dine-In, Takeaway, or Delivery'
  }),
  tableNumber: Joi.string().trim().when('orderType', {
    is: 'Dine-In',
    then: Joi.optional(),
    otherwise: Joi.forbidden() // Rejects table assignments if ordering for takeaway/delivery
  }),
  address: Joi.string().trim().when('orderType', {
    is: 'Delivery',
    then: Joi.required().messages({ 'any.required': 'Delivery address is required' }),
    otherwise: Joi.optional().allow('')
  }),
  city: Joi.string().trim().when('orderType', {
    is: 'Delivery',
    then: Joi.required().messages({ 'any.required': 'Delivery city is required' }),
    otherwise: Joi.optional().allow('')
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'Total bill amount must be a number',
    'any.required': 'Total bill amount is required'
  }),
  phone: Joi.string().trim().required().messages({
    'string.empty': 'Contact phone number is required',
    'any.required': 'Contact phone number is required'
  }),
  paymentMethod: Joi.string().valid('COD', 'Cash on Counter', 'Card', 'Online Payment').default('Cash on Counter')
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled').required().messages({
    'any.only': 'Status must be Pending, Preparing, Ready for Pickup, Completed, or Cancelled',
    'any.required': 'Kitchen status state is required'
  }),
  chefOrPackerName: Joi.string().trim().allow('').optional()
});

const getAllOrdersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid('Pending', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled', 'all').optional(),
  search: Joi.string().trim().allow('').optional(),
  sortBy: Joi.string().optional(),
  _t: Joi.number().optional() // Cache-busting timestamp added by axiosInstance interceptor
});

const getMetricsQuerySchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  _t: Joi.number().optional() // Cache-busting timestamp added by axiosInstance interceptor
});

const bulkDeleteOrdersSchema = Joi.object({
  orderIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.base': 'Order IDs must be an array',
    'array.min': 'At least one order ID is required',
    'any.required': 'Order IDs array is required'
  })
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  getAllOrdersQuerySchema,
  getMetricsQuerySchema,
  bulkDeleteOrdersSchema
};