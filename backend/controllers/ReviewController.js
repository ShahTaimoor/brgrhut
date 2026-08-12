const reviewService = require('../services/ReviewService');

class ReviewController {
  async createReview(req, res, next) {
    try {
      const userId = req.user.id;
      const file = req.file;

      const review = await reviewService.createReview(req.body, userId, file);

      return res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
      const { id } = req.params;
      const file = req.file;

      const review = await reviewService.updateReview(id, req.body, file);

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const { id } = req.params;

      const review = await reviewService.deleteReview(id);

      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllReviews(req, res, next) {
    try {
      const reviews = await reviewService.getAllReviews();

      return res.status(200).json({
        success: true,
        message: reviews.length > 0 ? 'Reviews fetched successfully' : 'No reviews found',
        data: reviews
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveReviews(req, res, next) {
    try {
      const reviews = await reviewService.getActiveReviews();

      return res.status(200).json({
        success: true,
        message: 'Active reviews fetched successfully',
        data: reviews
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleReviewActive(req, res, next) {
    try {
      const { id } = req.params;

      const review = await reviewService.toggleReviewActive(id);

      return res.status(200).json({
        success: true,
        message: `Review ${review.active ? 'activated' : 'deactivated'} successfully`,
        data: review
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();
