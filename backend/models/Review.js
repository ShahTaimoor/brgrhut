const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    // Optional - the public testimonials card only shows this line when present
    location: {
        type: String,
        trim: true
    },
    // Optional - falls back to initials on the storefront when not provided
    picture: {
        secure_url: {
            type: String,
            required: false
        },
        public_id: {
            type: String,
            required: false
        },
    },
    // Lets admin curate what's live on the storefront without deleting history
    active: {
        type: Boolean,
        default: true
    },
    // Admin who created/entered this review, for audit purposes
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

reviewSchema.index({ active: 1, isDeleted: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
