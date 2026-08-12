const express = require('express');
const reviewController = require('../controllers/ReviewController');
const { isAuthorized, isAdminOrSuperAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const validate = require('../middleware/validate');
const { createReviewSchema, updateReviewSchema } = require('../validators/reviewValidators');

const router = express.Router();

router.post(
  '/create-review',
  upload.single('picture'),
  isAuthorized,
  isAdminOrSuperAdmin,
  validate(createReviewSchema),
  reviewController.createReview
);

router.put(
  '/update-review/:id',
  upload.single('picture'),
  isAuthorized,
  isAdminOrSuperAdmin,
  validate(updateReviewSchema),
  reviewController.updateReview
);

router.delete(
  '/delete-review/:id',
  isAuthorized,
  isAdminOrSuperAdmin,
  reviewController.deleteReview
);

router.get(
  '/all-reviews',
  isAuthorized,
  isAdminOrSuperAdmin,
  reviewController.getAllReviews
);

// Public - powers the storefront testimonials section
router.get(
  '/active-reviews',
  reviewController.getActiveReviews
);

router.patch(
  '/toggle-review-active/:id',
  isAuthorized,
  isAdminOrSuperAdmin,
  reviewController.toggleReviewActive
);

module.exports = router;
