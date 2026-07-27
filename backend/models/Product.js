const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    // Percentage off the base price (0-100), shown as a strikethrough discount on the menu
    discountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Fast food is made-to-order, so we swap stock counts for a simple availability toggle
    isAvailable: {
        type: Boolean,
        default: true
    },
    // Cooking / preparation time in minutes
    prepTime: {
        type: Number,
        default: 15
    },
    // Food tags for menu badges
    isSpicy: {
        type: Boolean,
        default: false
    },
    isVegetarian: {
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    picture: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// Optimized Indexes for Fast Food Queries
productSchema.index({ category: 1, isAvailable: 1, isDeleted: 1 }); // Quick menu filtering
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: -1, isAvailable: 1, createdAt: -1 }); // Feature listings first

// Availability and Soft-delete indexing
productSchema.index({ isAvailable: 1 });
productSchema.index({ isDeleted: 1 });

// Text search index for optimized search functionality
productSchema.index({ 
    title: 'text', 
    description: 'text',
    tags: 'text'
}, {
    weights: {
        title: 10,       // Title matches are weighted highest
        tags: 8,         // Food tags (e.g., "spicy", "double-patty")
        description: 5   // Main descriptions
    },
    name: 'text_search_index'
});

module.exports = mongoose.model('Product', productSchema)