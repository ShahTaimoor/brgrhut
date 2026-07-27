const express = require('express');
const cartController = require('../controllers/CartController');
const { isAuthorized } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  addItemSchema,
  removeItemSchema,
  updateItemQuantitySchema,
  checkStockSchema
} = require('../validators/cartValidators');

const router = express.Router();

router.get(
  '/',
  isAuthorized,
  cartController.getCart
);

router.post(
  '/add',
  isAuthorized,
  validate(addItemSchema),
  cartController.addItem
);

router.post(
  '/remove',
  isAuthorized,
  validate(removeItemSchema),
  cartController.removeItem
);

router.post(
  '/empty',
  isAuthorized,
  cartController.emptyCart
);

router.post(
  '/update',
  isAuthorized,
  validate(updateItemQuantitySchema),
  cartController.updateItemQuantity
);

// Public: guests need to validate stock/availability before checkout too, and this doesn't touch user data
router.post(
  '/check-stock',
  validate(checkStockSchema),
  cartController.checkStock
);

module.exports = router;
