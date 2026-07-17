const express = require('express');
const productController = require('../controllers/ProductController');
const { isAuthorized, isAdminOrSuperAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const validate = require('../middleware/validate');
const {
  createProductSchema,
  updateProductSchema,
  updateProductAvailabilitySchema, // Swapped from stock validator schema
  bulkUpdateFeaturedSchema,
  getProductsQuerySchema,
  searchQuerySchema,
  searchSuggestionsQuerySchema
} = require('../validators/productValidators');

const router = express.Router();

router.post(
  '/create-product',
  isAuthorized,
  isAdminOrSuperAdmin,
  upload.single('picture'),
  validate(createProductSchema),
  productController.createProduct
);

router.post(
  '/import-excel',
  isAuthorized,
  isAdminOrSuperAdmin,
  upload.single('excelFile'),
  productController.importExcel
);

router.put(
  '/update-product/:id',
  isAuthorized,
  isAdminOrSuperAdmin,
  upload.single('picture'),
  validate(updateProductSchema),
  productController.updateProduct
);

// Swapped endpoint path and mapped controller method to handle kitchen item availability
router.put(
  '/update-product-availability/:id',
  isAuthorized,
  isAdminOrSuperAdmin,
  validate(updateProductAvailabilitySchema),
  productController.updateProductAvailability
);

router.put(
  '/bulk-update-featured',
  isAuthorized,
  isAdminOrSuperAdmin,
  validate(bulkUpdateFeaturedSchema),
  productController.bulkUpdateFeatured
);

router.delete(
  '/delete-product/:id',
  isAuthorized,
  isAdminOrSuperAdmin,
  productController.deleteProduct
);

router.get(
  '/get-products',
  validate(getProductsQuerySchema, 'query'),
  productController.getProducts
);

router.get(
  '/search',
  validate(searchQuerySchema, 'query'),
  productController.searchProducts
);

router.get(
  '/search-suggestions',
  validate(searchSuggestionsQuerySchema, 'query'),
  productController.getSearchSuggestions
);

router.get(
  '/single-product/:id',
  productController.getSingleProduct
);

// Swapped endpoint path and controller to fetch the sold-out dishes count
router.get(
  '/sold-out-count',
  productController.getSoldOutCount
);

module.exports = router;