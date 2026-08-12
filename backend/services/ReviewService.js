const { reviewRepository } = require('../repositories');
const { uploadImageOnCloudinary, deleteImageOnCloudinary } = require('../utils/cloudinary');
const { NotFoundError } = require('../errors');

class ReviewService {
  async createReview(data, userId, file) {
    const { customerName, rating, comment, location } = data;

    let pictureData = undefined;

    // Only upload to Cloudinary if a customer photo was actually provided
    if (file) {
      const { secure_url, public_id } = await uploadImageOnCloudinary(file.buffer, 'reviews');
      pictureData = { secure_url, public_id };
    }

    return await reviewRepository.create({
      customerName,
      rating,
      comment,
      location: location || undefined,
      picture: pictureData,
      user: userId,
      active: true,
    });
  }

  async updateReview(id, updateData, file) {
    const { customerName, rating, comment, location, active } = updateData;

    const currentReview = await reviewRepository.findById(id);
    if (!currentReview) {
      throw new NotFoundError('Review not found');
    }

    const updateFields = { customerName, rating, comment };

    // location is optional - an explicitly empty string should clear it, but
    // an absent field (not sent at all) shouldn't wipe out the existing value
    if (location !== undefined) {
      updateFields.location = location;
    }

    if (active !== undefined) {
      updateFields.active = typeof active === 'string' ? active === 'true' : Boolean(active);
    }

    if (file) {
      const { secure_url, public_id } = await uploadImageOnCloudinary(file.buffer, 'reviews');

      if (currentReview.picture && currentReview.picture.public_id) {
        await deleteImageOnCloudinary(currentReview.picture.public_id);
      }

      updateFields.picture = { secure_url, public_id };
    }

    return await reviewRepository.updateOne({ _id: id }, updateFields);
  }

  async deleteReview(id) {
    const review = await reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.picture && review.picture.public_id) {
      await deleteImageOnCloudinary(review.picture.public_id);
    }

    await reviewRepository.deleteOne({ _id: id });

    return review;
  }

  // Admin listing - every review regardless of active status
  async getAllReviews() {
    return await reviewRepository.find({}, { sort: { createdAt: -1 } });
  }

  // Storefront listing - active reviews only
  async getActiveReviews() {
    return await reviewRepository.find({ active: true }, { sort: { createdAt: -1 } });
  }

  async toggleReviewActive(id) {
    const review = await reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    return await reviewRepository.updateOne({ _id: id }, { active: !review.active });
  }
}

module.exports = new ReviewService();
