const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    emoji: {
        type: String,
        trim: true,
        default: "🍔" // Default fallback emoji for quick creation
    },
    picture: {
        secure_url: {
            type: String,
            required: false // Made optional for pure emoji-based categories
        },
        public_id: {
            type: String,
            required: false // Made optional for pure emoji-based categories
        },
    },
    position: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Indexes for frequently used fields
// (name/slug already get a unique index from `unique: true` above - adding
// another single-field index for them here previously triggered Mongoose's
// "Duplicate schema index" warning at startup)
categorySchema.index({ isDeleted: 1 });
categorySchema.index({ active: 1, isDeleted: 1 }); // Compound index for active categories

module.exports = mongoose.model('Category', categorySchema);