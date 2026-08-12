const Review = require('../../models/Review');
const IReviewRepository = require('../interfaces/IReviewRepository');

class ReviewRepository extends IReviewRepository {
  _mergeQuery(query, includeDeleted = false) {
    const mergedQuery = { ...query };
    if (!includeDeleted) {
      mergedQuery.isDeleted = { $ne: true };
    }
    return mergedQuery;
  }

  async findById(id, includeDeleted = false) {
    const query = this._mergeQuery({ _id: id }, includeDeleted);
    return await Review.findOne(query).lean();
  }

  async findOne(query, includeDeleted = false) {
    const mergedQuery = this._mergeQuery(query, includeDeleted);
    return await Review.findOne(mergedQuery).lean();
  }

  async find(query, options = {}, includeDeleted = false) {
    const { sort = {}, limit = null } = options;
    const mergedQuery = this._mergeQuery(query, includeDeleted);

    let queryBuilder = Review.find(mergedQuery);

    if (Object.keys(sort).length > 0) {
      queryBuilder = queryBuilder.sort(sort);
    }

    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }

    return await queryBuilder.lean();
  }

  async create(reviewData) {
    const review = new Review(reviewData);
    return await review.save();
  }

  async updateOne(query, updateData) {
    return await Review.findOneAndUpdate(query, updateData, { new: true }).lean();
  }

  async deleteOne(query) {
    // Soft delete: set isDeleted to true
    return await Review.findOneAndUpdate(query, { isDeleted: true }, { new: true }).lean();
  }

  async countDocuments(query, includeDeleted = false) {
    const mergedQuery = this._mergeQuery(query, includeDeleted);
    return await Review.countDocuments(mergedQuery);
  }
}

module.exports = ReviewRepository;
