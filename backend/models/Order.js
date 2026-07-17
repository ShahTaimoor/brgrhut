// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  amount: {
    type: Number, // Changed from String to Number for clean database calculations
    required: true,
  },
  orderType: {
    type: String,
    enum: ['Dine-In', 'Takeaway', 'Delivery'],
    required: true,
    default: 'Takeaway'
  },
  tableNumber: {
    type: String, // Optional field for Dine-In orders
    trim: true
  },
  address: {
    type: String,
    required: function() { return this.orderType === 'Delivery'; } // Only required if order is for home delivery
  },
  city: {
    type: String,
    required: function() { return this.orderType === 'Delivery'; } // Only required if order is for home delivery
  },
  phone: {
    type: String, // Changed to String to preserve leading zeros safely (e.g., 03xx)
    required: true,
  },
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
      },
      // Added a snapshot field to lock the historical price in case the menu price changes later
      priceAtPurchase: {
        type: Number,
        required: false
      }
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Cash on Counter', 'Card', 'Online Payment'],
    default: 'Cash on Counter',
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  chefOrPackerName: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Optimized Fast-Food Indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderType: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ isDeleted: 1 });
orderSchema.index({ status: 1, createdAt: -1 }); // Compound index for kitchen monitor boards

module.exports = mongoose.model('Order', orderSchema);