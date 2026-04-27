const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  deliveryTime: {
    type: String,
    enum: ['morning', 'evening'],
    default: 'morning'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  pricing: {
    itemPrice: Number,
    discount: {
      type: Number,
      default: 10
    },
    finalPrice: Number
  },
  nextDeliveryDate: Date,
  pausedUntil: Date
}, {
  timestamps: true
});

// Calculate next delivery date
subscriptionSchema.methods.calculateNextDelivery = function() {
  const now = new Date();
  let next = new Date(this.nextDeliveryDate || this.startDate);
  
  switch(this.frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
  }
  
  this.nextDeliveryDate = next;
  return next;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
